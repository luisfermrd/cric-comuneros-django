from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser


class LoginSerializer(serializers.Serializer):
    """Valida email y password, y devuelve el usuario autenticado."""

    email = serializers.EmailField()
    password = serializers.CharField(min_length=6)

    def validate(self, attrs):
        user = authenticate(username=attrs['email'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError('Credenciales invalidas')
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializa los datos basicos del usuario para la respuesta."""

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'role']
