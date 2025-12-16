# Guia de Setup Rapido - Cementerio API

## 1️⃣ En tu VPS (Ubuntu 20.04+)

### Paso 1: Instalar dependencias del sistema

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y python3.11 python3.11-venv python3-pip \
    postgresql postgresql-contrib nginx git supervisor
```

### Paso 2: Preparar estructura de directorios

```bash
# Crear usuario para la app
sudo useradd -m -s /bin/bash www-data

# Crear carpetas
sudo mkdir -p /var/www/cementerio_api
sudo mkdir -p /var/log/cementerio_api
sudo chown -R www-data:www-data /var/www/cementerio_api
sudo chown -R www-data:www-data /var/log/cementerio_api
```

### Paso 3: Clonar proyecto

```bash
cd /var/www/cementerio_api
sudo -u www-data git clone https://github.com/tu-usuario/cementerio_api.git .
```

### Paso 4: Configurar PostgreSQL

```bash
# Conectarse como postgres
sudo -u postgres psql

# Dentro de psql:
CREATE DATABASE cementerio_db;
CREATE USER postgres WITH PASSWORD 'Abc123';
ALTER ROLE postgres SET client_encoding TO 'utf8';
ALTER ROLE postgres SET default_transaction_isolation TO 'read committed';
ALTER ROLE postgres SET default_transaction_deferrable TO on;
ALTER ROLE postgres SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE cementerio_db TO postgres;

\q
```

### Paso 5: Setup de la aplicacion

```bash
cd /var/www/cementerio_api
sudo -u www-data python3.11 -m venv venv
sudo -u www-data venv/bin/pip install --upgrade pip
sudo -u www-data venv/bin/pip install -r requirements.txt
```

### Paso 6: Migraciones y archivos estaticos

```bash
cd /var/www/cementerio_api
sudo -u www-data venv/bin/python manage.py migrate
sudo -u www-data venv/bin/python manage.py collectstatic --noinput --clear
```

### Paso 7: Crear superusuario (opcional)

```bash
cd /var/www/cementerio_api
sudo -u www-data venv/bin/python manage.py createsuperuser
```

### Paso 8: Configurar Systemd

```bash
sudo cp /var/www/cementerio_api/cementerio-api.service /etc/systemd/system/

# Habilitar y iniciar
sudo systemctl daemon-reload
sudo systemctl enable cementerio-api
sudo systemctl start cementerio-api

# Verificar
sudo systemctl status cementerio-api
```

### Paso 9: Configurar Nginx

Crea archivo: `/etc/nginx/sites-available/cementerio_api`

```bash
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
        expires 30d;
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
# Crear enlace simbolico
sudo ln -s /etc/nginx/sites-available/cementerio_api /etc/nginx/sites-enabled/

# Remover default
sudo rm /etc/nginx/sites-enabled/default

# Probar sintaxis
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Paso 10: SSL con Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Auto-renovacion
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Paso 11: Firewall

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

## 2️⃣ Verificaciones

### Ver que esta corriendo

```bash
# Systemd
sudo systemctl status cementerio-api

# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql

# Puertos en uso
sudo netstat -tuln | grep -E ':(8000|80|443|5432)'
```

### Ver logs

```bash
# Aplicacion
sudo tail -50 /var/log/cementerio_api/error.log
tail -f /var/log/cementerio_api/access.log

# Nginx
sudo tail -50 /var/log/nginx/error.log
sudo tail -50 /var/log/nginx/access.log

# Systemd
sudo journalctl -u cementerio-api -n 50 -f
```

### Probar conectividad

```bash
# Desde VPS
curl http://localhost:8000/admin/
curl http://127.0.0.1:8000/api/

# Desde tu PC
curl http://tu-dominio.com/admin/
curl http://tu-dominio.com/api/
```

## 3️⃣ Deployment continuo

Para actualizar la app:

```bash
cd /var/www/cementerio_api

# Como www-data
sudo -u www-data bash << 'EOF'
source venv/bin/activate
git pull origin main
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput --clear
EOF

# Reiniciar
sudo systemctl restart cementerio-api
```

O usa el script:

```bash
cd /var/www/cementerio_api
sudo -u www-data ./deploy.sh
```

## 4️⃣ Troubleshooting

### La app no inicia

```bash
# Ver error especifico
sudo journalctl -u cementerio-api -n 100

# Probar manualmente
cd /var/www/cementerio_api
sudo -u www-data venv/bin/python manage.py runserver 127.0.0.1:8000
```

### Error de BD

```bash
# Verificar conexion
sudo -u postgres psql -d cementerio_db

# Ver usuario
\du

# Ver BD
\l

\q
```

### Nginx no muestra la app

```bash
# Verificar sintaxis
sudo nginx -t

# Ver configuracion
sudo cat /etc/nginx/sites-enabled/cementerio_api

# Reiniciar
sudo systemctl restart nginx
```

### Permisos incorrectos

```bash
sudo chown -R www-data:www-data /var/www/cementerio_api
sudo chown -R www-data:www-data /var/log/cementerio_api
chmod 755 /var/www/cementerio_api
chmod 755 /var/log/cementerio_api
```

## ✅ Checklist final

- [ ] PostgreSQL BD creada y usuario configurado
- [ ] Proyecto clonado en /var/www/cementerio_api
- [ ] Venv creado e instaladas dependencias
- [ ] Migraciones ejecutadas exitosamente
- [ ] Systemd service habilitado y corriendo
- [ ] Nginx configurado y corriendo
- [ ] SSL instalado y automatico
- [ ] Firewall configurado
- [ ] Dominio apuntando a VPS
- [ ] Acceso a admin en https://tu-dominio.com/admin/
- [ ] API respondiendo en https://tu-dominio.com/api/

## 📞 Soporte rapido

Si algo falla:

1. Verifica logs: `sudo journalctl -u cementerio-api -f`
2. Verifica BD: `sudo -u postgres psql -d cementerio_db`
3. Reinicia todo: `sudo systemctl restart cementerio-api nginx postgresql`
4. Lee DEPLOYMENT.md para mas detalles
