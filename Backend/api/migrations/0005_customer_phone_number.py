# Generated by Django 4.2.16 on 2024-10-28 22:26

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0004_alter_dish_category_alter_dish_ingredients"),
    ]

    operations = [
        migrations.AddField(
            model_name="customer",
            name="phone_number",
            field=models.CharField(blank=True, max_length=15, null=True),
        ),
    ]