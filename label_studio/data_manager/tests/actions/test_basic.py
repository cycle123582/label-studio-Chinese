from data_manager.actions.basic import delete_tasks_annotations, delete_tasks_annotations_form
from django.http import HttpRequest
from django.test import TestCase
from projects.tests.factories import ProjectFactory
from tasks.models import Annotation, AnnotationDraft, Task
from tasks.tests.factories import AnnotationDraftFactory, AnnotationFactory, TaskFactory
from users.tests.factories import UserFactory


class TestDeleteTasksAnnotations(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.project = ProjectFactory()
        cls.user_1 = cls.project.created_by
        cls.user_2 = UserFactory(active_organization=cls.project.organization)

        cls.task_1 = TaskFactory(project=cls.project)
        cls.task_2 = TaskFactory(project=cls.project)

    def test_form(self):
        AnnotationFactory(task=self.task_1, completed_by=self.user_1)
        AnnotationDraftFactory(task=self.task_1, user=self.user_2)

        form = delete_tasks_annotations_form(self.user_1, self.project)
        option_ids = [option['value'] for option in form[0]['fields'][0]['options']]
        assert str(self.user_1.id) in option_ids
        assert str(self.user_2.id) in option_ids

    def test_no_annotations(self):
        request = HttpRequest()
        request.user = self.user_1
        request.data = {'annotator': ''}
        result = delete_tasks_annotations(self.project, Task.objects.all(), request=request)
        assert result['processed_items'] == 0

    def test_no_annotator(self):
        AnnotationFactory(task=self.task_1, completed_by=self.user_1)
        AnnotationDraftFactory(task=self.task_1, user=self.user_2)
        AnnotationFactory(task=self.task_2, completed_by=self.user_1)
        AnnotationFactory(task=self.task_2, completed_by=self.user_2)

        request = HttpRequest()
        request.user = self.user_1
        request.data = {'annotator': ''}
        result = delete_tasks_annotations(self.project, Task.objects.all(), request=request)

        assert result['processed_items'] == 3  # 3 annotations
        assert Annotation.objects.count() == 0
        assert AnnotationDraft.objects.count() == 0

    def test_with_annotator(self):
        AnnotationFactory(task=self.task_1, completed_by=self.user_1)
        AnnotationDraftFactory(task=self.task_1, user=self.user_2)
        AnnotationFactory(task=self.task_2, completed_by=self.user_1)
        AnnotationFactory(task=self.task_2, completed_by=self.user_2)

        request = HttpRequest()
        request.user = self.user_1
        request.data = {'annotator': str(self.user_2.id)}
        result = delete_tasks_annotations(self.project, Task.objects.all(), request=request)

        assert result['processed_items'] == 1  # 1 annotations
        assert Annotation.objects.count() == 2
        assert AnnotationDraft.objects.count() == 0
        assert not Annotation.objects.filter(task=self.task_2, completed_by=self.user_2).exists()
        assert not AnnotationDraft.objects.filter(task=self.task_2, user=self.user_2).exists()

    def test_with_annotator_and_task(self):
        AnnotationFactory(task=self.task_1, completed_by=self.user_1)
        AnnotationDraftFactory(task=self.task_1, user=self.user_2)
        AnnotationFactory(task=self.task_2, completed_by=self.user_1)
        AnnotationFactory(task=self.task_2, completed_by=self.user_2)

        request = HttpRequest()
        request.user = self.user_1
        request.data = {'annotator': str(self.user_1.id)}
        result = delete_tasks_annotations(self.project, Task.objects.filter(id=self.task_1.id), request=request)

        assert result['processed_items'] == 1  # 1 annotations
        assert Annotation.objects.count() == 2
        assert AnnotationDraft.objects.count() == 1
        assert not Annotation.objects.filter(task=self.task_1, completed_by=self.user_1).exists()
