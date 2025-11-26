from django.db import models
from django.core.validators import MinValueValidator


class Usuario(models.Model):
    TIPO_CHOICES = [
        ("ADMIN", "Administrador"),
        ("CLIENTE", "Cliente"),
    ]

    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    tipo_usuario = models.CharField(max_length=20, choices=TIPO_CHOICES, default="CLIENTE")
    fecha_registro = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Parcela(models.Model):
    ESTADO_CHOICES = [
        ("DISPONIBLE", "Disponible"),
        ("RESERVADA", "Reservada"),
        ("OCUPADA", "Ocupada"),
    ]

    id_parcela = models.AutoField(primary_key=True)
    ubicacion = models.CharField(max_length=100)
    tamanio = models.CharField(max_length=50)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="DISPONIBLE")
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    def __str__(self):
        return f"Parcela {self.id_parcela} - {self.ubicacion}"


class Reserva(models.Model):
    ESTADO_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("CONFIRMADA", "Confirmada"),
        ("CANCELADA", "Cancelada"),
    ]

    id_reserva = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="reservas"
    )
    fecha_reserva = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default="PENDIENTE")
    parcela = models.ForeignKey(
        Parcela,
        on_delete=models.CASCADE,
        related_name="reservas"
    )

    def __str__(self):
        return f"Reserva {self.id_reserva} - Usuario {self.usuario_id}"


class Pago(models.Model):
    METODO_CHOICES = [
        ("EFECTIVO", "Efectivo"),
        ("TARJETA", "Tarjeta"),
        ("TRANSFERENCIA", "Transferencia"),
    ]

    ESTADO_PAGO_CHOICES = [
        ("PENDIENTE", "Pendiente"),
        ("PAGADO", "Pagado"),
        ("ANULADO", "Anulado"),
    ]

    id_pago = models.AutoField(primary_key=True)
    reserva = models.ForeignKey(
        Reserva,
        on_delete=models.CASCADE,
        related_name="pagos"
    )
    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0.01)]
    )
    fecha_pago = models.DateField()
    metodo_pago = models.CharField(max_length=50, choices=METODO_CHOICES)
    estado_pago = models.CharField(max_length=20, choices=ESTADO_PAGO_CHOICES, default="PENDIENTE")

    def __str__(self):
        return f"Pago {self.id_pago} - Reserva {self.reserva_id}"


class Difunto(models.Model):
    id_difunto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(blank=True, null=True)
    parcela = models.ForeignKey(
        Parcela,
        on_delete=models.CASCADE,
        related_name="difuntos"
    )
    fecha_fallecimiento = models.DateField()
    notas = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
