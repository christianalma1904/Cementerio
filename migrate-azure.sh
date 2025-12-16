#!/bin/bash

# Script para ejecutar migraciones en Azure Web App
# Uso: ./migrate-azure.sh <app-name> <resource-group>

set -e

APP_NAME=$1
RESOURCE_GROUP=$2

if [ -z "$APP_NAME" ] || [ -z "$RESOURCE_GROUP" ]; then
    echo "Uso: ./migrate-azure.sh <app-name> <resource-group>"
    exit 1
fi

echo "Ejecutando migraciones en $APP_NAME..."

az webapp ssh \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --command "cd /app && python manage.py migrate"

echo "¡Migraciones completadas!"
