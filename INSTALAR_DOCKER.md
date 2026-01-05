# 🐳 Instalación de Docker Desktop en Windows

## ¿Qué es Docker?

Docker permite ejecutar la aplicación en contenedores aislados, garantizando que funcione igual en desarrollo que en producción.

---

## 📋 Requisitos Previos

- **Windows 10 Pro, Enterprise o Education** (o Windows 11)
- **Mínimo 4GB RAM disponible**
- **Virtualización habilitada en BIOS**
- **Derechos de administrador**

---

## 🔧 Instalación Paso a Paso

### Paso 1: Descargar Docker Desktop

1. Ve a [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Haz clic en **"Download for Windows"**
3. Se descargará `Docker Desktop Installer.exe`

### Paso 2: Ejecutar el Instalador

1. Haz doble clic en `Docker Desktop Installer.exe`
2. Se abrirá la ventana de instalación
3. **Marca las siguientes opciones:**
   - ✅ "Install required Windows components for WSL 2"
   - ✅ "Add Docker Compose to PATH"
4. Haz clic en **"Install"**
5. Espera a que termine (puede tardar 5-10 minutos)
6. Se pedirá tu contraseña de Windows - **escríbela**
7. Reinicia la computadora cuando termine

### Paso 3: Verificar la Instalación

Abre **PowerShell** y ejecuta:

```powershell
docker --version
docker compose version
```

Deberías ver algo como:
```
Docker version 27.0.0, build...
Docker Compose version v2.XX.X
```

---

## ✅ Si Todo se Instaló Correctamente

Verifica que Docker está corriendo:

```powershell
# En PowerShell
docker ps
```

Si ves una tabla vacía con "CONTAINER ID", **¡Docker está listo!**

---

## 🚀 Ahora Ejecuta tu Aplicación

```powershell
# En el directorio C:\Users\DANIEL\Cementerio
cd C:\Users\DANIEL\Cementerio

# Construir e iniciar los contenedores
docker compose up -d

# Ver si está corriendo
docker compose ps
```

---

## ⚠️ Problemas Comunes

### ❌ "WSL 2 installation is incomplete"

**Solución:**
1. Ve a Microsoft Store
2. Busca **"Ubuntu"** o **"WSL"**
3. Descarga e instala
4. Reinicia Docker

### ❌ "The computer doesn't have VT-X/AMD-V enabled"

**Solución:**
1. Reinicia la computadora
2. Presiona **F2, DEL, F10** o **F12** (según tu modelo) para entrar al BIOS
3. Busca **"Virtualization"** o **"Intel VT-x"**
4. Cambia a **"Enabled"**
5. Guarda y reinicia

### ❌ "Cannot find port 5432 available"

Significa que PostgreSQL ya está corriendo localmente. Ejecuta:

```powershell
# Para PostgreSQL local
Get-Process postgres

# Detenlo o cambia el puerto en docker-compose.yml
```

---

## 📝 Resumen

| Paso | Comando |
|------|---------|
| 1. Descargar | [Docker.com](https://www.docker.com/products/docker-desktop) |
| 2. Instalar | Ejecutar .exe y seguir pasos |
| 3. Reiniciar | Reiniciar computadora |
| 4. Verificar | `docker --version` |
| 5. Ejecutar App | `docker compose up -d` |

---

## 🆘 Si Necesitas Ayuda

Ejecuta esto y comparte el resultado:

```powershell
docker version
docker system info
docker compose version
```

¿Ya instalaste Docker? Entonces vuelve y ejecuta:

```powershell
cd C:\Users\DANIEL\Cementerio
docker compose up -d
```
