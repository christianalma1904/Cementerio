from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    ParcelaViewSet,
    ReservaViewSet,
    PagoViewSet,
    DifuntoViewSet,
)

router = DefaultRouter()
router.register(r"usuarios", UsuarioViewSet, basename="usuario")
router.register(r"parcelas", ParcelaViewSet, basename="parcela")
router.register(r"reservas", ReservaViewSet, basename="reserva")
router.register(r"pagos", PagoViewSet, basename="pago")
router.register(r"difuntos", DifuntoViewSet, basename="difunto")

urlpatterns = [
    path("", include(router.urls)),
]
