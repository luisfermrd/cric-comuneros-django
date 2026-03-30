from django.contrib import admin
from .models import Territory


@admin.register(Territory)
class TerritoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']
