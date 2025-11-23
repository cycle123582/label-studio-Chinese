import logging

from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework import status

logger = logging.getLogger(__name__)

User = get_user_model()


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        from core.feature_flags import flag_set
        from rest_framework_simplejwt.authentication import JWTAuthentication
        from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken, TokenError

        try:
            user_and_token = JWTAuthentication().authenticate(request)
            if user_and_token:
                user = User.objects.get(pk=user_and_token[0].pk)
                JWT_ACCESS_TOKEN_ENABLED = flag_set(
                    'fflag__feature_develop__prompts__dia_1829_jwt_token_auth', user=user
                )
                if JWT_ACCESS_TOKEN_ENABLED and user.active_organization.jwt.api_tokens_enabled:
                    request.user = user
                    request.is_jwt = True
        except User.DoesNotExist:
            logger.info('JWT authentication failed: User no longer exists')
            return JsonResponse({'detail': 'User not found'}, status=status.HTTP_401_UNAUTHORIZED)
        except (AuthenticationFailed, InvalidToken, TokenError) as e:
            logger.info('JWT authentication failed: %s', e)
            # don't raise 401 here, fallback to other auth methods (in case token is valid for them)
            # (have unit tests verifying that this still results in a 401 if other auth mechanisms fail)
        return self.get_response(request)
