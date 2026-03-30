from rest_framework.routers import DefaultRouter
from .views import ComuneroViewSet

router = DefaultRouter()
router.register('', ComuneroViewSet, basename='comunero')

urlpatterns = router.urls
