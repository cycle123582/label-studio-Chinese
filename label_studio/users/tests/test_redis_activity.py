"""
Tests for Redis user activity caching functionality.
"""

from datetime import timedelta
from unittest.mock import MagicMock, patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from users.functions.last_activity import (
    SYNC_THRESHOLD,
    USER_ACTIVITY_COUNTER_KEY,
    _bulk_update_user_activities,
    _get_user_activity_key,
    cleanup_redis_activity_data,
    clear_batch_user_ids,
    get_activity_counter,
    get_batch_user_ids,
    get_user_last_activity,
    increment_activity_counter,
    reset_activity_counter,
    set_user_last_activity,
    should_sync_activities,
)

User = get_user_model()


class TestRedisActivity(TestCase):
    """Test Redis activity functions."""

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', username='testuser', password='testpass123')
        self.test_time = timezone.now()

    def tearDown(self):
        # Clean up Redis data after each test
        with patch('users.functions.last_activity.redis_connected', return_value=True):
            cleanup_redis_activity_data({self.user.id})
            reset_activity_counter()

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_set_user_last_activity_success(self, mock_get_connection, mock_redis_connected):
        """Test successful setting of user activity."""
        mock_redis_client = MagicMock()
        mock_get_connection.return_value = mock_redis_client
        mock_redis_client.incr.return_value = 1

        result = set_user_last_activity(self.user.id, self.test_time)

        self.assertTrue(result)
        mock_redis_client.setex.assert_called_once()
        mock_redis_client.sadd.assert_called_once()
        self.assertEqual(mock_redis_client.expire.call_count, 2)  # One for batch key, one for counter
        mock_redis_client.incr.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=False)
    def test_set_user_last_activity_redis_disconnected(self, mock_redis_connected):
        """Test setting activity when Redis is disconnected."""
        result = set_user_last_activity(self.user.id, self.test_time)
        self.assertFalse(result)

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_get_user_last_activity_from_redis(self, mock_get_connection, mock_redis_connected):
        """Test getting user activity from Redis."""
        with patch('users.functions.last_activity._redis', MagicMock()):
            mock_redis_client = MagicMock()
            mock_get_connection.return_value = mock_redis_client
            mock_redis_client.get.return_value = self.test_time.isoformat().encode('utf-8')

            result = get_user_last_activity(self.user.id)

            self.assertEqual(result, self.test_time)
            mock_redis_client.get.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_get_user_last_activity_no_redis_data(self, mock_get_connection, mock_redis_connected):
        """Test getting activity when Redis has no data (returns None)."""
        with patch('users.functions.last_activity._redis', MagicMock()):
            mock_redis_client = MagicMock()
            mock_get_connection.return_value = mock_redis_client
            mock_redis_client.get.return_value = None

            result = get_user_last_activity(self.user.id)

            self.assertIsNone(result)
            mock_redis_client.get.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=False)
    def test_get_user_last_activity_redis_disconnected(self, mock_redis_connected):
        """Test getting activity when Redis is disconnected (returns None)."""
        with patch('users.functions.last_activity._redis', None):
            result = get_user_last_activity(self.user.id)

            self.assertIsNone(result)

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_increment_activity_counter(self, mock_get_connection, mock_redis_connected):
        """Test incrementing activity counter."""
        mock_redis_client = MagicMock()
        mock_get_connection.return_value = mock_redis_client
        mock_redis_client.incr.return_value = 5

        result = increment_activity_counter()

        self.assertEqual(result, 5)
        mock_redis_client.incr.assert_called_with(USER_ACTIVITY_COUNTER_KEY)
        mock_redis_client.expire.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_get_activity_counter(self, mock_get_connection, mock_redis_connected):
        """Test getting activity counter."""
        mock_redis_client = MagicMock()
        mock_get_connection.return_value = mock_redis_client
        mock_redis_client.get.return_value = b'10'

        result = get_activity_counter()

        self.assertEqual(result, 10)
        mock_redis_client.get.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_reset_activity_counter(self, mock_get_connection, mock_redis_connected):
        """Test resetting activity counter."""
        mock_redis_client = MagicMock()
        mock_get_connection.return_value = mock_redis_client

        result = reset_activity_counter()

        self.assertTrue(result)
        mock_redis_client.set.assert_called_once_with(USER_ACTIVITY_COUNTER_KEY, 0)
        mock_redis_client.expire.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_get_batch_user_ids(self, mock_get_connection, mock_redis_connected):
        """Test getting batch user IDs."""
        mock_redis_client = MagicMock()
        mock_get_connection.return_value = mock_redis_client
        mock_redis_client.smembers.return_value = {b'1', b'2', b'3'}

        result = get_batch_user_ids()

        self.assertEqual(result, {1, 2, 3})
        mock_redis_client.smembers.assert_called_once()

    @patch('users.functions.last_activity.redis_connected', return_value=True)
    @patch('users.functions.last_activity.get_connection')
    def test_clear_batch_user_ids(self, mock_get_connection, mock_redis_connected):
        """Test clearing batch user IDs."""
        mock_redis_client = MagicMock()
        mock_get_connection.return_value = mock_redis_client

        result = clear_batch_user_ids({1, 2, 3})

        self.assertTrue(result)
        mock_redis_client.srem.assert_called_once()

    @patch('users.functions.last_activity.get_activity_counter')
    def test_should_sync_activities(self, mock_get_counter):
        """Test sync threshold check."""
        # Below threshold
        mock_get_counter.return_value = SYNC_THRESHOLD - 1
        self.assertFalse(should_sync_activities())

        # At threshold
        mock_get_counter.return_value = SYNC_THRESHOLD
        self.assertTrue(should_sync_activities())

        # Above threshold
        mock_get_counter.return_value = SYNC_THRESHOLD + 1
        self.assertTrue(should_sync_activities())

    def test_get_user_activity_key(self):
        """Test Redis key generation."""
        expected_key = f'user_activity:{self.user.id}'
        result = _get_user_activity_key(self.user.id)
        self.assertEqual(result, expected_key)


class TestUserLastActivityMixin(TestCase):
    """Test UserLastActivityMixin methods."""

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', username='testuser', password='testpass123')

    @patch('users.models.set_user_last_activity')
    @patch('users.models.schedule_activity_sync')
    def test_update_last_activity_redis_success(self, mock_schedule, mock_set_activity):
        """Test updating last activity with Redis success."""
        mock_set_activity.return_value = True

        self.user.update_last_activity()

        mock_set_activity.assert_called_once()
        mock_schedule.assert_called_once()

    @patch('users.models.set_user_last_activity')
    def test_update_last_activity_redis_failure(self, mock_set_activity):
        """Test updating last activity with Redis failure (fallback to DB)."""
        mock_set_activity.return_value = False
        original_activity = self.user.last_activity

        self.user.update_last_activity()

        mock_set_activity.assert_called_once()
        # Check that database was updated
        self.user.refresh_from_db()
        self.assertNotEqual(self.user.last_activity, original_activity)

    @patch('users.models.get_user_last_activity')
    def test_get_last_activity_cached(self, mock_get_activity):
        """Test getting cached last activity."""
        test_time = timezone.now()
        mock_get_activity.return_value = test_time

        result = self.user.get_last_activity()

        self.assertEqual(result, test_time)
        mock_get_activity.assert_called_once_with(self.user.id)

    @patch('users.models.get_user_last_activity')
    def test_last_activity_cached_property(self, mock_get_activity):
        """Test last_activity_cached property."""
        test_time = timezone.now()
        mock_get_activity.return_value = test_time

        result = self.user.last_activity_cached

        self.assertEqual(result, test_time)
        mock_get_activity.assert_called_once_with(self.user.id)


class TestSyncTasks(TestCase):
    """Test synchronization tasks."""

    def setUp(self):
        self.user = User.objects.create_user(email='test@example.com', username='testuser', password='testpass123')

    def test_bulk_update_user_activities_success(self):
        """Test bulk updating user activities."""
        test_time = timezone.now()
        activities = [{'user_id': self.user.id, 'last_activity': test_time}]

        result = _bulk_update_user_activities(activities)

        self.assertTrue(result['success'])
        self.assertEqual(result['processed'], 1)
        self.assertEqual(result['errors'], 0)

        # Check database was updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.last_activity, test_time)

    def test_bulk_update_user_activities_nonexistent_user(self):
        """Test bulk update with non-existent user."""
        test_time = timezone.now()
        activities = [{'user_id': 99999, 'last_activity': test_time}]

        result = _bulk_update_user_activities(activities)

        self.assertTrue(result['success'])
        self.assertEqual(result['processed'], 0)
        self.assertEqual(result['errors'], 1)

    def test_bulk_update_user_activities_outdated_activity(self):
        """Test bulk update with outdated activity."""
        # Set user's current activity to a future time
        future_time = timezone.now() + timedelta(hours=1)
        self.user.last_activity = future_time
        self.user.save()

        # Try to update with older time
        past_time = timezone.now() - timedelta(hours=1)
        activities = [{'user_id': self.user.id, 'last_activity': past_time}]

        result = _bulk_update_user_activities(activities)

        self.assertTrue(result['success'])
        self.assertEqual(result['processed'], 1)
        self.assertEqual(result['errors'], 0)
        self.assertEqual(result['updated'], 0)  # No actual update performed

        # Check database was not updated
        self.user.refresh_from_db()
        self.assertEqual(self.user.last_activity, future_time)

    def test_bulk_update_user_activities_empty_list(self):
        """Test bulk update with empty activities list."""
        result = _bulk_update_user_activities([])

        self.assertTrue(result['success'])
        self.assertEqual(result['processed'], 0)
        self.assertEqual(result['errors'], 0)
