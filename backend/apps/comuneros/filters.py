from django.db import models
from django_filters import rest_framework as filters
from .models import Comunero


class ComuneroFilter(filters.FilterSet):
    """Filtra comuneros por texto, territorio, estado activo y sexo."""

    search = filters.CharFilter(method='filter_search')
    territory = filters.NumberFilter(field_name='territory_id')
    is_active = filters.BooleanFilter()
    sex = filters.ChoiceFilter(choices=Comunero.Sex.choices)

    class Meta:
        model = Comunero
        fields = ['search', 'territory', 'is_active', 'sex']

    def filter_search(self, queryset, name, value):
        """Busca por nombre, apellido o numero de documento."""
        return queryset.filter(
            models.Q(first_name__icontains=value) |
            models.Q(first_last_name__icontains=value) |
            models.Q(document_number__icontains=value)
        )
