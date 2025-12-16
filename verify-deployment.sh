#!/bin/bash

# Script de verificacion del despliegue de Cementerio API
# Uso: ./verify-deployment.sh

set -e

echo "=========================================="
echo "🔍 Verificación de Deployment - Cementerio API"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

# Función para verificar comando
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 instalado: $(eval $1 --version 2>/dev/null | head -1 || echo 'OK')"
    else
        echo -e "${RED}✗${NC} $1 NO encontrado"
        ERRORS=$((ERRORS + 1))
    fi
}

# Función para verificar servicio
check_service() {
    if systemctl is-active --quiet $1; then
        echo -e "${GREEN}✓${NC} $1 corriendo"
    else
        echo -e "${RED}✗${NC} $1 NO está corriendo"
        ERRORS=$((ERRORS + 1))
    fi
}

# Función para verificar puerto
check_port() {
    if nc -z 127.0.0.1 $1 2>/dev/null; then
        echo -e "${GREEN}✓${NC} Puerto $1 abierto"
    else
        echo -e "${RED}✗${NC} Puerto $1 cerrado"
        ERRORS=$((ERRORS + 1))
    fi
}

# Función para verificar directorio
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} Directorio existe: $1"
    else
        echo -e "${RED}✗${NC} Directorio NO existe: $1"
        ERRORS=$((ERRORS + 1))
    fi
}

echo -e "${BLUE}1. Verificando programas instalados:${NC}"
check_command python3.11
check_command psql
check_command nginx
check_command git
echo ""

echo -e "${BLUE}2. Verificando servicios activos:${NC}"
check_service postgresql
check_service nginx
check_service cementerio-api
echo ""

echo -e "${BLUE}3. Verificando puertos:${NC}"
check_port 5432
check_port 8000
check_port 80
check_port 443
echo ""

echo -e "${BLUE}4. Verificando directorios:${NC}"
check_dir /var/www/cementerio_api
check_dir /var/log/cementerio_api
check_dir /var/www/cementerio_api/staticfiles
check_dir /var/www/cementerio_api/venv
echo ""

echo -e "${BLUE}5. Verificando archivos de configuracion:${NC}"
if [ -f /etc/systemd/system/cementerio-api.service ]; then
    echo -e "${GREEN}✓${NC} Systemd service existe"
else
    echo -e "${RED}✗${NC} Systemd service NO existe"
    ERRORS=$((ERRORS + 1))
fi

if [ -f /etc/nginx/sites-enabled/cementerio_api ]; then
    echo -e "${GREEN}✓${NC} Nginx config existe"
else
    echo -e "${RED}✗${NC} Nginx config NO existe"
    ERRORS=$((ERRORS + 1))
fi

if [ -f /var/www/cementerio_api/cementerio_api/settings.py ]; then
    echo -e "${GREEN}✓${NC} Django settings.py existe"
else
    echo -e "${RED}✗${NC} Django settings.py NO existe"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo -e "${BLUE}6. Verificando base de datos:${NC}"
if sudo -u postgres psql -d cementerio_db -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} BD cementerio_db accesible"
    TABLES=$(sudo -u postgres psql -d cementerio_db -c "\dt" | wc -l)
    echo -e "${GREEN}  ├─${NC} Tablas en BD: $TABLES"
else
    echo -e "${RED}✗${NC} BD cementerio_db NO accesible"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo -e "${BLUE}7. Probando conectividad:${NC}"
if curl -s http://127.0.0.1:8000/api/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API responde en puerto 8000"
else
    echo -e "${RED}✗${NC} API NO responde en puerto 8000"
    ERRORS=$((ERRORS + 1))
fi

if curl -s http://127.0.0.1/admin/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Nginx proxy funciona"
else
    echo -e "${YELLOW}⚠${NC} Nginx proxy: verificar configuración"
fi
echo ""

echo -e "${BLUE}8. Informacion del sistema:${NC}"
echo -e "${BLUE}  ├─${NC} Sistema: $(uname -s)"
echo -e "${BLUE}  ├─${NC} Kernel: $(uname -r)"
echo -e "${BLUE}  ├─${NC} CPU: $(grep -c ^processor /proc/cpuinfo) cores"
echo -e "${BLUE}  ├─${NC} RAM: $(free -h | awk 'NR==2 {print $2}')"
echo -e "${BLUE}  └─${NC} Disco: $(df -h /var/www | awk 'NR==2 {print $2}') disponible"
echo ""

echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ DEPLOYMENT EXITOSO - Todo está configurado correctamente${NC}"
else
    echo -e "${RED}❌ ERRORES DETECTADOS: $ERRORS problemas encontrados${NC}"
fi
echo "=========================================="
echo ""
echo "Proximos pasos:"
echo "1. Acceder a admin: http://tu-dominio.com/admin/"
echo "2. Acceder a API: http://tu-dominio.com/api/"
echo "3. Ver logs: sudo journalctl -u cementerio-api -f"
echo "4. Para actualizar: cd /var/www/cementerio_api && sudo -u www-data ./deploy.sh"
