import pytest

pytestmark = pytest.mark.django_db

from label_studio_sdk.client import LabelStudio


def test_session_policy_sdk(django_live_url, business_client):
    ls = LabelStudio(base_url=django_live_url, api_key=business_client.api_key)

    policy = ls.session_policy.get()

    assert policy.max_session_age == 8 * 24 * 60
    assert policy.max_time_between_activity == 3 * 24 * 60

    updated = ls.session_policy.update(max_session_age=60, max_time_between_activity=30)
    assert updated.max_session_age == 60
    assert updated.max_time_between_activity == 30

    fetched = ls.session_policy.get()
    assert fetched.max_session_age == 60
    assert fetched.max_time_between_activity == 30
