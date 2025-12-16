# ✅ DESPLIEGUE CEMENTERIO API - CHECKLIST COMPLETO

## 📦 FASE 1: CONFIGURACIÓN LOCAL

### Archivos Configurados
- ✅ `.gitignore` - Protege `.env`, `pycache`, `db.sqlite3`
- ✅ `.env.example` - Template de variables de entorno
- ✅ `requirements.txt` - Actualizado con 5 nuevas dependencias
- ✅ `settings.py` - Soporta variables de entorno

### Verificar Localmente
```bash
# Instalar dependencias
pip install -r cementerio_api/requirements.txt

# Verificar que python-dotenv está disponible
python -c "import dotenv; print('✅ dotenv OK')"

# Verificar que gunicorn está disponible
python -c "import gunicorn; print('✅ gunicorn OK')"

# Correr tests
cd cementerio_api
python manage.py test
```

---

## 🐳 FASE 2: DOCKER Y CONTENEDORES

### Archivos Listos
- ✅ `Dockerfile` - Imagen con Python 3.11, Gunicorn, PostgreSQL client
- ✅ `docker-compose.yml` - PostgreSQL + Django en local

### Verificar Localmente
```bash
# Construir imagen
docker build -t cementerio-api:latest .

# Verificar imagen
docker images | grep cementerio-api

# Correr en local con compose
docker-compose up -d
docker-compose logs -f web
docker-compose down
```

---

## 🔄 FASE 3: CI/CD GITHUB ACTIONS

### Pipeline Configurado
- ✅ `.github/workflows/django-ci-cd.yml` - 3 etapas automáticas:
  1. **TEST** - PostgreSQL + Coverage
  2. **BUILD** - Docker image a registry
  3. **DEPLOY** - A Azure Web App

### Verificar Antes del Push
```bash
# Syntax check del workflow
# Verificar en: https://github.com/tu-usuario/cementerio-api/actions
```

---

## ☁️ FASE 4: AZURE SETUP

### Scripts Listos
- ✅ `deploy-azure.sh` - Crea todos los recursos automáticamente
- ✅ `migrate-azure.sh` - Ejecuta migraciones remotas

### Ejecutar Manualmente (Alternativa)
```bash
# Crear Resource Group
az group create --name cementerio-rg --location eastus

# Crear Container Registry
az acr create --resource-group cementerio-rg --name cementerioacr --sku Basic

# Crear PostgreSQL
az postgres server create --resource-group cementerio-rg \
  --name cementerio-db-server --admin-user cemeteryadmin \
  --admin-password TuPassword123! --sku-name B_Gen5_1

# Crear Web App
az appservice plan create --name cementerio-plan \
  --resource-group cementerio-rg --sku B1 --is-linux

az webapp create --resource-group cementerio-rg \
  --plan cementerio-plan --name cementerio-api
```

---

## 🔐 FASE 5: SECRETS Y VARIABLES

### GitHub Secrets Necesarios
- [ ] `DOCKER_USERNAME` - Tu usuario de Docker Hub
- [ ] `DOCKER_PASSWORD` - Token de Docker Hub
- [ ] `AZURE_CREDENTIALS` - JSON con credenciales
- [ ] `AZURE_RESOURCE_GROUP` - `cementerio-rg`
- [ ] `AZURE_REGION` - `eastus`
- [ ] `SECRET_KEY` - Clave secreta Django larga
- [ ] `DB_PASSWORD` - Contraseña PostgreSQL
- [ ] `ALLOWED_HOSTS` - Tu dominio

### Generar SECRET_KEY
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Crear AZURE_CREDENTIALS
```bash
az ad sp create-for-rbac --name cementerio-api-cicd \
  --role Contributor \
  --scopes /subscriptions/tu-subscription-id

# Copiar el JSON output
```

---

## 📝 FASE 6: DOCUMENTACIÓN

### Guías Completadas
- ✅ `DEPLOYMENT_GUIDE.md` - Guía técnica completa (2000+ líneas)
- ✅ `DEPLOY_INSTRUCTIONS.md` - Paso a paso con comandos
- ✅ `COMPLETE_SETUP.md` - Resumen de implementación
- ✅ `README_DEPLOYMENT.md` - Quick start
- ✅ Este checklist

---

## 🚀 FASE 7: LANZAMIENTO

### Paso 1: Conectar GitHub
```bash
cd c:\Users\DANIEL\Cementerio

git add .
git commit -m "Add CI/CD and Azure deployment setup"

# Si no existe remote
git remote add origin https://github.com/tu-usuario/cementerio-api.git
git branch -M main
git push -u origin main

# Si ya existe remote
git push origin main
```

### Paso 2: Verificar GitHub
- [ ] Ir a: https://github.com/tu-usuario/cementerio-api
- [ ] Ver que todos los archivos están allí
- [ ] Ir a: Settings → Secrets and variables → Actions
- [ ] Todos los secrets están configurados ✅

### Paso 3: Trigger Pipeline (Opcional)
```bash
# Cualquier push a main disparará el pipeline
# O manualmente en Actions tab de GitHub

# Verificar logs en:
# https://github.com/tu-usuario/cementerio-api/actions
```

### Paso 4: Crear Recursos Azure
```bash
# Opción 1: Automático
chmod +x deploy-azure.sh
./deploy-azure.sh

# Opción 2: Manual
# Seguir comandos en DEPLOY_INSTRUCTIONS.md
```

### Paso 5: Configurar Web App
```bash
az webapp config appsettings set \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --settings \
    DEBUG=False \
    DB_ENGINE=django.db.backends.postgresql \
    DB_NAME=cementerio_db \
    DB_USER=cemeteryadmin@cementerio-db-server \
    DB_HOST=cementerio-db-server.postgres.database.azure.com \
    DB_PORT=5432 \
    ALLOWED_HOSTS=cementerio-api.azurewebsites.net \
    SECRET_KEY="tu-secret-key" \
    DB_PASSWORD="tu-db-password"
```

### Paso 6: Ejecutar Migraciones
```bash
az webapp ssh \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --command "cd /app && python manage.py migrate"

# Crear superusuario
az webapp ssh \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --command "cd /app && python manage.py createsuperuser"
```

### Paso 7: Verificar Despliegue
```bash
# Acceder a:
# https://cementerio-api.azurewebsites.net
# https://cementerio-api.azurewebsites.net/admin
# https://cementerio-api.azurewebsites.net/api/
```

---

## 📊 VERIFICACIONES

### ✅ Verificar Archivos Existen
```bash
ls -la .gitignore                         # Debe existir
ls -la .env.example                       # Debe existir
ls -la .github/workflows/django-ci-cd.yml # Debe existir
ls -la Dockerfile                         # Debe existir
ls -la docker-compose.yml                 # Debe existir
ls -la deploy-azure.sh                    # Debe existir
cat cementerio_api/requirements.txt       # Debe tener 13 líneas
```

### ✅ Verificar Código No Está Dañado
```bash
cd cementerio_api

# Syntax check
python -m py_compile cementerio_api/settings.py

# Django check
python manage.py check

# Importar módulos
python -c "from cementerio import views; print('✅ Imports OK')"
```

### ✅ Verificar Variables de Entorno
```bash
# Crear .env local
cp .env.example .env

# Editar .env con valores locales
# DEBUG=True
# ALLOWED_HOSTS=localhost,127.0.0.1

# Correr Django
cd cementerio_api
python manage.py runserver
# Debe funcionar sin errores
```

---

## 🎓 PARA TU ENTREGA PDF

### Secciones Incluir

**1. Enlace al Repositorio**
```
https://github.com/tu-usuario/cementerio-api
Incluir evidencia de:
- Código fuente visible
- .gitignore configurado
- .github/workflows/django-ci-cd.yml presente
```

**2. Descripción del Backend**
```
- Tema: API Cementerio – Gestión de Parcelas
- Problema: Automatizar gestión de reservas, pagos, usuarios
- Tecnologías:
  * Django 5.0.3 + DRF
  * PostgreSQL 14
  * Gunicorn + Nginx
  * Docker
  * Python 3.11
```

**3. Descripción del Despliegue**
```
- Servicio: Azure Web App (Linux)
- Base de datos: Azure Database for PostgreSQL
- Container Registry: Azure Container Registry
- Estructura servidor:
  /app/ → Código fuente
  /app/static/ → Archivos estáticos
  /app/media/ → Uploads
  /var/log/ → Logs
```

**4. CI/CD**
```
Pipeline: GitHub Actions (3 etapas)
1. TEST:
   - Instala dependencias
   - Corre tests con PostgreSQL
   - Genera cobertura
   
2. BUILD:
   - Construye imagen Docker
   - Pushea a Docker Hub
   
3. DEPLOY (solo main):
   - Autentica en Azure
   - Despliega a Web App
```

**5. Variables de Entorno**
```
Sensibles (.env local):
- SECRET_KEY
- DB_PASSWORD
- DEBUG
- ALLOWED_HOSTS

Gestión:
- GitHub Secrets para CI/CD
- Azure Key Vault para producción
- .gitignore protege .env (NO se sube)
```

**6. Evidencia de Funcionamiento**
```
- URL: https://cementerio-api.azurewebsites.net
- Captura del admin: /admin
- Captura de endpoints: /api/
- Logs de GitHub Actions exitosos
- Logs de Azure sin errores
```

---

## ✅ FINAL CHECKLIST

- [ ] Todos los archivos creados correctamente
- [ ] `settings.py` carga variables de entorno
- [ ] `requirements.txt` tiene todas las dependencias
- [ ] `.gitignore` protege `.env`
- [ ] `.github/workflows/django-ci-cd.yml` existe
- [ ] GitHub repositorio creado y conectado
- [ ] GitHub Secrets configurados
- [ ] Azure recursos creados
- [ ] Pipeline ejecutado exitosamente
- [ ] Migraciones ejecutadas en Azure
- [ ] API accesible en https://cementerio-api.azurewebsites.net
- [ ] PDF entrega preparado

---

## 🎉 ¡LISTO PARA ENTREGAR!

Si todo está ✅, tu proyecto está 100% completo y listo para evaluar.

**Buena suerte con la entrega! 🚀**
