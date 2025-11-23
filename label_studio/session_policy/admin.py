from django.contrib import admin
from session_policy.models import SessionTimeoutPolicy


@admin.register(SessionTimeoutPolicy)
class SessionTimeoutPolicyAdmin(admin.ModelAdmin):
    list_display = ('organization', 'max_session_age', 'max_time_between_activity', 'created_at', 'updated_at')
    search_fields = ('organization__name',)
    readonly_fields = ('created_at', 'updated_at')
