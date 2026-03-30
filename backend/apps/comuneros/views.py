from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Q
from apps.users.permissions import IsAdmin
from .models import Comunero
from .serializers import ComuneroSerializer
from .filters import ComuneroFilter


class ComuneroViewSet(viewsets.ModelViewSet):
    """CRUD de comuneros con endpoint de estadisticas."""

    queryset = Comunero.objects.select_related('territory').all()
    serializer_class = ComuneroSerializer
    filterset_class = ComuneroFilter

    def get_permissions(self):
        """Solo admin puede editar o borrar; el resto solo necesita login."""
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdmin()]
        return [IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Cuenta comuneros por genero y territorio, filtrando opcionalmente."""
        territory_id = request.query_params.get('territory')
        qs = Comunero.objects.all()

        if territory_id:
            qs = qs.filter(territory_id=territory_id)

        total = qs.count()
        active = qs.filter(is_active=True).count()

        gender_stats = qs.values('sex').annotate(count=Count('id'))
        by_gender = {'MASCULINO': 0, 'FEMENINO': 0}
        for row in gender_stats:
            by_gender[row['sex']] = row['count']

        territory_stats = (
            qs.values('territory_id', 'territory__name')
            .annotate(count=Count('id'))
            .order_by('territory__name')
        )
        by_territory = [
            {
                'territory_id': row['territory_id'],
                'territory_name': row['territory__name'],
                'count': row['count'],
            }
            for row in territory_stats
        ]

        return Response({
            'total_comuneros': total,
            'active_comuneros': active,
            'inactive_comuneros': total - active,
            'by_gender': by_gender,
            'by_territory': by_territory,
        })
