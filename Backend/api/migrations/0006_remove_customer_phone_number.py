# Generated by Django 4.2.16 on 2024-10-28 22:34

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0005_customer_phone_number"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="customer",
            name="phone_number",
        ),
    ]