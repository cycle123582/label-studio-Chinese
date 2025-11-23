from django.urls import path

from . import views

app_name = 'jwt_auth'

urlpatterns = [
    path('api/jwt/settings', views.JWTSettingsAPI.as_view(), name='api-jwt-settings'),
    path('api/token/', views.LSAPITokenView.as_view(), name='token_manage'),
    path('api/token/refresh/', views.DecoratedTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/blacklist/', views.LSTokenBlacklistView.as_view(), name='token_blacklist'),
    path('api/token/rotate/', views.LSAPITokenRotateView.as_view(), name='token_rotate'),
]
