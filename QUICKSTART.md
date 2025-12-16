# 🚀 Quick Start - Cementerio API

## Lo Que Tenemos

El **Cementerio API** completa con:

✅ Backend Django profesional  
✅ API REST lista para usar  
✅ GitHub Actions CI/CD automático  
✅ Docker para desarrollo  
✅ Scripts de deployment  
✅ Documentación completa

## Próxima Acción - Elige Una

### Opción A: Probar Localmente (5 minutos)

```bash
cd cementerio_api

# Crear entorno virtual
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar (si ya tienes PostgreSQL local)
python manage.py runserver
```

Acceder a: http://localhost:8000/admin/

### Opción B: Probar con Docker (3 minutos)

```bash
cd cementerio_api
docker-compose up -d
```

Acceder a: http://localhost:8000

### Opción C: Desplegar en VPS (1 hora)

Seguir **SETUP.md** paso a paso:
1. Conectarse al VPS por SSH
2. Ejecutar comandos de instalación
3. Configurar Nginx
4. Activar SSL

## Archivos Importantes

| Archivo | Propósito |
|---------|-----------|
| `README.md` | Guía general |
| `SETUP.md` | Instalación en VPS |
| `DEPLOYMENT.md` | Guía completa producción |
| `SUMMARY.md` | Resumen del proyecto |
| `requirements.txt` | Dependencias Python |
| `cementerio_api/settings.py` | Configuración Django |
| `.github/workflows/` | CI/CD automático |

## Configuración Clave

**Sin archivos .env** - Todo en `settings.py`

```python
# Base de datos (actualiza si es necesario)
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

## Comandos Esenciales

```bash
# Ver todos los comandos
python manage.py help

# Migraciones
python manage.py migrate
python manage.py makemigrations

# Usuario admin
python manage.py createsuperuser

# Estáticos
python manage.py collectstatic --noinput

# Tests
pytest
pytest --cov=cementerio

# Servidor
python manage.py runserver
```

## URLs de Admin

- Admin: `/admin/`
- API: `/api/`
- Health: `/api/health/` (si existe)

## Cambios Realizados Recientemente

✅ Removidos todos los archivos .env  
✅ Simplificado settings.py para usar solo variables hardcodeadas  
✅ GitHub Actions ahora solo corre tests (sin deploy automático)  
✅ Documentación completa de deployment  
✅ Scripts de deploy y verificación listos

## Ver Proyecto en GitHub

https://github.com/tu-usuario/cementerio_api

## Próximo Paso

1. Si quieres testear: elige Opción A o B arriba
2. Si quieres producción: lee SETUP.md
3. Si tienes dudas: revisa DEPLOYMENT.md o SUMMARY.md

---

**¡Todo listo! 🎉**
