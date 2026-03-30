from datetime import date
from django.db import models
from apps.territories.models import Territory


class Comunero(models.Model):
    """Persona registrada como comunero en un territorio."""

    class DocumentType(models.TextChoices):
        CC = 'CEDULA CIUDADANIA'
        TI = 'TARJETA IDENTIDAD'
        RC = 'REGISTRO CIVIL'
        CE = 'CEDULA EXTRANJERIA'
        PA = 'PASAPORTE'

    class Sex(models.TextChoices):
        M = 'MASCULINO'
        F = 'FEMENINO'

    document_type = models.CharField(max_length=25, choices=DocumentType.choices)
    document_number = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50, blank=True, default='')
    first_last_name = models.CharField(max_length=50)
    second_last_name = models.CharField(max_length=50, blank=True, default='')
    birth_date = models.DateField()
    sex = models.CharField(max_length=10, choices=Sex.choices)
    phone = models.CharField(max_length=10, blank=True, default='')
    email = models.EmailField(blank=True, default='')
    is_active = models.BooleanField(default=True)
    territory = models.ForeignKey(Territory, on_delete=models.PROTECT, related_name='comuneros')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'comuneros'
        ordering = ['first_last_name', 'first_name']

    def __str__(self):
        return self.full_name

    @property
    def full_name(self):
        """Junta nombre y apellidos en un solo string."""
        return ' '.join(filter(None, [
            self.first_name, self.second_name,
            self.first_last_name, self.second_last_name
        ]))

    @property
    def age(self):
        """Calcula la edad en anos a partir de la fecha de nacimiento."""
        today = date.today()
        return today.year - self.birth_date.year - (
            (today.month, today.day) < (self.birth_date.month, self.birth_date.day)
        )
