#!/bin/bash

# Deploy script simple para Cementerio API en VPS
# Ejecutar con: ./deploy.sh

set -e

echo "========================================="
echo "🚀 Cementerio API - Deploy en VPS"
echo "========================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/home/$(whoami)/cementerio_api"
VENV_DIR="$PROJECT_DIR/venv"

echo -e "${YELLOW}1. Actualizando código desde GitHub...${NC}"
cd $PROJECT_DIR
git fetch origin
git pull origin main

echo -e "${YELLOW}2. Activando entorno virtual...${NC}"
source $VENV_DIR/bin/activate

echo -e "${YELLOW}3. Instalando dependencias...${NC}"
pip install -q -r requirements.txt

echo -e "${YELLOW}4. Recolectando archivos estáticos...${NC}"
python manage.py collectstatic --noinput --clear

echo -e "${YELLOW}5. Aplicando migraciones...${NC}"
python manage.py migrate

echo -e "${YELLOW}6. Reiniciando aplicación...${NC}"
# Reiniciar gunicorn si está usando systemd
if systemctl is-active --quiet cementerio-api; then
    sudo systemctl restart cementerio-api
    echo -e "${GREEN}✅ Systemd service reiniciado${NC}"
else
    echo -e "${YELLOW}⚠️  Systemd service no está activo${NC}"
    echo "Para usar systemd, copia cementerio-api.service a /etc/systemd/system/"
fi

echo ""
echo -e "${GREEN}✅ ¡Deploy completado!${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. Verificar que la aplicación está corriendo:"
echo "     curl http://localhost:8000/admin/"
echo ""
echo "  2. Si usas Nginx, reinicia:"
echo "     sudo systemctl restart nginx"
echo ""
echo "  3. Ver logs del servidor:"
echo "     tail -f /var/log/cementerio_api/error.log"
