from rest_framework.routers import DefaultRouter
from .views import TerritoryViewSet

router = DefaultRouter()
router.register('', TerritoryViewSet, basename='territory')

urlpatterns = router.urls
