# 🔧 Configuración en Servidor VPS - PostgreSQL + Django

## Problema Actual

El script en tu VPS falla porque:
```
psycopg2.OperationalError: FATAL: password authentication failed for user "billing_user"
```

Esto significa que PostgreSQL está instalado pero la contraseña no coincide.

---

## ✅ Solución: Configurar .env en el Servidor

### Paso 1: Conectar al Servidor VPS

```bash
ssh user@20.169.25.93
# O con clave SSH
ssh -i ~/.ssh/id_rsa user@20.169.25.93
```

### Paso 2: Verificar PostgreSQL

```bash
# Ver si PostgreSQL está corriendo
sudo systemctl status postgresql

# Ver usuarios de PostgreSQL
sudo -u postgres psql -c "\du"

# Ver bases de datos
sudo -u postgres psql -c "\l"
```

### Paso 3: Encontrar las Credenciales Actuales

Si PostgreSQL ya está instalado, necesitas saber:

**Opción A: Credenciales existentes**
```bash
# Buscar archivo .env antiguo
ls -la /home/*/cementerio_api/.env
cat /home/*/cementerio_api/.env  # Mostrar credenciales

# O buscar en archivos de configuración
grep -r "billing_user" /home/*/
```

**Opción B: Reset de contraseña**
```bash
# Conectarse como postgres
sudo -u postgres psql

# Cambiar contraseña del usuario billing_user
ALTER USER billing_user WITH PASSWORD 'nueva-contraseña-segura';

# O crear nuevo usuario si no existe
CREATE USER billing_user WITH PASSWORD 'nueva-contraseña-segura';
GRANT ALL PRIVILEGES ON DATABASE cementerio_db TO billing_user;
ALTER USER billing_user CREATEDB;

# Salir
\q
```

### Paso 4: Crear .env en el Servidor

```bash
# Ir al directorio del proyecto
cd /home/*/cementerio_api

# Crear archivo .env
sudo nano .env
```

Pegar esto (CAMBIAR LOS VALORES):
```env
DEBUG=False
SECRET_KEY=django-insecure-cambiar-con-clave-larga-aleatoria
ALLOWED_HOSTS=tu-dominio.com,localhost,127.0.0.1,20.169.25.93

# Database - ACTUALIZAR CON TUS CREDENCIALES
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cementerio_db
DB_USER=billing_user
DB_PASSWORD=contraseña-que-estableciste-arriba
DB_HOST=localhost
DB_PORT=5432

# Static files
STATIC_URL=/static/
STATIC_ROOT=/var/www/cementerio_api/static/
MEDIA_URL=/media/
MEDIA_ROOT=/var/www/cementerio_api/media/

# CSRF
CSRF_TRUSTED_ORIGINS=https://tu-dominio.com,http://localhost:8000

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
```

Guardar: `Ctrl+O` → `Enter` → `Ctrl+X`

### Paso 5: Permisos

```bash
# El archivo .env debe tener permisos seguros
chmod 600 /home/*/cementerio_api/.env

# Verificar
ls -la /home/*/cementerio_api/.env
# Debe mostrar: -rw------- (solo lectura para el usuario)
```

### Paso 6: Crear Directorio de Static Files

```bash
# Crear directorio
sudo mkdir -p /var/www/cementerio_api/static
sudo mkdir -p /var/www/cementerio_api/media

# Cambiar propietario
sudo chown -R $USER:$USER /var/www/cementerio_api/

# Permisos
sudo chmod -R 755 /var/www/cementerio_api/
```

### Paso 7: Ejecutar Deploy Manual

```bash
cd /home/*/cementerio_api

# Hacer script ejecutable
chmod +x deploy.sh

# Ejecutar
./deploy.sh
```

---

## 🔧 Troubleshooting

### Error: "No such file or directory: .env"
```bash
# Verificar que .env existe
ls -la /home/*/cementerio_api/.env

# Si no existe, crearlo
touch /home/*/cementerio_api/.env
nano /home/*/cementerio_api/.env
```

### Error: "permission denied"
```bash
# Cambiar propietario
sudo chown $USER:$USER /home/*/cementerio_api/.env
chmod 600 /home/*/cementerio_api/.env
```

### PostgreSQL connection refused
```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Iniciar si no está corriendo
sudo systemctl start postgresql

# Verificar puerto
netstat -tlnp | grep 5432
```

### Base de datos no existe
```bash
# Conectarse como postgres
sudo -u postgres psql

# Crear database
CREATE DATABASE cementerio_db;

# Otorgar permisos
GRANT ALL PRIVILEGES ON DATABASE cementerio_db TO billing_user;

# Salir
\q
```

---

## 📋 Verificar Todo Funciona

```bash
# 1. Verificar que .env carga
source /home/*/cementerio_api/.env
echo $DB_USER  # Debe mostrar: billing_user

# 2. Conectar a PostgreSQL
psql -h localhost -U billing_user -d cementerio_db -c "SELECT version();"

# 3. Verificar migraciones
cd /home/*/cementerio_api
source venv/bin/activate
python manage.py migrate --check

# 4. Correr servidor
python manage.py runserver 0.0.0.0:8000

# 5. En otra terminal, verificar que responde
curl http://localhost:8000/admin/
```

---

## 🚀 Automatizar Deploy (Cron)

Para que actualice automáticamente cada hora:

```bash
# Abrir crontab
crontab -e

# Agregar esta línea (cada hora)
0 * * * * /home/*/cementerio_api/deploy.sh >> /var/log/cementerio_deploy.log 2>&1

# O cada 30 minutos
*/30 * * * * /home/*/cementerio_api/deploy.sh >> /var/log/cementerio_deploy.log 2>&1
```

---

## 📞 Resumen Rápido

1. **SSH** al servidor
2. **Crear** `.env` con credenciales correctas
3. **Permisos**: `chmod 600 .env`
4. **Ejecutar**: `./deploy.sh`
5. **Verificar**: `curl http://localhost:8000`

---

**¿Necesitas ayuda con contraseñas o credenciales específicas?**

Proporciona:
- ¿Cuál es la contraseña actual de PostgreSQL en tu VPS?
- ¿O prefieres que te ayude a resetearla?
