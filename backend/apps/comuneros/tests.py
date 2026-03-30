import pytest
from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import CustomUser
from apps.territories.models import Territory
from .models import Comunero


@pytest.mark.django_db
class TestComuneros(TestCase):
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
        self.territory = Territory.objects.create(name='RESGUARDO TEST')
        self.comunero = Comunero.objects.create(
            document_type='CEDULA CIUDADANIA',
            document_number='1234567890',
            first_name='JUAN',
            first_last_name='DAGUA',
            birth_date='1990-01-01',
            sex='MASCULINO',
            territory=self.territory,
        )

    def test_list_comuneros(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/comuneros/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_create_comunero(self):
        self.client.force_authenticate(user=self.operator)
        response = self.client.post('/api/comuneros/', {
            'document_type': 'CEDULA CIUDADANIA',
            'document_number': '9876543210',
            'first_name': 'MARIA',
            'first_last_name': 'TOMBE',
            'birth_date': '1985-06-15',
            'sex': 'FEMENINO',
            'territory': self.territory.id,
        })
        self.assertEqual(response.status_code, 201)

    def test_update_operator_forbidden(self):
        self.client.force_authenticate(user=self.operator)
        response = self.client.put(f'/api/comuneros/{self.comunero.id}/', {
            'document_type': 'CEDULA CIUDADANIA',
            'document_number': '1234567890',
            'first_name': 'UPDATED',
            'first_last_name': 'DAGUA',
            'birth_date': '1990-01-01',
            'sex': 'MASCULINO',
            'territory': self.territory.id,
        })
        self.assertEqual(response.status_code, 403)

    def test_duplicate_document(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/comuneros/', {
            'document_type': 'CEDULA CIUDADANIA',
            'document_number': '1234567890',
            'first_name': 'OTRO',
            'first_last_name': 'PERSONA',
            'birth_date': '1990-01-01',
            'sex': 'MASCULINO',
            'territory': self.territory.id,
        })
        self.assertEqual(response.status_code, 400)

    def test_future_birth_date(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/comuneros/', {
            'document_type': 'CEDULA CIUDADANIA',
            'document_number': '1111111111',
            'first_name': 'FUTURO',
            'first_last_name': 'PERSONA',
            'birth_date': '2099-01-01',
            'sex': 'MASCULINO',
            'territory': self.territory.id,
        })
        self.assertEqual(response.status_code, 400)

    def test_invalid_phone(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/comuneros/', {
            'document_type': 'CEDULA CIUDADANIA',
            'document_number': '2222222222',
            'first_name': 'TEST',
            'first_last_name': 'PHONE',
            'birth_date': '1990-01-01',
            'sex': 'MASCULINO',
            'phone': '12345',
            'territory': self.territory.id,
        })
        self.assertEqual(response.status_code, 400)

    def test_stats_endpoint(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/comuneros/stats/')
        self.assertEqual(response.status_code, 200)
        self.assertIn('total_comuneros', response.data)
        self.assertIn('by_gender', response.data)
        self.assertIn('by_territory', response.data)

    def test_search_filter(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/comuneros/?search=DAGUA')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)

    def test_full_name_and_age(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(f'/api/comuneros/{self.comunero.id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['full_name'], 'JUAN DAGUA')
        self.assertGreater(response.data['age'], 0)
