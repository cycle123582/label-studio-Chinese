import json

import boto3
import pytest
from io_storages.models import S3ImportStorage
from moto import mock_s3
from projects.tests.factories import ProjectFactory
from rest_framework.test import APIClient
from tests.conftest import set_feature_flag_envvar  # noqa: F401


@pytest.mark.django_db
class TestStoragePredictionValidation:
    """Test prediction validation in cloud storage imports."""

    @pytest.fixture
    def project(self):
        """Create a project with a label config for prediction validation."""
        return ProjectFactory(
            label_config="""
            <View>
              <Text name="text" value="$text"/>
              <Choices name="sentiment" toName="text">
                <Choice value="positive"/>
                <Choice value="negative"/>
              </Choices>
            </View>
            """
        )

    @pytest.fixture
    def api_client(self):
        """Create API client for testing."""
        return APIClient()

    def test_storage_import_with_valid_prediction(self, project, api_client, set_feature_flag_envvar):
        """Test that storage import accepts valid predictions."""
        # Setup API client
        api_client.force_authenticate(user=project.created_by)

        # Create valid task data with prediction
        valid_task_data = {
            'data': {'text': 'This is a positive review'},
            'predictions': [
                {
                    'result': [
                        {
                            'from_name': 'sentiment',
                            'to_name': 'text',
                            'type': 'choices',
                            'value': {'choices': ['positive']},
                        }
                    ],
                    'score': 0.95,
                    'model_version': 'v1.0',
                }
            ],
        }

        with mock_s3():
            # Setup S3 bucket and test data
            s3 = boto3.client('s3', region_name='us-east-1')
            bucket_name = 'pytest-s3-prediction-validation'
            s3.create_bucket(Bucket=bucket_name)

            # Put valid test data into S3
            s3.put_object(Bucket=bucket_name, Key='valid_prediction.json', Body=json.dumps([valid_task_data]))

            # Create storage and sync
            storage = S3ImportStorage(
                project=project,
                bucket=bucket_name,
                aws_access_key_id='example',
                aws_secret_access_key='example',
                use_blob_urls=False,
            )
            storage.save()
            storage.sync()

            # Verify task was created
            tasks_response = api_client.get(f'/api/tasks?project={project.id}')
            assert tasks_response.status_code == 200
            tasks = tasks_response.json()['tasks']
            assert len(tasks) == 1

            # Verify prediction was created
            predictions_response = api_client.get(f'/api/predictions?task={tasks[0]["id"]}')
            assert predictions_response.status_code == 200
            predictions = predictions_response.json()
            assert len(predictions) == 1

    def test_storage_import_with_invalid_prediction(self, project, api_client, set_feature_flag_envvar):
        """Test that storage import rejects invalid predictions."""
        # Setup API client
        api_client.force_authenticate(user=project.created_by)

        # Create invalid task data with prediction (wrong from_name)
        invalid_task_data = {
            'data': {'text': 'This is a positive review'},
            'predictions': [
                {
                    'result': [
                        {
                            'from_name': 'nonexistent_tag',  # Invalid from_name
                            'to_name': 'text',
                            'type': 'choices',
                            'value': {'choices': ['positive']},
                        }
                    ],
                    'score': 0.95,
                    'model_version': 'v1.0',
                }
            ],
        }

        with mock_s3():
            # Setup S3 bucket and test data
            s3 = boto3.client('s3', region_name='us-east-1')
            bucket_name = 'pytest-s3-prediction-validation'
            s3.create_bucket(Bucket=bucket_name)

            # Put invalid test data into S3
            s3.put_object(Bucket=bucket_name, Key='invalid_prediction.json', Body=json.dumps([invalid_task_data]))

            # Create storage and sync
            storage = S3ImportStorage(
                project=project,
                bucket=bucket_name,
                aws_access_key_id='example',
                aws_secret_access_key='example',
                use_blob_urls=False,
            )
            storage.save()
            storage.sync()

            # Verify task was NOT created due to validation failure
            tasks_response = api_client.get(f'/api/tasks?project={project.id}')
            assert tasks_response.status_code == 200
            tasks = tasks_response.json()['tasks']
            assert len(tasks) == 0  # No tasks should be created when predictions are invalid
