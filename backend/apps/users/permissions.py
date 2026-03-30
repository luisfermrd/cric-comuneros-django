from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Deja pasar solo si el usuario es admin."""

    def has_permission(self, request, view):
        return hasattr(request.user, 'role') and request.user.role == 'admin'
