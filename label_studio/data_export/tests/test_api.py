from unittest.mock import ANY, patch

from data_export.api import async_convert
from data_export.models import ConvertedFormat, Export
from projects.tests.factories import ProjectFactory
from rest_framework.test import APITestCase


@patch('data_export.api.start_job_async_or_sync')
class TestExportConvertAPI(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.project = ProjectFactory()
        cls.user = cls.project.created_by
        cls.export = Export.objects.create(project=cls.project)

    def test_convert_export(self, mock_start_job_async_or_sync):
        self.client.force_authenticate(user=self.user)

        assert ConvertedFormat.objects.count() == 0

        response = self.client.post(
            f'/api/projects/{self.project.id}/exports/{self.export.id}/convert',
            {'export_type': 'CSV'},
        )
        assert response.status_code == 200
        cf = ConvertedFormat.objects.get(export=self.export, export_type='CSV', status=ConvertedFormat.Status.CREATED)

        mock_start_job_async_or_sync.assert_called_once_with(
            async_convert,
            cf.id,
            'CSV',
            self.project,
            ANY,
            download_resources=False,
            on_failure=ANY,
        )

    def test_convert_export_already_started(self, mock_start_job_async_or_sync):
        self.client.force_authenticate(user=self.user)

        ConvertedFormat.objects.create(export=self.export, export_type='CSV', status=ConvertedFormat.Status.CREATED)

        response = self.client.post(
            f'/api/projects/{self.project.id}/exports/{self.export.id}/convert',
            {'export_type': 'CSV'},
        )
        assert response.status_code == 400
        assert response.json()['validation_errors']['non_field_errors'] == ['Conversion to CSV already started']
        mock_start_job_async_or_sync.assert_not_called()

    def test_convert_export_previous_failed(self, mock_start_job_async_or_sync):
        self.client.force_authenticate(user=self.user)

        ConvertedFormat.objects.create(export=self.export, export_type='CSV', status=ConvertedFormat.Status.FAILED)

        response = self.client.post(
            f'/api/projects/{self.project.id}/exports/{self.export.id}/convert',
            {'export_type': 'CSV'},
        )
        assert response.status_code == 200
        mock_start_job_async_or_sync.assert_called_once_with(
            async_convert,
            ANY,
            'CSV',
            self.project,
            ANY,
            download_resources=False,
            on_failure=ANY,
        )
