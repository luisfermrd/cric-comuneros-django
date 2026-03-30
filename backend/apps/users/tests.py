import pytest
from django.test import TestCase
from rest_framework.test import APIClient
from .models import CustomUser


@pytest.mark.django_db
class TestAuth(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='test@cric.org',
            email='test@cric.org',
            password='TestPass123',
            full_name='Test User',
            role='admin',
        )

    def test_login_success(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'test@cric.org',
            'password': 'TestPass123',
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'test@cric.org')

    def test_login_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'test@cric.org',
            'password': 'wrong',
        })
        self.assertEqual(response.status_code, 400)

    def test_me_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['role'], 'admin')

    def test_me_unauthenticated(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, 401)
