from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("admin/", admin.site.urls),

    # login: devuelve token
    path("api/token-login/", obtain_auth_token, name="api_token_auth"),

    # API principal
    path("api/", include("core.urls")),
]
