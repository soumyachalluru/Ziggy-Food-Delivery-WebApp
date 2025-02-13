# Generated by Django 4.2.16 on 2024-10-27 23:31

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_cartitem_cart_remove_cartitem_dish_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='address',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='restaurant',
            name='images',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.restaurant_image_upload_path),
        ),
    ]
