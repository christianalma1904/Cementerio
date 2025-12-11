
from django.test import TestCase
from .models import Usuario, Parcela, Reserva, Pago, Difunto
from datetime import date

class UsuarioModelTest(TestCase):
	def test_crear_usuario(self):
		usuario = Usuario.objects.create(
			nombre="Juan",
			apellido="Pérez",
			email="juan@example.com"
		)
		self.assertEqual(str(usuario), "Juan Pérez")

class ParcelaModelTest(TestCase):
	def test_crear_parcela(self):
		parcela = Parcela.objects.create(
			ubicacion="Sector A",
			tamanio="2x2",
			precio=1000.00
		)
		self.assertIn("Sector A", str(parcela))

class ReservaModelTest(TestCase):
	def test_crear_reserva(self):
		usuario = Usuario.objects.create(nombre="Ana", apellido="López", email="ana@example.com")
		parcela = Parcela.objects.create(ubicacion="B1", tamanio="1x2", precio=500.00)
		reserva = Reserva.objects.create(usuario=usuario, parcela=parcela, fecha_reserva=date.today())
		self.assertIn("Usuario", str(reserva))

class PagoModelTest(TestCase):
	def test_crear_pago(self):
		usuario = Usuario.objects.create(nombre="Luis", apellido="Gómez", email="luis@example.com")
		parcela = Parcela.objects.create(ubicacion="C1", tamanio="2x3", precio=1500.00)
		reserva = Reserva.objects.create(usuario=usuario, parcela=parcela, fecha_reserva=date.today())
		pago = Pago.objects.create(reserva=reserva, monto=1500.00, fecha_pago=date.today(), metodo_pago="EFECTIVO")
		self.assertIn("Pago", str(pago))

class DifuntoModelTest(TestCase):
	def test_crear_difunto(self):
		parcela = Parcela.objects.create(ubicacion="D1", tamanio="1x1", precio=300.00)
		difunto = Difunto.objects.create(nombre="Pedro", apellido="Ramírez", parcela=parcela, fecha_fallecimiento=date.today())
		self.assertEqual(str(difunto), "Pedro Ramírez")
