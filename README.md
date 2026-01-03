# Cementerio - Aplicación de Gestión de Parcelas y Reservas

Proyecto completo de **gestión de cementerios** desarrollado con **Django REST Framework** (backend) y **Flutter** (frontend móvil), implementando autenticación, control de acceso por roles, y un sistema completo de CRUD para parcelas, reservas y difuntos.

---

## 📋 Características Principales

### Backend (Django API)
- ✅ **Autenticación Token**: Login seguro contra la API
- ✅ **Gestión de Parcelas**: CRUD completo de parcelas disponibles
- ✅ **Sistema de Reservas**: Gestión de reservas con disponibilidad
- ✅ **Registro de Difuntos**: Información de difuntos vinculados a parcelas
- ✅ **Control de Usuarios**: Sistema de roles (ADMIN/CLIENTE)
- ✅ **CORS Configurado**: Soporte para consumo desde Flutter web
- ✅ **Pruebas Automatizadas**: Suite de 41+ test cases
- ✅ **CI/CD Integrado**: GitHub Actions para testing automático

### Frontend (Flutter App)
- ✅ **Interfaz Pública**: Visualización de parcelas y difuntos sin autenticar
- ✅ **Autenticación Segura**: Login con tokens, persistencia de sesión
- ✅ **Pantallas Protegidas**: Acceso por roles con redirección automática
- ✅ **Panel Administrativo**: CRUD completo de recursos (solo ADMIN)
- ✅ **Material Design 3**: Interfaz moderna y responsive
- ✅ **Multiplataforma**: Web, Android, iOS
- ✅ **Búsqueda y Filtros**: Búsqueda de parcelas en tiempo real

---

## 🛠 Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| **Backend** | Django 6.0 + Django REST Framework |
| **Frontend** | Flutter 3.35.6 + Dart |
| **Autenticación** | Token Auth (DRF) |
| **Base de Datos** | SQLite (dev) / PostgreSQL (prod) |
| **Estado (App)** | Provider 6.1.0 |
| **HTTP Client** | Dio 5.3.1 |
| **CI/CD** | GitHub Actions |

---

## 🚀 Inicio Rápido

### 1. Backend (Django API)

```bash
cd cementerio_api

# Crear entorno virtual
python -m venv .venv
.venv\Scripts\Activate.ps1  # Windows PowerShell

# Instalar dependencias
pip install -r requirements.txt

# Migrar base de datos
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor
python manage.py runserver
# Acceso: http://localhost:8000
```

### 2. Frontend (Flutter App)

```bash
cd cementerio_app

# Instalar dependencias
flutter pub get

# Opción A: Ejecutar en web (desarrollo)
flutter run -d chrome
# Acceso: http://localhost:3000

# Opción B: Compilar APK para Android
flutter build apk --release
# APK en: build/app/outputs/flutter-apk/app-release.apk

# Opción C: Ejecutar en emulador Android
flutter run
```

---

## 📱 Estructura del Proyecto

### Backend
```
cementerio_api/
├── cementerio/                  # App principal Django
│   ├── models.py               # Modelos: Usuario, Parcela, Reserva, Difunto, Pago
│   ├── serializers.py          # Serializadores DRF
│   ├── views.py                # Vistas API (generics)
│   ├── permissions.py          # Control de acceso por roles
│   ├── tests.py                # Test cases
│   └── migrations/
├── cementerio_api/             # Configuración Django
│   ├── settings.py             # CORS, Auth, Bases de datos
│   ├── urls.py                 # Rutas API
│   └── wsgi.py
├── manage.py                   # CLI Django
├── requirements.txt            # Dependencias Python
└── db.sqlite3                 # Base de datos (desarrollo)
```

### Frontend
```
cementerio_app/
├── lib/
│   ├── main.dart               # Punto de entrada, routing
│   ├── models/                 # Modelos Dart (Usuario, Parcela, etc.)
│   ├── services/
│   │   └── api_service.dart    # Cliente HTTP con Dio
│   ├── providers/              # State Management (Provider)
│   │   ├── auth_provider.dart
│   │   ├── parcela_provider.dart
│   │   ├── reserva_provider.dart
│   │   └── difunto_provider.dart
│   ├── screens/                # Pantallas
│   │   ├── login_screen.dart
│   │   ├── home_screen.dart
│   │   ├── parcelas_public_screen.dart
│   │   ├── difuntos_public_screen.dart
│   │   ├── admin_parcelas_screen.dart
│   │   ├── admin_reservas_screen.dart
│   │   └── admin_difuntos_screen.dart
│   ├── widgets/
│   │   └── role_protected_route.dart
│   └── utils/
│       ├── constants.dart      # URLs, configuración
│       └── theme.dart          # Material Design 3
├── README.md                   # Documentación app
├── TESTING.md                  # Pruebas funcionales
└── pubspec.yaml               # Dependencias Dart
```

---

## 🔐 Autenticación y Control de Acceso

### Flujo de Autenticación
```
LoginScreen → ApiService.login() → Token → SharedPreferences
                ↓
         AuthProvider.isAuthenticated = true
                ↓
    Redirige a HomeScreen (autenticado)
                ↓
    RoleProtectedRoute valida roles
                ↓
    ADMIN: Acceso a /admin-*
    CLIENTE: Acceso a pantallas públicas
```

### Roles Soportados
- **ADMIN** (`isStaff=true`): Acceso completo a panel administrativo
- **CLIENTE** (`isStaff=false`): Acceso solo a secciones públicas

---

## 📚 Documentación

- **[cementerio_app/README.md](./cementerio_app/README.md)** - Documentación completa de la app Flutter
- **[cementerio_app/TESTING.md](./cementerio_app/TESTING.md)** - Suite de pruebas funcionales (41+ test cases)

---

## ✅ Requisitos del Proyecto Cumplidos

Este proyecto implementa completamente los siguientes objetivos:

1. ✅ **Interfaz pública con navegación** - ParcelasPublicScreen, DifuntosPublicScreen, HomeScreen
2. ✅ **Autenticación contra API** - LoginScreen con tokens persistentes
3. ✅ **Pantallas privadas protegidas** - RoleProtectedRoute widget
4. ✅ **Control de acceso por roles** - ADMIN/CLIENTE con validación
5. ✅ **CRUD completo** - Create, Read, Update, Delete para todos los recursos
6. ✅ **Interfaz admin usable en móvil** - AdminParcelasScreen, AdminReservasScreen, AdminDifuntosScreen
7. ✅ **Documentación y pruebas** - README, TESTING.md con 41+ casos de prueba

---

## 🧪 Pruebas

### Backend
```bash
cd cementerio_api
pytest                          # Ejecutar todos los tests
pytest --cov=cementerio         # Con cobertura de código
pytest -v                       # Modo verbose
```

### Frontend
Consultar [cementerio_app/TESTING.md](./cementerio_app/TESTING.md) para suite completa de pruebas funcionales.

---

## 📄 Licencia

MIT

## 👤 Autor

Alcocer Marroquin Christian Daniel
