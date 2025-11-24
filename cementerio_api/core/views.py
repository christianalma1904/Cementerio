from rest_framework import viewsets, permissions, filters
from rest_framework.authentication import TokenAuthentication

from .models import Usuario, Parcela, Reserva, Pago, Difunto
from .serializers import (
    UsuarioSerializer,
    ParcelaSerializer,
    ReservaSerializer,
    PagoSerializer,
    DifuntoSerializer,
)


class BaseViewSet(viewsets.ModelViewSet):
    """
    - GET (list/retrieve): público
    - POST/PUT/PATCH: requieren token
    - DELETE: solo admin (is_staff)
    """

    authentication_classes = [TokenAuthentication]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    def get_permissions(self):
        if self.action == "destroy":
            permission_classes = [permissions.IsAdminUser]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [perm() for perm in permission_classes]


class UsuarioViewSet(BaseViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    search_fields = ["nombre", "apellido", "email", "tipo_usuario"]
    ordering_fields = ["id_usuario", "nombre", "apellido"]


class ParcelaViewSet(BaseViewSet):
    queryset = Parcela.objects.all()
    serializer_class = ParcelaSerializer
    search_fields = ["ubicacion", "estado"]
    ordering_fields = ["id_parcela", "precio"]


class ReservaViewSet(BaseViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer
    search_fields = ["estado", "usuario__nombre", "parcela__ubicacion"]
    ordering_fields = ["id_reserva", "fecha_reserva"]


class PagoViewSet(BaseViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    search_fields = ["metodo_pago", "estado_pago"]
    ordering_fields = ["id_pago", "fecha_pago", "monto"]


class DifuntoViewSet(BaseViewSet):
    queryset = Difunto.objects.all()
    serializer_class = DifuntoSerializer
    search_fields = ["nombre", "apellido", "parcela__ubicacion"]
    ordering_fields = ["id_difunto", "fecha_fallecimiento"]
