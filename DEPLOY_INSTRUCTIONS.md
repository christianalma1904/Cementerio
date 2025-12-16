# 📦 Instrucciones de Despliegue - Cementerio API

Este documento describe cómo desplegar la API en Azure con CI/CD automatizado.

## ✅ Pre-despliegue: Checklist

- [ ] Cuenta de Azure con credenciales estudiantiles
- [ ] Repositorio en GitHub (público o privado)
- [ ] Docker Hub account (opcional, para registry privado)
- [ ] Azure CLI instalado localmente
- [ ] Git configurado con SSH keys
- [ ] Python 3.11+ instalado localmente

---

## 🚀 Paso 1: Preparar GitHub

### 1.1 Crear Repositorio
```bash
# Inicializar repositorio local si no existe
git init
git add .
git commit -m "Initial commit: Cementerio API with CI/CD setup"

# Crear repositorio en GitHub desde web console
# Luego conectar:
git remote add origin https://github.com/tu-usuario/cementerio-api.git
git branch -M main
git push -u origin main
```

### 1.2 Configurar Secretos en GitHub

1. Ir a: **Settings → Secrets and variables → Actions**
2. Click en **New repository secret** y agregar:

```yaml
DOCKER_USERNAME: tu-docker-username
DOCKER_PASSWORD: token-de-docker-hub

AZURE_CREDENTIALS: |
  {
    "clientId": "tu-client-id",
    "clientSecret": "tu-client-secret",
    "subscriptionId": "tu-subscription-id",
    "tenantId": "tu-tenant-id"
  }

AZURE_RESOURCE_GROUP: cementerio-rg
AZURE_REGION: eastus

SECRET_KEY: (generar con: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
DB_PASSWORD: (contraseña fuerte para PostgreSQL)
ALLOWED_HOSTS: tu-dominio.com,www.tu-dominio.com
```

### 1.3 Crear Credenciales Azure

```bash
# Login en Azure
az login

# Crear service principal
az ad sp create-for-rbac \
  --name "cementerio-api-cicd" \
  --role Contributor \
  --scopes /subscriptions/tu-subscription-id

# Copiar el output JSON y pegarlo en AZURE_CREDENTIALS
```

---

## ☁️ Paso 2: Crear Recursos en Azure

### 2.1 Resource Group
```bash
az group create \
  --name cementerio-rg \
  --location eastus
```

### 2.2 Container Registry
```bash
az acr create \
  --resource-group cementerio-rg \
  --name cementerioacr \
  --sku Basic
```

### 2.3 PostgreSQL Database
```bash
# Crear servidor
az postgres server create \
  --resource-group cementerio-rg \
  --name cementerio-db-server \
  --location eastus \
  --admin-user cemeteryadmin \
  --admin-password TuContraseña123! \
  --sku-name B_Gen5_1 \
  --version 14 \
  --storage-size 51200

# Crear database
az postgres db create \
  --resource-group cementerio-rg \
  --server-name cementerio-db-server \
  --name cementerio_db

# Configurar firewall (permitir servicios Azure)
az postgres server firewall-rule create \
  --resource-group cementerio-rg \
  --server-name cementerio-db-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### 2.4 App Service Plan y Web App
```bash
# Crear plan
az appservice plan create \
  --name cementerio-plan \
  --resource-group cementerio-rg \
  --sku B1 \
  --is-linux

# Crear Web App
az webapp create \
  --resource-group cementerio-rg \
  --plan cementerio-plan \
  --name cementerio-api \
  --runtime "DOCKER|python:3.11"
```

### 2.5 Configurar Web App
```bash
# Conectar a Container Registry
az webapp config container set \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --docker-custom-image-name cementerioacr.azurecr.io/cementerio-api:latest \
  --docker-registry-server-url https://cementerioacr.azurecr.io \
  --docker-registry-server-user $(az acr credential show --name cementerioacr --query username -o tsv) \
  --docker-registry-server-password $(az acr credential show --name cementerioacr --query passwords[0].value -o tsv)

# Configurar variables de entorno
az webapp config appsettings set \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --settings \
    DEBUG=False \
    ALLOWED_HOSTS=cementerio-api.azurewebsites.net,tu-dominio.com \
    DB_ENGINE=django.db.backends.postgresql \
    DB_NAME=cementerio_db \
    DB_USER=cemeteryadmin@cementerio-db-server \
    DB_HOST=cementerio-db-server.postgres.database.azure.com \
    DB_PORT=5432 \
    DB_PASSWORD=TuContraseña123! \
    SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
```

---

## 🔄 Paso 3: Ejecutar CI/CD

### 3.1 Trigger Automático
```bash
# Hacer push a main branch - esto dispara el pipeline
git push origin main

# Ver progreso en GitHub: Actions tab
```

### 3.2 Pipeline Steps
1. **Test** - Ejecuta tests con PostgreSQL
2. **Build** - Construye imagen Docker
3. **Deploy** - Despliega a Azure Web App

### 3.3 Ejecutar Migraciones
```bash
# Una vez desplegado, ejecutar migraciones
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

---

## 📋 Paso 4: Verificar Despliegue

### 4.1 URL Base
```
https://cementerio-api.azurewebsites.net
```

### 4.2 Endpoints Disponibles
```bash
# API Admin
https://cementerio-api.azurewebsites.net/admin/

# API Endpoints
https://cementerio-api.azurewebsites.net/api/

# Swagger (si está configurado)
https://cementerio-api.azurewebsites.net/swagger/
```

### 4.3 Health Check
```bash
curl https://cementerio-api.azurewebsites.net/api/health/ -v
```

---

## 🔐 Paso 5: Configurar Dominio Personalizado (Opcional)

### 5.1 Apuntar DNS
En tu registrador de dominios, crear registro:
```
Type: CNAME
Name: cementerio-api
Value: cementerio-api.azurewebsites.net
```

### 5.2 Agregar a Web App
```bash
az webapp config hostname add \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --hostname tu-dominio.com

# Crear certificado SSL gratuito
az webapp config ssl create \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --certificate-name cementerio-cert \
  --hostname tu-dominio.com
```

---

## 📊 Paso 6: Monitoreo

### 6.1 Logs en Tiempo Real
```bash
az webapp log tail \
  --name cementerio-api \
  --resource-group cementerio-rg
```

### 6.2 Ver Métricas
1. Azure Portal → cementerio-api
2. Monitoring → Metrics
3. Seleccionar métricas (CPU, Memory, Requests)

### 6.3 Alertas
```bash
az monitor metrics alert create \
  --name high-cpu \
  --resource-group cementerio-rg \
  --scopes /subscriptions/sub-id/resourceGroups/cementerio-rg/providers/Microsoft.Web/sites/cementerio-api \
  --condition "avg Percentage CPU > 80" \
  --description "Alert cuando CPU > 80%"
```

---

## 🔄 Actualizar el Despliegue

### Método 1: Vía GitHub (Recomendado)
```bash
# Hacer cambios locales
git add .
git commit -m "Update API endpoints"

# Push dispara pipeline automáticamente
git push origin main

# El pipeline testa, construye e despliega automáticamente
```

### Método 2: Manual
```bash
# Construir imagen
docker build -t cementerio-api:latest .

# Tag para Azure
docker tag cementerio-api:latest cementerioacr.azurecr.io/cementerio-api:latest

# Push a Azure Container Registry
az acr login --name cementerioacr
docker push cementerioacr.azurecr.io/cementerio-api:latest

# Redeploy
az webapp deployment container config \
  --name cementerio-api \
  --resource-group cementerio-rg
```

---

## 🚨 Troubleshooting

### Error: "ModuleNotFoundError: django"
```bash
# Verificar requirements.txt
az webapp config appsettings list --name cementerio-api --resource-group cementerio-rg
```

### Error: "Connection refused" en DB
```bash
# Verificar firewall PostgreSQL
az postgres server firewall-rule list \
  --resource-group cementerio-rg \
  --server-name cementerio-db-server

# Agregar IP de Web App si falta
az postgres server firewall-rule create \
  --resource-group cementerio-rg \
  --server-name cementerio-db-server \
  --name AllowWebApp \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

### Error: "Static files not found"
```bash
# Ejecutar collectstatic
az webapp ssh \
  --name cementerio-api \
  --resource-group cementerio-rg \
  --command "cd /app && python manage.py collectstatic --noinput"
```

---

## 📝 Notas de Seguridad

✅ **Hacer:**
- Usar variables de entorno para secretos
- Nunca commitear `.env` (está en `.gitignore`)
- Usar HTTPS siempre
- Cambiar SECRET_KEY en producción
- Usar contraseñas fuertes para DB
- Habilitar SSL/TLS

❌ **NO hacer:**
- Hardcodear credenciales
- Usar DEBUG=True en producción
- Dejar ALLOWED_HOSTS vacío
- Compartir AZURE_CREDENTIALS

---

## 📞 Soporte

Para problemas:
1. Revisar logs: `az webapp log tail`
2. Verificar GitHub Actions: GitHub → Actions tab
3. Consultar Azure Portal → Application Insights

---

**Última actualización:** Diciembre 2024
