from django.contrib import admin
from .models import Comunero


@admin.register(Comunero)
class ComuneroAdmin(admin.ModelAdmin):
    list_display = ['document_number', 'full_name', 'sex', 'territory', 'is_active']
    list_filter = ['is_active', 'sex', 'territory']
    search_fields = ['first_name', 'first_last_name', 'document_number']
