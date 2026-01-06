from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from cementerio.views import (
    UsuarioViewSet,
    ParcelaViewSet,
    ReservaViewSet,
    PagoViewSet,
    DifuntoViewSet,
    CustomAuthToken,
    AuthUserViewSet,
)

router = DefaultRouter()
router.register(r"usuarios", UsuarioViewSet, basename="usuario")
router.register(r"parcelas", ParcelaViewSet, basename="parcela")
router.register(r"reservas", ReservaViewSet, basename="reserva")
router.register(r"pagos", PagoViewSet, basename="pago")
router.register(r"difuntos", DifuntoViewSet, basename="difunto")
router.register(r"auth-users", AuthUserViewSet, basename="auth-user")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/auth/login/", CustomAuthToken.as_view(), name="api_login"),
]
