from django_filters import rest_framework as filters
from .models import Territory


class TerritoryFilter(filters.FilterSet):
    """Filtra territorios por nombre parcial."""

    search = filters.CharFilter(field_name='name', lookup_expr='icontains')

    class Meta:
        model = Territory
        fields = ['search']
