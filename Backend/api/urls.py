from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import *

router = DefaultRouter()
router.register(r"restaurants", RestaurantViewSet)
router.register(r"customers", CustomerViewSet)
router.register(r"dishes", DishViewSet)
router.register(r"orders", OrderViewSet)

urlpatterns = [
    path("", include(router.urls)),

    path("restaurants/<int:id>/dishes/", RestaurantDishesViewSet.as_view()),

    path("restaurant/signup/", RestaurantSignupView.as_view(), name="restaurant_signup"),
    path("customer/signup/", CustomerSignupView.as_view(), name="customer_signup"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('customer/profile/', customer_profile, name='customer-profile'),
]
