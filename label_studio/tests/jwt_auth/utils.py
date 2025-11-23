from organizations.functions import create_organization
from users.models import User


def create_user_with_token_settings(api_tokens_enabled: bool, legacy_api_tokens_enabled: bool) -> User:
    """Create a user with specified token auth settings in their organization."""
    user = User.objects.create(email=f'test_user_{api_tokens_enabled}_{legacy_api_tokens_enabled}@example.com')
    org = create_organization(title=f'Test Org {api_tokens_enabled} {legacy_api_tokens_enabled}', created_by=user)
    org.jwt.api_tokens_enabled = api_tokens_enabled
    org.jwt.legacy_api_tokens_enabled = legacy_api_tokens_enabled
    org.jwt.save()
    user.active_organization = org
    user.save()
    return user
