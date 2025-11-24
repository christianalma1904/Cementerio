from django.contrib import admin
from .models import Usuario, Parcela, Reserva, Pago, Difunto

admin.site.register(Usuario)
admin.site.register(Parcela)
admin.site.register(Reserva)
admin.site.register(Pago)
admin.site.register(Difunto)
