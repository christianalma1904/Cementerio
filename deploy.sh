#!/bin/bash

# Deploy script mejorado para Cementerio API
# Ejecutar con: ./deploy.sh

set -e

echo "========================================="
echo "🚀 Cementerio API - Deploy Script"
echo "========================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorio del proyecto
PROJECT_DIR="/home/$(whoami)/cementerio_api"
VENV_DIR="$PROJECT_DIR/venv"

echo -e "${YELLOW}1. Actualizando código...${NC}"
cd $PROJECT_DIR
git fetch origin
git pull origin main

echo -e "${YELLOW}2. Activando entorno virtual...${NC}"
source $VENV_DIR/bin/activate

echo -e "${YELLOW}3. Instalando dependencias...${NC}"
pip install -q -r requirements.txt

# Verificar si .env existe y tiene configuración correcta
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${RED}❌ ARCHIVO .env NO ENCONTRADO${NC}"
    echo -e "${YELLOW}Crea un archivo .env en: $PROJECT_DIR/.env${NC}"
    echo ""
    echo "Ejemplo de contenido:"
    cat << EOF
DEBUG=False
SECRET_KEY=tu-clave-secreta-aqui
ALLOWED_HOSTS=tu-dominio.com,localhost

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cementerio_db
DB_USER=billing_user
DB_PASSWORD=tu-contraseña-aqui
DB_HOST=localhost
DB_PORT=5432

# Static files
STATIC_URL=/static/
STATIC_ROOT=/var/www/cementerio_api/static/
EOF
    echo ""
    exit 1
fi

echo -e "${YELLOW}4. Cargando variables de entorno...${NC}"
source $PROJECT_DIR/.env

echo -e "${YELLOW}5. Recolectando archivos estáticos...${NC}"
cd $PROJECT_DIR
python manage.py collectstatic --noinput --clear

echo -e "${YELLOW}6. Aplicando migraciones...${NC}"
python manage.py migrate || {
    echo -e "${RED}⚠️  Las migraciones fallaron${NC}"
    echo -e "${YELLOW}Verifica que las credenciales de base de datos en .env sean correctas:${NC}"
    echo "  - DB_USER: $DB_USER"
    echo "  - DB_HOST: $DB_HOST"
    echo "  - DB_NAME: $DB_NAME"
    exit 1
}

echo -e "${YELLOW}7. Reiniciando aplicación...${NC}"
# Reiniciar gunicorn si está usando systemd
sudo systemctl restart cementerio-api || {
    echo -e "${YELLOW}Nota: systemd service no está activo (es normal en desarrollo)${NC}"
}

echo ""
echo -e "${GREEN}✅ ¡Deploy completado!${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. Verificar que la aplicación está corriendo:"
echo "     curl http://localhost:8000"
echo ""
echo "  2. Si usas Nginx:"
echo "     sudo systemctl restart nginx"
echo ""
echo "  3. Ver logs:"
echo "     sudo journalctl -u cementerio-api -f"
