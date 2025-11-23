from unittest.mock import patch

import pytest
from django.db import OperationalError
from projects.tests.factories import ProjectFactory
from tasks.models import Task
from tasks.tests.factories import TaskFactory


@pytest.mark.django_db
class TestBatchUpdateWithRetry:
    def test_batch_update_success_without_deadlock(self):
        project = ProjectFactory(overlap_cohort_percentage=50, maximum_annotations=3)

        tasks = TaskFactory.create_batch(10, project=project)
        task_ids = [task.id for task in tasks]

        tasks_qs = Task.objects.filter(id__in=task_ids)
        project._batch_update_with_retry(tasks_qs, batch_size=3, overlap=2)

        updated_tasks = Task.objects.filter(id__in=task_ids, overlap=2)
        assert updated_tasks.count() == 10

    def test_batch_update_with_deadlock_retry(self):
        project = ProjectFactory(overlap_cohort_percentage=50, maximum_annotations=3)

        tasks = TaskFactory.create_batch(5, project=project)
        task_ids = [task.id for task in tasks]

        tasks_qs = Task.objects.filter(id__in=task_ids)

        call_count = 0

        original_batch_update = project._batch_update_with_retry

        def mock_batch_update(queryset, *args, **kwargs):
            nonlocal call_count
            call_count += 1
            if call_count == 1:
                # Simulate deadlock on first call
                with patch('django.db.transaction.atomic') as mock_atomic:
                    mock_atomic.side_effect = OperationalError('deadlock detected')
                    try:
                        original_batch_update(queryset, *args, **kwargs)
                    except OperationalError:
                        pass
            return original_batch_update(queryset, *args, **kwargs)

        with patch.object(project, '_batch_update_with_retry', side_effect=mock_batch_update):
            project._batch_update_with_retry(tasks_qs, batch_size=5, overlap=2)

        assert call_count >= 1

        updated_tasks = Task.objects.filter(id__in=task_ids, overlap=2)
        assert updated_tasks.count() == 5

    def test_batch_update_with_multiple_batches(self):
        project = ProjectFactory(overlap_cohort_percentage=50, maximum_annotations=3)

        tasks = TaskFactory.create_batch(15, project=project)
        task_ids = [task.id for task in tasks]

        tasks_qs = Task.objects.filter(id__in=task_ids)
        project._batch_update_with_retry(tasks_qs, batch_size=5, overlap=3, is_labeled=True)

        updated_tasks = Task.objects.filter(id__in=task_ids, overlap=3, is_labeled=True)
        assert updated_tasks.count() == 15

    def test_batch_update_exceeds_max_retries(self):
        project = ProjectFactory(overlap_cohort_percentage=50, maximum_annotations=3)

        tasks = TaskFactory.create_batch(5, project=project)
        task_ids = [task.id for task in tasks]

        tasks_qs = Task.objects.filter(id__in=task_ids)

        def mock_batch_update_always_deadlock(queryset, *args, **kwargs):
            # Always simulate deadlock to test max retries exceeded
            with patch('django.db.transaction.atomic') as mock_atomic:
                mock_atomic.side_effect = OperationalError('deadlock detected')
                from core.utils.db import batch_update_with_retry

                batch_update_with_retry(queryset, max_retries=2, **kwargs)

        with patch.object(project, '_batch_update_with_retry', side_effect=mock_batch_update_always_deadlock):
            with pytest.raises(OperationalError, match='deadlock detected'):
                project._batch_update_with_retry(tasks_qs, batch_size=5, overlap=2)
