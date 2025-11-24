from django.db import models


class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    telefono = models.CharField(max_length=20)
    tipo_usuario = models.CharField(max_length=20)
    fecha_registro = models.DateField(auto_now_add=True)

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"


class Parcela(models.Model):
    id_parcela = models.AutoField(primary_key=True)
    ubicacion = models.CharField(max_length=100)
    tamanio = models.CharField(max_length=50)
    estado = models.CharField(max_length=20)
    precio = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "parcelas"

    def __str__(self):
        return f"Parcela {self.id_parcela} - {self.ubicacion}"


class Reserva(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(
        Usuario, on_delete=models.CASCADE, related_name="reservas"
    )
    fecha_reserva = models.DateField()
    estado = models.CharField(max_length=20)
    parcela = models.ForeignKey(
        Parcela, on_delete=models.CASCADE, related_name="reservas"
    )

    class Meta:
        db_table = "reservas"

    def __str__(self):
        return f"Reserva {self.id_reserva}"


class Pago(models.Model):
    id_pago = models.AutoField(primary_key=True)
    reserva = models.ForeignKey(
        Reserva, on_delete=models.CASCADE, related_name="pagos"
    )
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pago = models.DateField()
    metodo_pago = models.CharField(max_length=50)
    estado_pago = models.CharField(max_length=20)

    class Meta:
        db_table = "pagos"

    def __str__(self):
        return f"Pago {self.id_pago} - {self.monto}"


class Difunto(models.Model):
    id_difunto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    parcela = models.ForeignKey(
        Parcela, on_delete=models.SET_NULL, null=True, related_name="difuntos"
    )
    fecha_fallecimiento = models.DateField()
    notas = models.TextField(blank=True)

    class Meta:
        db_table = "difuntos"

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
