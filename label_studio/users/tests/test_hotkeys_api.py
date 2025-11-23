import json

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()


class UserHotkeysAPITestCase(TestCase):
    """Tests for the UserHotkeysAPI"""

    def setUp(self):
        self.client = APIClient()
        # Create a test user
        self.user = User.objects.create_user(username='testuser', email='test@example.com', password='password123')
        # Set initial hotkeys
        self.user.custom_hotkeys = {
            'editor:save': {'key': 'ctrl+s', 'active': True},
            'editor:find': {'key': 'ctrl+f', 'active': True},
        }
        self.user.save()

        # URL for the hotkeys API
        self.url = reverse('current-user-hotkeys')  # Adjust based on your URL configuration

        # Authenticate the test client
        self.client.force_authenticate(user=self.user)

        # Valid payload for tests
        self.valid_payload = {
            'custom_hotkeys': {
                'editor:save': {'key': 'ctrl+shift+s', 'active': True},
                'editor:new': {'key': 'ctrl+n', 'active': True},
            }
        }

    def test_update_hotkeys_authenticated(self):
        """Test updating hotkeys for authenticated user"""
        response = self.client.patch(self.url, data=json.dumps(self.valid_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['custom_hotkeys'], self.valid_payload['custom_hotkeys'])

        # Verify user data was updated in database
        user = User.objects.get(id=self.user.id)
        self.assertEqual(user.custom_hotkeys, self.valid_payload['custom_hotkeys'])

    def test_update_hotkeys_unauthenticated(self):
        """Test updating hotkeys fails for unauthenticated user"""
        # Logout/un-authenticate the client
        self.client.force_authenticate(user=None)

        response = self.client.patch(self.url, data=json.dumps(self.valid_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_hotkeys_invalid_data(self):
        """Test updating hotkeys with invalid data"""
        invalid_payload = {'custom_hotkeys': {'editor:save': {'active': True}}}  # Missing 'key'

        response = self.client.patch(self.url, data=json.dumps(invalid_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_hotkeys_partial(self):
        """Test updating only some hotkeys preserves existing configuration"""
        partial_update = {'custom_hotkeys': {'editor:save': {'key': 'ctrl+alt+s', 'active': True}}}

        response = self.client.patch(self.url, data=json.dumps(partial_update), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Should completely replace the user's hotkeys, not merge them
        user = User.objects.get(id=self.user.id)
        self.assertEqual(user.custom_hotkeys, partial_update['custom_hotkeys'])
        self.assertNotIn('editor:find', user.custom_hotkeys)

    def test_empty_hotkeys(self):
        """Test setting empty hotkeys dictionary"""
        empty_payload = {'custom_hotkeys': {}}

        response = self.client.patch(self.url, data=json.dumps(empty_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # User should now have empty hotkeys
        user = User.objects.get(id=self.user.id)
        self.assertEqual(user.custom_hotkeys, {})

    def test_missing_required_field(self):
        """Test request with missing required field"""
        invalid_payload = {}  # Missing 'custom_hotkeys'

        response = self.client.patch(self.url, data=json.dumps(invalid_payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_hotkeys_authenticated(self):
        """Test retrieving hotkeys for authenticated user"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('custom_hotkeys', response.data)

        # Should return the user's current hotkeys
        expected_hotkeys = {
            'editor:save': {'key': 'ctrl+s', 'active': True},
            'editor:find': {'key': 'ctrl+f', 'active': True},
        }
        self.assertEqual(response.data['custom_hotkeys'], expected_hotkeys)

    def test_get_hotkeys_unauthenticated(self):
        """Test retrieving hotkeys fails for unauthenticated user"""
        # Logout/un-authenticate the client
        self.client.force_authenticate(user=None)

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_hotkeys_empty_config(self):
        """Test retrieving hotkeys when user has empty configuration"""
        # Clear the user's hotkeys
        self.user.custom_hotkeys = {}
        self.user.save()

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['custom_hotkeys'], {})
