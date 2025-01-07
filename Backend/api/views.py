from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import JSONParser
from .models import *
from .serializers import (CustomerSerializer, DishSerializer, OrderSerializer, OrderItemSerializer,
                          RestaurantSerializer, UserSerializer)


class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [AllowAny]

class RestaurantDishesViewSet(viewsets.generics.ListAPIView):
    serializer_class = DishSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        res_id = self.kwargs.get('id')
        return Dish.objects.filter(restaurant=res_id)

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        restaurant = Restaurant.objects.get(user=request.user)
        return Response(
            [DishSerializer(dish).data for dish in  Dish.objects.filter(restaurant=restaurant)]
        )


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        if request.user.is_customer:
            customer = Customer.objects.get(user=request.user)
            orders = [{
                **OrderSerializer(order).data, 
                "restaurant": RestaurantSerializer(order.restaurant).data,
            } for order in Order.objects.select_related('restaurant').filter(customer=customer)]
            return Response(orders)
        else:
            restaurant = Restaurant.objects.get(user=request.user)
            orders = [{
                **OrderSerializer(order).data, 
                "customer": {
                    **CustomerSerializer(order.customer).data,
                    **UserSerializer(order.customer.user).data
                }
            } for order in Order.objects.select_related('customer').filter(restaurant=restaurant)]
            return Response(orders)

    def retrieve(self, request, *args, **kwargs):
        order_id = self.kwargs.get('pk')
        o = Order.objects.get(id=order_id)
        order = OrderSerializer(o).data
        customer = CustomerSerializer(o.customer).data
        restaurant = RestaurantSerializer(o.restaurant).data
        items = [{ **OrderItemSerializer(item).data, **DishSerializer(item.dish).data} for item in OrderItem.objects.select_related('dish').filter(order_id=order_id)]
        return Response(
            {**order, "items": items, "restaurant": restaurant, "customer": { **customer, **UserSerializer(o.customer.user).data }}
        )

    def create(self, request, *args, **kwargs):
        data = request.data
        customer = Customer.objects.get(user=request.user)
        restaurant = Restaurant.objects.get(id=data["restaurant_id"])
        order = Order.objects.create(
            customer=customer,
            restaurant=restaurant,
            delivery_address=data["delivery_address"],
        )
        for item in data["items"]:
            dish = Dish.objects.get(id=item["dish_id"])
            OrderItem.objects.create(order=order, dish=dish, quantity=item["quantity"])
        return Response(
            {"status": "Order placed successfully"}, status=status.HTTP_201_CREATED
        )

class RestaurantSignupView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        images = request.FILES.get('images')
        user = ZiggyUser.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            is_restaurant=True,
        )
        restaurant = Restaurant.objects.create(
            user=user,
            name=data["name"],
            location=data["location"],
            description=data["description"],
            contact_info=data["contact_info"],
            images=images
        )
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "restaurant": RestaurantSerializer(restaurant).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class CustomerSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        user = ZiggyUser.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            is_customer=True,
        )
        customer = Customer.objects.create(
            user=user
            )
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "customer": CustomerSerializer(customer).data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["is_restaurant"] = user.is_restaurant
        token["is_customer"] = user.is_customer
        token["role_id"] = user.restaurant_profile.id if user.is_restaurant else user.customer_profile.id
        if user.is_customer:
            token["address"] = user.customer_profile.address

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except AuthenticationFailed:
            return Response(
                {"detail": "Invalid username or password. Please try again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def customer_profile(request):
    try:
        customer = Customer.objects.get(user=request.user)
    except Customer.DoesNotExist:
        return Response({"error": "Customer profile not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        # Fetching the customer profile
        customer_data = CustomerSerializer(customer).data
        user_data = UserSerializer(request.user).data
        response_data = {**user_data, **customer_data}
        return Response(response_data)

    elif request.method == 'PUT':
        # Updating the customer profile
        data = JSONParser().parse(request)
        user_serializer = UserSerializer(request.user, data=data, partial=True)
        customer_serializer = CustomerSerializer(customer, data=data, partial=True)

        if user_serializer.is_valid() and customer_serializer.is_valid():
            user_serializer.save()
            customer_serializer.save()
            return Response({**user_serializer.data, **customer_serializer.data})
        return Response(user_serializer.errors or customer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
