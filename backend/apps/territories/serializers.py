from rest_framework import serializers
from .models import Territory


class TerritorySerializer(serializers.ModelSerializer):
    """Serializa territorio con validacion de nombre unico."""

    class Meta:
        model = Territory
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        """Verifica que no exista otro territorio con el mismo nombre."""
        qs = Territory.objects.filter(name=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Ya existe un territorio con ese nombre')
        return value
