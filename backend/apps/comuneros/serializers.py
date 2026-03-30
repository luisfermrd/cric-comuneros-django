import re
from datetime import date
from rest_framework import serializers
from apps.territories.serializers import TerritorySerializer
from .models import Comunero

ONLY_LETTERS = re.compile(r'^[A-Za-z\u00C0-\u00FF\u00D1\u00F1\s]+$')
ONLY_DIGITS = re.compile(r'^\d+$')
PHONE_REGEX = re.compile(r'^3\d{9}$')


class ComuneroSerializer(serializers.ModelSerializer):
    """Serializa comunero con validaciones de documento, fecha, telefono y XSS."""

    full_name = serializers.CharField(read_only=True)
    age = serializers.IntegerField(read_only=True)
    territory_detail = TerritorySerializer(source='territory', read_only=True)

    class Meta:
        model = Comunero
        fields = [
            'id', 'document_type', 'document_number',
            'first_name', 'second_name', 'first_last_name', 'second_last_name',
            'birth_date', 'sex', 'phone', 'email', 'is_active',
            'territory', 'territory_detail', 'full_name', 'age',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_document_number(self, value):
        """Revisa que el documento sea solo digitos y minimo 3 caracteres."""
        if not ONLY_DIGITS.match(value):
            raise serializers.ValidationError('Solo se permiten digitos')
        if len(value) < 3:
            raise serializers.ValidationError('Minimo 3 caracteres')
        return value

    def validate_first_name(self, value):
        if not ONLY_LETTERS.match(value):
            raise serializers.ValidationError('Solo se permiten letras')
        return value

    def validate_second_name(self, value):
        if value and not ONLY_LETTERS.match(value):
            raise serializers.ValidationError('Solo se permiten letras')
        return value

    def validate_first_last_name(self, value):
        if not ONLY_LETTERS.match(value):
            raise serializers.ValidationError('Solo se permiten letras')
        return value

    def validate_second_last_name(self, value):
        if value and not ONLY_LETTERS.match(value):
            raise serializers.ValidationError('Solo se permiten letras')
        return value

    def validate_birth_date(self, value):
        """No deja que la fecha de nacimiento sea en el futuro."""
        if value > date.today():
            raise serializers.ValidationError('La fecha de nacimiento no puede ser futura')
        return value

    def validate_phone(self, value):
        """Valida que el celular tenga 10 digitos y empiece en 3."""
        if value and not PHONE_REGEX.match(value):
            raise serializers.ValidationError('El celular debe tener 10 digitos e iniciar en 3')
        return value

    def _strip_html(self, value):
        """Quita tags HTML para prevenir XSS."""
        if isinstance(value, str):
            return re.sub(r'<[^>]*>', '', value)
        return value

    def validate(self, attrs):
        """Limpia HTML de los campos de nombre antes de guardar."""
        for field in ['first_name', 'second_name', 'first_last_name', 'second_last_name']:
            if field in attrs:
                attrs[field] = self._strip_html(attrs[field])
        return attrs
