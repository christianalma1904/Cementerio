# Cementerio App - Aplicación Flutter

Aplicación móvil multiplataforma desarrollada en **Flutter** que consume la API REST desarrollada en **Django** para un sistema de gestión de cementerios.

## Características Principales

### 🔐 Autenticación y Control de Acceso
- **Login con Token**: Autenticación basada en tokens contra la API Django
- **Gestión de Sesión**: Persistencia de tokens usando SharedPreferences
- **Control de Roles**: Protección de rutas basada en roles (ADMIN, CLIENTE)
- **Logout Seguro**: Limpieza de credenciales al cerrar sesión

### 📱 Interfaz Pública
- **Listado de Parcelas**: Vista de parcelas disponibles con búsqueda y filtros
- **Registro de Difuntos**: Consulta pública del registro de difuntos
- **Navegación Intuitiva**: Menú principal accesible para usuarios sin autenticar

### 🛠️ Panel Administrativo (Requiere rol ADMIN)
- **CRUD Parcelas**: Crear, leer, actualizar y eliminar parcelas
- **Gestión de Reservas**: Visualizar y cancelar reservas
- **Administración de Difuntos**: Registro completo de difuntos
- **Dashboard de Control**: Vista general del sistema

### 🎨 Diseño y UX
- **Material Design 3**: Interfaz moderna y consistente
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Temas Personalizados**: Colores y estilos corporativos
- **Manejo de Errores**: Mensajes informativos y recuperación de fallos

## Estructura del Proyecto

```
cementerio_app/
├── lib/
│   ├── main.dart                 # Punto de entrada y configuración
│   ├── models/                   # Modelos de datos
│   │   ├── usuario.dart
│   │   ├── parcela.dart
│   │   ├── reserva.dart
│   │   ├── pago.dart
│   │   ├── difunto.dart
│   │   ├── api_models.dart
│   │   └── index.dart
│   ├── services/                 # Servicios y comunicación con API
│   │   ├── api_service.dart      # Cliente HTTP con Dio
│   │   └── index.dart
│   ├── providers/                # Gestión de estado (Provider)
│   │   ├── auth_provider.dart
│   │   ├── parcela_provider.dart
│   │   ├── reserva_provider.dart
│   │   ├── difunto_provider.dart
│   │   └── index.dart
│   ├── screens/                  # Pantallas (UI)
│   │   ├── login_screen.dart
│   │   ├── home_screen.dart
│   │   ├── parcelas_public_screen.dart
│   │   ├── difuntos_public_screen.dart
│   │   ├── admin_parcelas_screen.dart
│   │   ├── admin_reservas_screen.dart
│   │   ├── admin_difuntos_screen.dart
│   │   └── index.dart
│   ├── widgets/                  # Componentes reutilizables
│   │   ├── role_protected_route.dart
│   │   └── index.dart
│   ├── utils/                    # Utilidades y configuración
│   │   ├── constants.dart
│   │   ├── theme.dart
│   │   ├── datetime_utils.dart
│   │   └── index.dart
│   └── assets/                   # Recursos (imágenes, iconos)
├── pubspec.yaml                  # Dependencias del proyecto
└── README.md                      # Este archivo
```

## Dependencias Principales

```yaml
http: ^1.1.0              # Cliente HTTP (alternativa)
dio: ^5.3.1               # Cliente HTTP avanzado
provider: ^6.1.0          # Gestión de estado
shared_preferences: ^2.2.2 # Almacenamiento local
jwt_decoder: ^2.0.1       # Decodificación de JWT
intl: ^0.19.0             # Internacionalización
```

## Instalación y Configuración

### Requisitos Previos
- Flutter 3.0 o superior
- Dart 3.0 o superior
- API Django ejecutándose (ver configuración de endpoints)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**
```bash
cd cementerio_app
```

2. **Obtener dependencias**
```bash
flutter pub get
```

3. **Configurar endpoints de API**

Editar `lib/utils/constants.dart` y ajustar:

```dart
// Para conectar a servidor remoto
static const String apiBaseUrl = 'http://cementerio-api.desarrollo-software.xyz';

// Para desarrollo local (emulador Android)
static const String apiBaseUrl = 'http://10.0.2.2:8000';

// Para desarrollo local (simulador iOS)
static const String apiBaseUrl = 'http://localhost:8000';
```

4. **Ejecutar la aplicación**

```bash
# En Android
flutter run -d android

# En iOS
flutter run -d ios

# En navegador
flutter run -d chrome
```

## API Consumida

### Endpoints Implementados

La aplicación consume los siguientes endpoints de la API Django:

#### Autenticación
```
POST /api/auth/login/
Body: {
  "username": "admin",
  "password": "1234"
}
Response: {
  "token": "abc123...",
  "user_id": 1,
  "username": "admin",
  "is_staff": true
}
```

#### Usuarios
```
GET    /api/usuarios/                 # Listar usuarios
GET    /api/usuarios/{id}/            # Obtener usuario
POST   /api/usuarios/                 # Crear usuario
PUT    /api/usuarios/{id}/            # Actualizar usuario
DELETE /api/usuarios/{id}/            # Eliminar usuario
```

#### Parcelas
```
GET    /api/parcelas/                 # Listar parcelas
GET    /api/parcelas/{id}/            # Obtener parcela
POST   /api/parcelas/                 # Crear parcela
PUT    /api/parcelas/{id}/            # Actualizar parcela
DELETE /api/parcelas/{id}/            # Eliminar parcela
```

#### Reservas
```
GET    /api/reservas/                 # Listar reservas
GET    /api/reservas/{id}/            # Obtener reserva
POST   /api/reservas/                 # Crear reserva
PUT    /api/reservas/{id}/            # Actualizar reserva
DELETE /api/reservas/{id}/            # Eliminar reserva
```

#### Pagos
```
GET    /api/pagos/                    # Listar pagos
GET    /api/pagos/{id}/               # Obtener pago
POST   /api/pagos/                    # Crear pago
PUT    /api/pagos/{id}/               # Actualizar pago
DELETE /api/pagos/{id}/               # Eliminar pago
```

#### Difuntos
```
GET    /api/difuntos/                 # Listar difuntos
GET    /api/difuntos/{id}/            # Obtener difunto
POST   /api/difuntos/                 # Crear difunto
PUT    /api/difuntos/{id}/            # Actualizar difunto
DELETE /api/difuntos/{id}/            # Eliminar difunto
```

### Parámetros Comunes

- **Paginación**: `?page=1` (10 items por página)
- **Búsqueda**: `?search=termino` (busca en campos indexados)
- **Ordenamiento**: `?ordering=-fecha` (usa `-` para orden descendente)

### Autenticación en Requests

Todos los requests protegidos deben incluir:
```
Authorization: Token {token_obtenido_en_login}
```

El `ApiService` lo maneja automáticamente mediante interceptores.

## Flujo de Autenticación

```
┌─────────────┐
│  LoginScreen│
└──────┬──────┘
       │ Usuario ingresa credenciales
       ▼
┌─────────────────────┐
│ AuthProvider.login()│
└──────┬──────────────┘
       │ POST /api/auth/login/
       ▼
┌──────────────────────┐
│ API devuelve token  │
└──────┬───────────────┘
       │ Token guardado en SharedPreferences
       ▼
┌──────────────────┐
│ HomeScreen      │
└──────────────────┘
(Redirige automáticamente)
```

## Control de Acceso por Roles

### Rutas Protegidas

La aplicación implementa protección de rutas usando el widget `RoleProtectedRoute`:

```dart
RoleProtectedRoute(
  requireAdmin: true,  // Solo ADMIN puede acceder
  child: const AdminParcelasScreen(),
)
```

### Niveles de Acceso

| Pantalla | Público | Cliente | Admin |
|----------|---------|---------|-------|
| Home | ✅ | ✅ | ✅ |
| Parcelas Públicas | ✅ | ✅ | ✅ |
| Difuntos Públicos | ✅ | ✅ | ✅ |
| Admin Parcelas | ❌ | ❌ | ✅ |
| Admin Reservas | ❌ | ❌ | ✅ |
| Admin Difuntos | ❌ | ❌ | ✅ |
| Admin Usuarios | ❌ | ❌ | ✅ |

## Gestión de Estado (Provider)

La aplicación usa **Provider** para gestión reactiva del estado:

### AuthProvider
- Maneja autenticación
- Almacena datos del usuario actual
- Controla sesión y logout

```dart
// Usar en un widget
Consumer<AuthProvider>(
  builder: (context, authProvider, _) {
    if (authProvider.isAuthenticated) {
      return Text('Usuario: ${authProvider.currentUser?.username}');
    }
    return const LoginScreen();
  },
)
```

### ParcelaProvider, ReservaProvider, DifuntoProvider
- Gestión de CRUD
- Caché de datos
- Búsqueda y paginación
- Manejo de errores

```dart
// Cargar datos
context.read<ParcelaProvider>().getParcelas();

// Crear elemento
context.read<ParcelaProvider>().createParcela(parcela);

// Actualizar elemento
context.read<ParcelaProvider>().updateParcela(id, parcela);

// Eliminar elemento
context.read<ParcelaProvider>().deleteParcela(id);
```

## Pruebas Funcionales

### Prueba 1: Autenticación
1. Abrir aplicación
2. Ingresa credenciales (username: "admin", password: "1234")
3. Presiona "Iniciar Sesión"
4. ✅ Redirige a HomeScreen si son correctas

### Prueba 2: Visualizar Parcelas Públicas
1. En HomeScreen, toca "Parcelas"
2. ✅ Se cargan y muestran todas las parcelas disponibles
3. Usa el buscador para filtrar por ubicación
4. ✅ Los resultados se actualizan en tiempo real

### Prueba 3: Ver Difuntos
1. En HomeScreen, toca "Difuntos"
2. ✅ Se carga el listado de difuntos registrados
3. Busca por nombre
4. ✅ Filtra los resultados correctamente

### Prueba 4: Acceso al Panel Admin (requiere ser ADMIN)
1. Iniciar sesión como usuario ADMIN
2. En HomeScreen aparecen opciones de administración
3. Toca "Admin Parcelas"
4. ✅ Se abre el panel de administración

### Prueba 5: CRUD de Parcelas (Admin)
1. En "Admin Parcelas", toca el botón + para crear nueva parcela
2. Completa el formulario (ubicación, tamaño, precio, estado)
3. Presiona "Guardar"
4. ✅ Aparece en la lista
5. Toca el lápiz para editar
6. ✅ Se actualiza correctamente
7. Toca la X para eliminar
8. ✅ Solicita confirmación y se elimina

### Prueba 6: Control de Acceso
1. Iniciar sesión como usuario NO-ADMIN
2. Intenta acceder a `/admin-parcelas` directamente
3. ✅ Muestra pantalla de acceso denegado

### Prueba 7: Búsqueda y Filtrado
1. En cualquier listado, usa el campo de búsqueda
2. Escribe un término
3. ✅ Los resultados se filtran automáticamente
4. Limpia el buscador
5. ✅ Se recargan todos los elementos

### Prueba 8: Manejo de Errores
1. Desconecta el Wi-Fi/Datos
2. Intenta cargar datos
3. ✅ Muestra mensaje de error con opción de reintentar
4. Reconecta y presiona reintentar
5. ✅ Los datos se cargan correctamente

### Prueba 9: Persistencia de Sesión
1. Inicia sesión
2. Cierra la aplicación completamente
3. Reabre la aplicación
4. ✅ Mantiene la sesión activa sin pedir login nuevamente

### Prueba 10: Logout
1. Presiona el ícono de perfil (arriba a la derecha)
2. Selecciona "Cerrar Sesión"
3. ✅ Limpia credenciales y redirige a LoginScreen

## Configuración de Desarrollo

### Variables de Entorno (Opcional)
Puedes crear un archivo `.env` para configuración:

```env
API_BASE_URL=http://localhost:8000
API_TIMEOUT=30
```

### Debug
Para ver logs detallados de las peticiones HTTP:

```dart
// En main.dart
_dio.interceptors.add(LoggingInterceptor());
```

## Troubleshooting

### Problema: "Connection refused"
**Solución**: Verifica que la API Django esté corriendo y la URL sea correcta

### Problema: "Unauthorized (401)"
**Solución**: El token expiró, inicia sesión nuevamente

### Problema: La app no carga datos
**Solución**: 
1. Verifica conexión a internet
2. Revisa que la API esté disponible
3. Comprueba los logs de la consola

## Mejoras Futuras

- [ ] Autenticación con biometría (Face ID, fingerprint)
- [ ] Caché offline de datos
- [ ] Notificaciones push
- [ ] Soporte multiidioma
- [ ] Tema oscuro
- [ ] Integración con mapas para ubicar parcelas
- [ ] Generación de reportes en PDF
- [ ] Pagos online integrados
- [ ] Sincronización en tiempo real con WebSockets

## Contacto y Soporte

Para reportar bugs o solicitar features, abre un issue en el repositorio.

## Licencia

Este proyecto es parte de un trabajo académico de Desarrollo de Software.

---

**Desarrollado con ❤️ en Flutter**  
**Versión**: 1.0.0  
**Última actualización**: Enero 2026
