from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Usuario con rol (admin u operador) para controlar acceso."""

    class Role(models.TextChoices):
        ADMIN = 'admin'
        OPERATOR = 'operator'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.OPERATOR)
    full_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'users'
