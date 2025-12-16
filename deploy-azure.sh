#!/bin/bash

# Azure Deployment Script para Cementerio API
# Este script automatiza el despliegue en Azure

set -e

echo "=== Cementerio API - Azure Deployment Setup ==="

# Variables
RESOURCE_GROUP="cementerio-rg"
LOCATION="eastus"
APP_NAME="cementerio-api"
CONTAINER_REGISTRY_NAME="cementerioacr"
ACR_URL="${CONTAINER_REGISTRY_NAME}.azurecr.io"
DB_SERVER="cementerio-db-server"
DB_NAME="cementerio_db"
DB_ADMIN_USER="cementerio_admin"
APP_SERVICE_PLAN="cementerio-plan"

echo "1. Creando Resource Group..."
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION

echo "2. Creando Container Registry..."
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $CONTAINER_REGISTRY_NAME \
  --sku Basic

echo "3. Construyendo y pushando imagen Docker..."
az acr build \
  --registry $CONTAINER_REGISTRY_NAME \
  --image cementerio-api:latest \
  .

echo "4. Creando PostgreSQL Database Server..."
az postgres server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --location $LOCATION \
  --admin-user $DB_ADMIN_USER \
  --admin-password $(openssl rand -base64 32) \
  --sku-name B_Gen5_1 \
  --storage-size 51200 \
  --version 14

echo "5. Creando database..."
az postgres db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER \
  --name $DB_NAME

echo "6. Configurando firewall de PostgreSQL..."
az postgres server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

echo "7. Creando App Service Plan..."
az appservice plan create \
  --name $APP_SERVICE_PLAN \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

echo "8. Creando Web App..."
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan $APP_SERVICE_PLAN \
  --name $APP_NAME \
  --deployment-container-image-name-user $(az acr credential show --name $CONTAINER_REGISTRY_NAME --query username -o tsv) \
  --deployment-container-image-name-password $(az acr credential show --name $CONTAINER_REGISTRY_NAME --query passwords[0].value -o tsv)

echo "9. Configurando variables de entorno en Web App..."
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    DEBUG=False \
    WEBSITES_ENABLE_APP_SERVICE_STORAGE=false \
    DOCKER_REGISTRY_SERVER_URL=https://$ACR_URL \
    DOCKER_REGISTRY_SERVER_USERNAME=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --query username -o tsv) \
    DOCKER_REGISTRY_SERVER_PASSWORD=$(az acr credential show --name $CONTAINER_REGISTRY_NAME --query passwords[0].value -o tsv)

echo "10. Configurando secretos en Key Vault..."
az keyvault create \
  --name "cementerio-keyvault" \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

echo ""
echo "=== Despliegue completado ==="
echo "Web App URL: https://${APP_NAME}.azurewebsites.net"
echo "Container Registry: $ACR_URL"
echo "Database Server: $DB_SERVER.postgres.database.azure.com"
echo ""
echo "Próximos pasos:"
echo "1. Obtener credenciales de la base de datos"
echo "2. Configurar variables de entorno en Azure Key Vault"
echo "3. Actualizar settings de Web App con variables de entorno"
echo "4. Ejecutar migraciones: az webapp ssh --name $APP_NAME"
