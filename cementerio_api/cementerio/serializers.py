from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Usuario, Parcela, Reserva, Pago, Difunto


class AuthUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined', 'password']
        read_only_fields = ['date_joined']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


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
