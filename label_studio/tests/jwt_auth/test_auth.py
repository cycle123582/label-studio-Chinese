import logging

import pytest
from jwt_auth.models import LSAPIToken
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

from ..utils import mock_feature_flag
from .utils import create_user_with_token_settings


@mock_feature_flag(flag_name='fflag__feature_develop__prompts__dia_1829_jwt_token_auth', value=True)
@pytest.mark.django_db
def test_logging_when_legacy_token_auth_enabled(caplog):
    user = create_user_with_token_settings(api_tokens_enabled=False, legacy_api_tokens_enabled=True)
    token, _ = Token.objects.get_or_create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
    caplog.set_level(logging.INFO)

    client.get('/api/projects/')
    basic_auth_logs = [record for record in caplog.records if record.message == 'Legacy token authentication used']

    assert len(basic_auth_logs) == 1
    record = basic_auth_logs[0]
    assert record.user_id == user.id
    assert record.organization_id == user.active_organization.id
    assert record.endpoint == '/api/projects/'


@mock_feature_flag(flag_name='fflag__feature_develop__prompts__dia_1829_jwt_token_auth', value=True)
@pytest.mark.django_db
def test_no_logging_when_legacy_token_auth_disabled(caplog):
    user = create_user_with_token_settings(api_tokens_enabled=True, legacy_api_tokens_enabled=False)
    refresh = LSAPIToken.for_user(user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    caplog.set_level(logging.INFO)

    client.get('/api/projects/')

    basic_auth_logs = [record for record in caplog.records if record.message == 'Basic token authentication used']
    assert len(basic_auth_logs) == 0


@mock_feature_flag(flag_name='fflag__feature_develop__prompts__dia_1829_jwt_token_auth', value=True)
@pytest.mark.django_db
def test_legacy_api_token_disabled_user_cannot_use_legacy_token():
    user = create_user_with_token_settings(api_tokens_enabled=True, legacy_api_tokens_enabled=False)
    token, _ = Token.objects.get_or_create(user=user)
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

    response = client.get('/api/projects/')

    assert response.status_code == status.HTTP_401_UNAUTHORIZED
