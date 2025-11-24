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
    usuario = UsuarioSerializer(read_only=True)
    usuario_id = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(), source="usuario", write_only=True
    )
    parcela = ParcelaSerializer(read_only=True)
    parcela_id = serializers.PrimaryKeyRelatedField(
        queryset=Parcela.objects.all(), source="parcela", write_only=True
    )

    class Meta:
        model = Reserva
        fields = [
            "id_reserva",
            "usuario",
            "usuario_id",
            "fecha_reserva",
            "estado",
            "parcela",
            "parcela_id",
        ]


class PagoSerializer(serializers.ModelSerializer):
    reserva = ReservaSerializer(read_only=True)
    reserva_id = serializers.PrimaryKeyRelatedField(
        queryset=Reserva.objects.all(), source="reserva", write_only=True
    )

    class Meta:
        model = Pago
        fields = [
            "id_pago",
            "reserva",
            "reserva_id",
            "monto",
            "fecha_pago",
            "metodo_pago",
            "estado_pago",
        ]


class DifuntoSerializer(serializers.ModelSerializer):
    parcela = ParcelaSerializer(read_only=True)
    parcela_id = serializers.PrimaryKeyRelatedField(
        queryset=Parcela.objects.all(), source="parcela", write_only=True
    )

    class Meta:
        model = Difunto
        fields = [
            "id_difunto",
            "nombre",
            "apellido",
            "fecha_nacimiento",
            "parcela",
            "parcela_id",
            "fecha_fallecimiento",
            "notas",
        ]
