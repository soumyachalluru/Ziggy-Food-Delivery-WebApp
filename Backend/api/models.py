import os


from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.text import slugify




class ZiggyUser(AbstractUser):
   is_restaurant = models.BooleanField(default=False)
   is_customer = models.BooleanField(default=False)




def restaurant_image_upload_path(instance, filename):
   # Extract the file extension
   ext = filename.split(".")[-1]
   # Generate a new filename using the user's ID
   filename = f"{slugify(instance.user.id)}.{ext}"
   return os.path.join("restaurant_images", filename)




class Restaurant(models.Model):
   user = models.OneToOneField(
       ZiggyUser, on_delete=models.CASCADE, related_name="restaurant_profile"
   )
   name = models.CharField(max_length=255)
   location = models.CharField(max_length=255)
   description = models.TextField()
   contact_info = models.CharField(max_length=100)
   images = models.ImageField(upload_to=restaurant_image_upload_path, blank=True, null=True)
   timings = models.CharField(max_length=100)


   def __str__(self):
       return self.name




class Customer(models.Model):
   user = models.OneToOneField(
       ZiggyUser, on_delete=models.CASCADE, related_name="customer_profile"
   )
   favorites = models.ManyToManyField(
       Restaurant, related_name="favorite_customers", blank=True
   )
   address = models.TextField(default="")


   def __str__(self):
       return self.user.username




class Dish(models.Model):
   CATEGORY_CHOICES = [
       ("APPETIZER", "Appetizer"),
       ("SALAD", "Salad"),
       ("MAIN_COURSE", "Main Course"),
   ]


   restaurant = models.ForeignKey(
       Restaurant, on_delete=models.CASCADE, related_name="dishes"
   )
   name = models.CharField(max_length=100)
   ingredients = models.TextField(null=True)
   price = models.DecimalField(max_digits=6, decimal_places=2)
   image = models.ImageField(upload_to="dish_images/", blank=True, null=True)
   description = models.TextField()
   category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="MAIN_COURSE")


   def __str__(self):
       return self.name




class Order(models.Model):
   STATUS_CHOICES = [
       ("NEW", "New"),
       ("DELIVERED", "Delivered"),
       ("CANCELLED", "Cancelled"),
   ]


   customer = models.ForeignKey(
       Customer, on_delete=models.CASCADE, related_name="orders"
   )
   restaurant = models.ForeignKey(
       Restaurant, on_delete=models.CASCADE, related_name="orders"
   )
   status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="NEW")
   delivery_address = models.CharField(max_length=255)


   def __str__(self):
       return f"Order {self.id} by {self.customer.user.username}"




class OrderItem(models.Model):
   order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
   dish = models.ForeignKey(Dish, on_delete=models.CASCADE)
   quantity = models.PositiveIntegerField(default=1)


   def __str__(self):
       return f"{self.quantity} x {self.dish.name}"
