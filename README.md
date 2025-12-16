# Cementerio API - Gestion de Reservas de Parcelas

Backend profesional en Django 5.0 + Django REST Framework + PostgreSQL para gestionar un cementerio municipal.

## Caracteristicas

- Gestion de Usuarios con autenticacion
- Gestion de Parcelas disponibles
- Sistema de Reservas con disponibilidad
- Procesamiento de Pagos
- Registro de Difuntos
- API REST completa
- CI/CD automatizado con GitHub Actions
- Deployment ready con Docker + Gunicorn + Nginx
- Documentacion completa

## Stack Tecnologico

- **Backend**: Django 5.0.3
- **API**: Django REST Framework 3.14.0
- **BD**: PostgreSQL 14+
- **Servidor**: Gunicorn + Nginx
- **Contenedores**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## Inicio Rapido - Desarrollo Local

### Requisitos

- Python 3.11+
- PostgreSQL 14+
- pip / virtualenv

### Instalacion

```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/cementerio_api.git
cd cementerio_api

# 2. Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o en Windows PowerShell:
.\venv\Scripts\Activate.ps1

# 3. Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# 4. Ejecutar migraciones
python manage.py migrate

# 5. Crear superusuario
python manage.py createsuperuser

# 6. Iniciar servidor
python manage.py runserver
```

Acceder a: http://localhost:8000/admin/

## Configuracion de Base de Datos

### Crear BD PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE cementerio_db;
CREATE USER postgres WITH PASSWORD 'Abc123';
GRANT ALL PRIVILEGES ON DATABASE cementerio_db TO postgres;
\q
```

### settings.py

La configuracion esta hardcodeada en cementerio_api/settings.py:

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

El proyecto detecta automaticamente CI=true para usar SQLite en GitHub Actions.

## Docker - Desarrollo Local

```bash
docker-compose up -d
docker-compose exec web python manage.py migrate
docker-compose logs -f web
```

## Testing

```bash
# Ejecutar pruebas
pytest

# Con cobertura
pytest --cov=cementerio

# GitHub Actions ejecuta automaticamente en cada push
```

## Deployment en VPS

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guia completa.

Resumen rapido:

```bash
# En el VPS
git clone <tu-repo> /var/www/cementerio_api
cd /var/www/cementerio_api
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput

# Configurar systemd y Nginx
sudo cp cementerio-api.service /etc/systemd/system/
sudo systemctl enable cementerio-api
sudo systemctl start cementerio-api
```

## API Endpoints Principales

- GET /api/parcelas/ - Listar parcelas disponibles
- GET /api/parcelas/{id}/ - Detalle de parcela
- POST /api/reservas/ - Crear reserva
- GET /api/reservas/ - Mis reservas
- GET /admin/ - Panel administrativo

## Documentacion

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guia completa de produccion
- [SETUP.md](./SETUP.md) - Configuracion inicial

## Troubleshooting

### Error de conexion a PostgreSQL

```bash
sudo systemctl status postgresql
psql -U postgres -d cementerio_db -h localhost
```

### Migraciones fallan

```bash
python manage.py migrate --verbosity 2
```

### Archivos estaticos no cargan

```bash
python manage.py collectstatic --clear --noinput
```

## Licencia

MIT

## Autor

Daniel - Desarrollo inicial
