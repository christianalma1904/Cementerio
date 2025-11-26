from rest_framework import serializers
from .models import Usuario, Parcela, Reserva, Pago, Difunto


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = "__all__"


class ParcelaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parcela
        fields = "__all__"


class ReservaSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.ReadOnlyField(source="usuario.nombre")
    usuario_apellido = serializers.ReadOnlyField(source="usuario.apellido")
    parcela_ubicacion = serializers.ReadOnlyField(source="parcela.ubicacion")

    class Meta:
        model = Reserva
        fields = "__all__"


class PagoSerializer(serializers.ModelSerializer):
    reserva_id_reserva = serializers.ReadOnlyField(source="reserva.id_reserva")

    class Meta:
        model = Pago
        fields = "__all__"


class DifuntoSerializer(serializers.ModelSerializer):
    parcela_ubicacion = serializers.ReadOnlyField(source="parcela.ubicacion")

    class Meta:
        model = Difunto
        fields = "__all__"
