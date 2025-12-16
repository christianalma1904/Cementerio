# Guía de Despliegue - Cementerio API

## 📋 Tabla de Contenidos

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración Local](#configuración-local)
4. [CI/CD con GitHub Actions](#cicd-con-github-actions)
5. [Despliegue en Azure](#despliegue-en-azure)
6. [Manejo de Variables de Entorno](#manejo-de-variables-de-entorno)
7. [Monitoreo y Mantenimiento](#monitoreo-y-mantenimiento)

---

## 📱 Descripción del Proyecto

### Tema del Sistema
**API Cementerio – Gestión de Reservas de Parcelas**

### Problema que Resuelve
Sistema integral para:
- Gestión de usuarios y perfiles
- Administración de parcelas disponibles
- Gestión de reservas y ocupación
- Control de pagos de servicios
- Registro y gestión de difuntos

### Tecnologías Utilizadas

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Django 5.0.3 |
| **API REST** | Django REST Framework 3.14.0 |
| **Base de Datos** | PostgreSQL 14+ |
| **Servidor** | Gunicorn |
| **Contenedor** | Docker |
| **Orquestación** | Docker Compose |
| **CI/CD** | GitHub Actions |
| **Nube** | Microsoft Azure |
| **Lenguaje** | Python 3.11+ |

---

## 🔧 Requisitos Previos

### Locales
- Python 3.11+
- PostgreSQL 14+
- Docker & Docker Compose
- Git
- pip / virtualenv

### Cloud
- Cuenta de Azure (estudiante)
- GitHub Repository (público o privado)
- Azure CLI instalado localmente
- Acceso a container registry

---

## 🚀 Configuración Local

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/cementerio-api.git
cd cementerio_api
```

### 2. Crear Entorno Virtual
```bash
python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

### 3. Instalar Dependencias
```bash
pip install --upgrade pip
pip install -r cementerio_api/requirements.txt
```

### 4. Configurar Variables de Entorno
```bash
# Copiar plantilla
cp .env.example .env

# Editar con tus valores
# En producción, usar valores seguros
```

### 5. Ejecutar Migraciones
```bash
cd cementerio_api
python manage.py migrate
python manage.py createsuperuser
```

### 6. Ejecutar en Desarrollo
```bash
python manage.py runserver
```

---

## 🐳 Desarrollo con Docker

### Construcción de Imagen
```bash
docker build -t cementerio-api:latest .
```

### Usando Docker Compose
```bash
# Iniciar servicios
docker-compose up -d

# Ejecutar migraciones
docker-compose exec web python manage.py migrate

# Crear superusuario
docker-compose exec web python manage.py createsuperuser

# Ver logs
docker-compose logs -f web

# Detener servicios
docker-compose down
```

---

## 🔄 CI/CD con GitHub Actions

### Flujo de Pipeline

El workflow automatizado realiza:

1. **Testing** (en cada push)
   - Instala dependencias
   - Configura base de datos PostgreSQL de prueba
   - Ejecuta migraciones
   - Ejecuta tests con cobertura
   - Sube reporte de cobertura a Codecov

2. **Build** (main/develop)
   - Construye imagen Docker
   - Pushea a Docker Hub
   - Etiqueta con SHA del commit y "latest"

3. **Deploy** (solo en main)
   - Se autentica con Azure
   - Despliega a Azure Container Instances
   - Configura variables de entorno

### Configurar Secretos en GitHub

En Settings → Secrets and variables → Actions:

```
DOCKER_USERNAME=tu-docker-username
DOCKER_PASSWORD=tu-docker-password-token
AZURE_CREDENTIALS={
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "..."
}
AZURE_RESOURCE_GROUP=cementerio-rg
AZURE_REGION=eastus
SECRET_KEY=tu-clave-secreta-larga-aleatoria
DB_PASSWORD=contraseña-segura-base-datos
ALLOWED_HOSTS=tu-dominio.com,www.tu-dominio.com
```

### Archivo de Configuración
Ubicación: `.github/workflows/django-ci-cd.yml`

---

## ☁️ Despliegue en Azure

### Opción 1: Azure Web App (Recomendado para Estudiantes)

#### Paso 1: Crear Recursos
```bash
# Login en Azure
az login

# Crear resource group
az group create \
  --name cementerio-rg \
  --location eastus

# Crear container registry
az acr create \
  --resource-group cementerio-rg \
  --name cementerioacr \
  --sku Basic
```

#### Paso 2: Crear Base de Datos PostgreSQL
```bash
# Crear servidor PostgreSQL
az postgres server create \
  --resource-group cementerio-rg \
  --name cementerio-db-server \
  --location eastus \
  --admin-user cemeteryadmin \
  --admin-password TuContraseña123! \
  --sku-name B_Gen5_1

# Crear base de datos
az postgres db create \
  --resource-group cementerio-rg \
  --server-name cementerio-db-server \
  --name cementerio_db

# Configurar firewall
az postgres server firewall-rule create \
  --resource-group cementerio-rg \
  --server-name cementerio-db-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

#### Paso 3: Crear Web App
```bash
# Crear App Service Plan
az appservice plan create \
  --name cementerio-plan \
  --resource-group cementerio-rg \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group cementerio-rg \
  --plan cementerio-plan \
  --name cementerio-api
```

#### Paso 4: Configurar Web App
```bash
# Configurar variables de entorno
az webapp config appsettings set \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --settings \
    DEBUG=False \
    DB_ENGINE=django.db.backends.postgresql \
    DB_NAME=cementerio_db \
    DB_USER=cemeteryadmin@cementerio-db-server \
    DB_HOST=cementerio-db-server.postgres.database.azure.com \
    DB_PORT=5432

# Configurar secretos (no hardcodear)
az webapp config appsettings set \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --settings \
    DB_PASSWORD=TuContraseña123! \
    SECRET_KEY=TuClaveSecretaLargaAleatoria123!
```

### Opción 2: Usar Script Automatizado
```bash
chmod +x deploy-azure.sh
./deploy-azure.sh
```

---

## 🔐 Manejo de Variables de Entorno

### Archivo `.env` Local
```env
DEBUG=False
SECRET_KEY=your-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cementerio_db
DB_USER=cementerio_user
DB_PASSWORD=your-secure-password
DB_HOST=your-database-host.postgres.database.azure.com
DB_PORT=5432

# Static files
STATIC_URL=/static/
STATIC_ROOT=/app/static/
```

### ✅ NUNCA Subir al Repositorio
El archivo `.env` está en `.gitignore` y NO se sube nunca:
```
.env
.env.local
*.env
```

### 📝 Variables Públicas vs Secretas

| Variable | Tipo | Almacenamiento |
|----------|------|-----------------|
| `DEBUG` | Pública | Código / Variables |
| `ALLOWED_HOSTS` | Pública | Código / Variables |
| `SECRET_KEY` | **Secreta** | GitHub Secrets / Azure Key Vault |
| `DB_PASSWORD` | **Secreta** | GitHub Secrets / Azure Key Vault |
| `API_KEYS` | **Secreta** | GitHub Secrets / Azure Key Vault |

### GitHub Secrets
Las variables sensibles se almacenan en:
- GitHub repo → Settings → Secrets and variables → Actions
- Se inyectan en el pipeline: `${{ secrets.NOMBRE_SECRETO }}`

### Azure Key Vault
Para producción con Azure:
```bash
# Crear Key Vault
az keyvault create \
  --name cementerio-keyvault \
  --resource-group cementerio-rg

# Guardar secretos
az keyvault secret set \
  --vault-name cementerio-keyvault \
  --name db-password \
  --value "tu-contraseña-segura"

az keyvault secret set \
  --vault-name cementerio-keyvault \
  --name django-secret-key \
  --value "tu-clave-secreta"
```

---

## 📊 Estructura de Carpetas en Servidor

```
/app/
├── cementerio_api/          # Código fuente
│   ├── manage.py
│   ├── requirements.txt
│   ├── cementerio/
│   ├── cementerio_api/
│   └── static/
├── static/                  # Archivos estáticos (collectados)
├── media/                   # Archivos subidos por usuarios
├── logs/                    # Logs de aplicación
└── venv/                    # Entorno virtual (si no usa Docker)
```

---

## ✅ Ejecución en Producción

### Con Gunicorn
```bash
gunicorn cementerio_api.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --timeout 120 \
  --access-logfile - \
  --error-logfile -
```

### Con Docker
```bash
docker run -d \
  --name cementerio-api \
  -p 8000:8000 \
  -e DEBUG=False \
  -e SECRET_KEY=... \
  -e DB_PASSWORD=... \
  cementerioacr.azurecr.io/cementerio-api:latest
```

### Con Azure Web App
- Se ejecuta automáticamente en producción
- URL: `https://cementerio-api.azurewebsites.net`
- Monitoreo disponible en Azure Portal

---

## 🔍 Monitoreo y Debugging

### Ver Logs en Azure
```bash
# Logs en tiempo real
az webapp log tail --name cementerio-api --resource-group cementerio-rg

# Descargar logs
az webapp log download --name cementerio-api --resource-group cementerio-rg
```

### Health Check
```bash
curl https://cementerio-api.azurewebsites.net/api/health/
```

### Ejecutar Comandos en Producción
```bash
# SSH a Web App
az webapp ssh --name cementerio-api --resource-group cementerio-rg

# En el contenedor
python manage.py shell
python manage.py collectstatic
python manage.py migrate
```

---

## 📈 Métricas de Cobertura de Tests

El pipeline genera reportes de cobertura:
- Enviados a Codecov automáticamente
- Visibles en: `codecov.io/gh/tu-usuario/tu-repo`
- Objetivo: >80% de cobertura

---

## 🚨 Troubleshooting

### Problema: "ModuleNotFoundError: No module named 'django'"
```bash
# Solución
pip install -r requirements.txt
```

### Problema: Base de datos no conecta
```bash
# Verificar credenciales en .env
# Verificar firewall de PostgreSQL
az postgres server firewall-rule list --resource-group cementerio-rg
```

### Problema: Variables de entorno no se cargan
```bash
# Verificar archivo .env existe
# Usar python-dotenv en settings.py
# Revisar rutas absolutas vs relativas
```

### Problema: Permisos de disco en Azure
```bash
# Cambiar rutas a /tmp para archivos temporales
# Usar Azure Blob Storage para media
```

---

## 📚 Referencias

- [Django Deployment Checklist](https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure for Python Developers](https://learn.microsoft.com/en-us/azure/developer/python/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Gunicorn Configuration](https://docs.gunicorn.org/)

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0
**Autor:** Cementerio API Team
