# Guía de Deployment - Cementerio API

## 📋 Requisitos Previos

- VPS con Ubuntu 20.04 LTS o superior
- Python 3.11+
- PostgreSQL 14+
- Nginx (para proxy reverso)
- Git

## 🚀 Pasos de Instalación

### 1. Preparar el servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar dependencias del sistema
sudo apt install -y python3.11 python3.11-venv python3-pip \
    postgresql postgresql-contrib git nginx supervisor
```

### 2. Crear usuario y directorio del proyecto

```bash
# Crear usuario para la aplicación
sudo useradd -m -s /bin/bash www-data

# Crear directorio del proyecto
sudo mkdir -p /var/www/cementerio_api
sudo chown www-data:www-data /var/www/cementerio_api

# Crear directorio de logs
sudo mkdir -p /var/log/cementerio_api
sudo chown www-data:www-data /var/log/cementerio_api
```

### 3. Clonar el repositorio

```bash
# Cambiar a usuario www-data
sudo su - www-data

# Clonar desde GitHub
cd /var/www/cementerio_api
git clone https://github.com/tu-usuario/cementerio_api.git .

# O si ya existe el directorio:
cd /var/www/cementerio_api
git pull origin main
```

### 4. Crear entorno virtual e instalar dependencias

```bash
cd /var/www/cementerio_api

# Crear venv
python3.11 -m venv venv

# Activar venv
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Configurar PostgreSQL

```bash
# Como usuario postgres, crear base de datos
sudo -u postgres psql

# Dentro de psql:
CREATE DATABASE cementerio_db;
CREATE USER postgres WITH PASSWORD 'Abc123';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET default_transaction_deferrable TO on;
ALTER ROLE postgres SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE cementerio_db TO postgres;
\q
```

### 6. Ejecutar migraciones

```bash
cd /var/www/cementerio_api
source venv/bin/activate

# Recolectar archivos estáticos
python manage.py collectstatic --noinput --clear

# Ejecutar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 7. Configurar Gunicorn con Systemd

```bash
# Copiar el archivo service
sudo cp cementerio-api.service /etc/systemd/system/

# Recargar systemd
sudo systemctl daemon-reload

# Habilitar y iniciar el servicio
sudo systemctl enable cementerio-api
sudo systemctl start cementerio-api

# Verificar estado
sudo systemctl status cementerio-api
```

### 8. Configurar Nginx

```bash
# Crear configuración de Nginx
sudo nano /etc/nginx/sites-available/cementerio_api
```

Pega este contenido:

```nginx
upstream cementerio_api {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    client_max_body_size 10M;

    location /static/ {
        alias /var/www/cementerio_api/staticfiles/;
    }

    location /media/ {
        alias /var/www/cementerio_api/media/;
    }

    location / {
        proxy_pass http://cementerio_api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }
}
```

Luego:

```bash
# Habilitar la configuración
sudo ln -s /etc/nginx/sites-available/cementerio_api /etc/nginx/sites-enabled/

# Probar configuración
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### 9. Configurar SSL con Certbot (recomendado)

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Auto-renovación
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 📝 Cambios en settings.py

El proyecto ya está configurado con:

- **Database**: PostgreSQL en localhost (credenciales hardcoded)
- **DEBUG**: False (para producción)
- **ALLOWED_HOSTS**: ['localhost', '127.0.0.1']
- **STATIC_FILES**: Servidos por Nginx

Si necesitas cambiar las credenciales de PostgreSQL, edita `cementerio_api/settings.py`:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'cementerio_db',
        'USER': 'postgres',
        'PASSWORD': 'Abc123',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## 🔄 Deployment

Una vez configurado, para desplegar cambios:

```bash
# En tu máquina local
git add .
git commit -m "Mi cambio"
git push origin main

# En el VPS
cd /var/www/cementerio_api
sudo su www-data
source venv/bin/activate
./deploy.sh
```

O manualmente:

```bash
sudo su - www-data
cd /var/www/cementerio_api
source venv/bin/activate

# Actualizar código
git pull origin main

# Instalar nuevas dependencias
pip install -r requirements.txt

# Recolectar estáticos
python manage.py collectstatic --noinput --clear

# Migraciones
python manage.py migrate

# Reiniciar aplicación
exit  # volver a root
sudo systemctl restart cementerio-api
```

## 🐛 Troubleshooting

### La aplicación no inicia

```bash
# Ver logs de systemd
sudo journalctl -u cementerio-api -f

# Ver logs de Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar que Gunicorn funciona
cd /var/www/cementerio_api
source venv/bin/activate
python manage.py runserver 127.0.0.1:8000
```

### Problemas de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Conectarse a la BD
sudo -u postgres psql -d cementerio_db

# Verificar usuario
\du

# Salir
\q
```

### Permisos incorrectos

```bash
# Asegurar que www-data es propietario
sudo chown -R www-data:www-data /var/www/cementerio_api
sudo chown -R www-data:www-data /var/log/cementerio_api

# Permisos correctos
sudo chmod 755 /var/www/cementerio_api
sudo chmod 755 /var/log/cementerio_api
```

## 📊 Monitoreo

```bash
# Ver estado de la aplicación
sudo systemctl status cementerio-api

# Ver últimas líneas de logs
sudo tail -50 /var/log/cementerio_api/error.log
sudo tail -50 /var/log/cementerio_api/access.log

# Ver logs en tiempo real
sudo tail -f /var/log/cementerio_api/error.log
```

## 🔒 Seguridad

1. **SECRET_KEY**: Cambiar la SECRET_KEY en `settings.py`
2. **DEBUG**: Asegurar que DEBUG=False
3. **ALLOWED_HOSTS**: Actualizar con tu dominio real
4. **HTTPS**: Usar SSL con Certbot
5. **Firewall**: Configurar UFW

```bash
# Firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 📱 API Endpoints

Una vez desplegado, acceder a:

- API Admin: `https://tu-dominio.com/admin/`
- API Endpoints: `https://tu-dominio.com/api/`
- Health Check: `https://tu-dominio.com/api/health/`

## 🆘 Soporte

Para más información o problemas, consulta:
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Gunicorn Documentation](https://gunicorn.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
