import pytest
from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import CustomUser
from .models import Territory


@pytest.mark.django_db
class TestTerritories(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = CustomUser.objects.create_user(
            username='admin@test.org', email='admin@test.org',
            password='Test123', full_name='Admin', role='admin',
        )
        self.operator = CustomUser.objects.create_user(
            username='oper@test.org', email='oper@test.org',
            password='Test123', full_name='Operator', role='operator',
        )
        self.territory = Territory.objects.create(
            name='RESGUARDO TEST', description='Test territory'
        )

    def test_list_territories(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/territories/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(response.data['count'], 1)

    def test_create_territory(self):
        self.client.force_authenticate(user=self.operator)
        response = self.client.post('/api/territories/', {
            'name': 'NUEVO RESGUARDO',
            'description': 'Nuevo',
        })
        self.assertEqual(response.status_code, 201)

    def test_update_territory_admin_only(self):
        self.client.force_authenticate(user=self.operator)
        response = self.client.put(f'/api/territories/{self.territory.id}/', {
            'name': 'UPDATED',
            'description': 'Updated',
        })
        self.assertEqual(response.status_code, 403)

    def test_update_territory_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.put(f'/api/territories/{self.territory.id}/', {
            'name': 'UPDATED',
            'description': 'Updated',
        })
        self.assertEqual(response.status_code, 200)

    def test_duplicate_name(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/territories/', {
            'name': 'RESGUARDO TEST',
        })
        self.assertEqual(response.status_code, 400)

    def test_search_filter(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/territories/?search=TEST')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
