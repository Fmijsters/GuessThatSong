# Generated by Django 4.2.4 on 2023-08-19 13:46

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("GTS", "0005_alter_pub_type"),
    ]

    operations = [
        migrations.AlterField(
            model_name="pub",
            name="name",
            field=models.CharField(max_length=64, unique=True),
        ),
        migrations.AlterField(
            model_name="pub",
            name="password",
            field=models.CharField(
                default=models.CharField(max_length=64, unique=True), max_length=64
            ),
        ),
    ]