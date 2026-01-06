from rest_framework import viewsets
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.contrib.auth.models import User

from .models import Usuario, Parcela, Reserva, Pago, Difunto
from .serializers import (
    UsuarioSerializer,
    ParcelaSerializer,
    ReservaSerializer,
    PagoSerializer,
    DifuntoSerializer,
    AuthUserSerializer,
)
from .permissions import IsAdminOrReadOnly


class BaseViewSet(viewsets.ModelViewSet):
    filter_backends = [SearchFilter, OrderingFilter]
    permission_classes = [IsAdminOrReadOnly]


class AuthUserViewSet(viewsets.ModelViewSet):
    """ViewSet para gestionar usuarios de autenticación (Django User)"""
    queryset = User.objects.all().order_by('id')
    serializer_class = AuthUserSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['username', 'email', 'first_name', 'last_name']


class UsuarioViewSet(BaseViewSet):
    queryset = Usuario.objects.all().order_by("id_usuario")
    serializer_class = UsuarioSerializer
    search_fields = ["nombre", "apellido", "email", "telefono", "tipo_usuario"]


class ParcelaViewSet(BaseViewSet):
    queryset = Parcela.objects.all().order_by("id_parcela")
    serializer_class = ParcelaSerializer
    search_fields = ["ubicacion", "estado", "tamanio"]


class ReservaViewSet(BaseViewSet):
    queryset = Reserva.objects.select_related("usuario", "parcela").all().order_by("-fecha_reserva")
    serializer_class = ReservaSerializer
    search_fields = ["usuario__nombre", "usuario__apellido", "parcela__ubicacion", "estado"]


class PagoViewSet(BaseViewSet):
    queryset = Pago.objects.select_related("reserva").all().order_by("-fecha_pago")
    serializer_class = PagoSerializer
    search_fields = ["estado_pago", "metodo_pago", "reserva__id_reserva"]


class DifuntoViewSet(BaseViewSet):
    queryset = Difunto.objects.select_related("parcela").all().order_by("apellido", "nombre")
    serializer_class = DifuntoSerializer
    search_fields = ["nombre", "apellido", "parcela__ubicacion"]


class CustomAuthToken(ObtainAuthToken):
    """
    POST /api/auth/login/
    body: { "username": "admin", "password": "1234" }
    """
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user_id": user.id,
            "username": user.username,
            "is_staff": user.is_staff,
        })
