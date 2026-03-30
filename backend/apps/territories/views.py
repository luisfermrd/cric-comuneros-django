from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import ProtectedError
from apps.users.permissions import IsAdmin
from .models import Territory
from .serializers import TerritorySerializer
from .filters import TerritoryFilter


class TerritoryViewSet(viewsets.ModelViewSet):
    """CRUD de territorios. Solo admin puede editar o borrar."""

    queryset = Territory.objects.all()
    serializer_class = TerritorySerializer
    filterset_class = TerritoryFilter

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    def destroy(self, request, *args, **kwargs):
        """Borra el territorio, o devuelve 409 si tiene comuneros asociados."""
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {'error': 'No se puede eliminar: tiene comuneros asociados'},
                status=status.HTTP_409_CONFLICT
            )
