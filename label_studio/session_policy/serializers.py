from rest_framework import serializers

from .models import SessionTimeoutPolicy


class SessionTimeoutPolicySerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionTimeoutPolicy
        fields = ['max_session_age', 'max_time_between_activity', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
