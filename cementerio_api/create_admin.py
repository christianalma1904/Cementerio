import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cementerio_api.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

# Eliminar usuario admin si existe
User.objects.filter(username='admin').delete()

# Crear nuevo usuario admin
user = User.objects.create_user(username='admin', password='1234', is_staff=True, is_superuser=True)

# Crear token
token, created = Token.objects.get_or_create(user=user)

print(f"✓ Usuario 'admin' creado con contraseña '1234'")
print(f"✓ Token: {token.key}")
print(f"✓ Es staff: {user.is_staff}")
