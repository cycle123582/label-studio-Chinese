from django.contrib import admin

from .models import ModelProviderConnection


@admin.register(ModelProviderConnection)
class ModelProviderConnectionAdmin(admin.ModelAdmin):
    list_display = (
        'provider',
        'scope',
        'organization',
        'created_by',
        'created_at',
        'updated_at',
        'is_internal',
    )
    list_filter = ('provider', 'scope', 'is_internal')
    search_fields = ('provider', 'deployment_name', 'endpoint')
    readonly_fields = ('created_at', 'updated_at', 'budget_total_spent')
    fieldsets = (
        (
            'Provider Details',
            {
                'fields': (
                    'provider',
                    'api_key',
                    'auth_token',
                    'deployment_name',
                    'endpoint',
                )
            },
        ),
        (
            'Google Cloud Details',
            {
                'fields': (
                    'google_application_credentials',
                    'google_project_id',
                    'google_location',
                ),
                'classes': ('collapse',),
            },
        ),
        (
            'Scope and Organization',
            {'fields': ('scope', 'organization', 'created_by', 'is_internal')},
        ),
        (
            'Budget Settings',
            {
                'fields': (
                    'budget_limit',
                    'budget_last_reset_date',
                    'budget_reset_period',
                    'budget_total_spent',
                    'budget_alert_threshold',
                )
            },
        ),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
