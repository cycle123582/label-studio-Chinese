from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

# don't allow token management from admin console
admin.site.unregister(BlacklistedToken)
admin.site.unregister(OutstandingToken)
