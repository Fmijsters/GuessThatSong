# Generated by Django 4.2.4 on 2023-08-19 13:21

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("GTS", "0003_remove_pub_members_pub_max_members_pub_password"),
    ]

    operations = [
        migrations.AddField(
            model_name="pub",
            name="members",
            field=models.ManyToManyField(
                blank=True, related_name="pubs", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]