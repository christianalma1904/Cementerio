# 🔧 Solución del Error 502 Bad Gateway

## Problema Identificado

El error `502 Bad Gateway` significa que **nginx no puede comunicarse con la aplicación Django**. Esto sucede cuando:

1. ❌ El contenedor de Django ha fallado al iniciar
2. ❌ No hay conexión entre Docker y PostgreSQL  
3. ❌ Las variables de entorno no están configuradas correctamente
4. ❌ Migrations no se ejecutaron correctamente

---

## ✅ Cambios Realizados

### 1. **Configuración de Django (settings.py)**
- ✅ Variables de entorno ahora se leen correctamente
- ✅ `DB_HOST` ahora usa variable de entorno (por defecto: `localhost`)
- ✅ `DEBUG` se controla con variable `DEBUG` (por defecto: `True`)
- ✅ `ALLOWED_HOSTS` se lee desde variable de entorno

### 2. **Archivo .env creado**
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cementerio_db
DB_USER=postgres
DB_PASSWORD=Abc123
DB_HOST=db              # ← IMPORTANTE: 'db' es el nombre del servicio en Docker
DB_PORT=5432
DEBUG=False
SECRET_KEY=<tu-clave-secreta>
ALLOWED_HOSTS=20.169.25.93,localhost,127.0.0.1,cementerio-api.desarrollo-software.xyz
```

### 3. **Docker Compose mejorado**
- ✅ Nombres de contenedores explícitos
- ✅ Health checks para la base de datos
- ✅ Dependencia correcta: web espera a que db esté saludable
- ✅ Reinicio automático (`restart: unless-stopped`)
- ✅ Aumentado timeout de gunicorn a 120 segundos
- ✅ 4 workers en gunicorn para mejor rendimiento

---

## 🚀 Pasos para Aplicar la Solución

### Opción 1: Usar Docker Compose (RECOMENDADO)

```bash
# 1. Asegúrate de estar en el directorio raíz
cd c:\Users\DANIEL\Cementerio

# 2. Detener contenedores actuales
docker-compose down -v

# 3. Reconstruir las imágenes
docker-compose build --no-cache

# 4. Iniciar los servicios
docker-compose up -d

# 5. Verificar que todo esté funcionando
docker-compose ps
docker-compose logs web

# 6. Si hay problemas con migrations:
docker-compose exec web python manage.py migrate

# 7. Crear superusuario si es necesario
docker-compose exec web python manage.py createsuperuser
```

### Opción 2: Ejecutar el Script de Reinicio

```bash
bash restart.sh
```

### Opción 3: Diagnóstico Completo

```bash
bash diagnose.sh
```

---

## 🔍 Verificación

Después de aplicar los cambios, verifica que:

### ✓ Contenedores corriendo
```bash
docker-compose ps
```
Deberías ver:
- `cementerio_db` - UP
- `cementerio_api` - UP

### ✓ Logs sin errores
```bash
docker-compose logs web
```
Busca mensajes de error relacionados con:
- Migración de base de datos
- Conexión a PostgreSQL
- Gunicorn iniciándose

### ✓ Accesibilidad de la API
```bash
# En Windows
curl http://localhost:8000/admin/

# O abre en navegador
http://localhost:8000/admin/
```

### ✓ Conectividad entre contenedores
```bash
docker-compose exec web ping db
```

---

## 🆘 Si el Problema Persiste

### A. Limpieza completa

```bash
# Detener y eliminar todo
docker-compose down -v

# Limpiar imágenes y volúmenes
docker system prune -a --volumes

# Reconstruir desde cero
docker-compose build --no-cache
docker-compose up -d
```

### B. Verificar PostgreSQL

```bash
# Entrar en el contenedor de BD
docker-compose exec db psql -U postgres -d cementerio_db -c "\dt"

# Ver usuarios
docker-compose exec db psql -U postgres -c "\du"
```

### C. Verificar Django

```bash
# Ver errores de Django
docker-compose logs web --tail=100

# Ejecutar check de Django
docker-compose exec web python manage.py check

# Ver migraciones
docker-compose exec web python manage.py showmigrations
```

### D. Verificar Variables de Entorno

```bash
# Ver variables en el contenedor
docker-compose exec web env | grep DB_
docker-compose exec web env | grep ALLOWED_HOSTS
```

---

## 📝 Archivo de Configuración Actualizado

El archivo `.env` debe estar en la raíz del proyecto con:

```ini
# Database Configuration
DB_ENGINE=django.db.backends.postgresql
DB_NAME=cementerio_db
DB_USER=postgres
DB_PASSWORD=Abc123
DB_HOST=db
DB_PORT=5432

# Django Configuration
DEBUG=False
SECRET_KEY=django-insecure-8bkj#!kuql7!(np2*f8)4p_l*lt^-s1=35t0^v8i!f9#8ub64i
ALLOWED_HOSTS=20.169.25.93,localhost,127.0.0.1,cementerio-api.desarrollo-software.xyz,www.cementerio-api.desarrollo-software.xyz

# Application Configuration
CI=false
```

---

## ⚠️ Notas Importantes

1. **DB_HOST=db**: En Docker, `db` es el hostname del servicio, NO `localhost`
2. **DEBUG=False**: En producción SIEMPRE debe ser `False`
3. **ALLOWED_HOSTS**: Incluye todos los dominios donde accederás (IP y dominios)
4. **Health Checks**: Ahora el servicio web espera a que PostgreSQL esté listo

---

## 🎯 Próximos Pasos

1. ✅ Aplica los cambios ejecutando `docker-compose up -d`
2. ✅ Verifica con `docker-compose ps`
3. ✅ Accede a `http://localhost:8000/admin/` (localmente) o tu dominio en producción
4. ✅ Si el problema persiste, ejecuta `bash diagnose.sh` para más información

¿Necesitas ayuda adicional?
