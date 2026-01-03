# Guía Técnica - Arquitectura de Cementerio App

Documento técnico que describe la arquitectura, decisiones de diseño y patrones utilizados en la aplicación.

## 🏗️ Arquitectura General

La aplicación sigue una arquitectura **MVVM (Model-View-ViewModel)** con **Provider** para gestión de estado.

```
┌─────────────────────────────────────────┐
│         UI (Screens & Widgets)          │
│  (login_screen.dart, home_screen.dart)  │
└────────────────┬────────────────────────┘
                 │ (lectura/escritura)
                 ▼
┌─────────────────────────────────────────┐
│   Providers (State Management)          │
│  (auth_provider, parcela_provider)      │
└────────────────┬────────────────────────┘
                 │ (consulta)
                 ▼
┌─────────────────────────────────────────┐
│        Services (API Client)            │
│         (api_service.dart)              │
└────────────────┬────────────────────────┘
                 │ (HTTP requests)
                 ▼
┌─────────────────────────────────────────┐
│      External API (Django REST)         │
│    (cementerio-api.desarrollo-software) │
└─────────────────────────────────────────┘
```

---

## 📁 Capas de Aplicación

### 1. **Models** (`lib/models/`)
Define las estructuras de datos que representa la aplicación.

**Responsabilidades**:
- Definir clases para cada entidad (Usuario, Parcela, etc)
- Implementar serialización/deserialización (fromJson/toJson)
- Mantener lógica simple del modelo

**Ejemplo**:
```dart
class Parcela {
  final int idParcela;
  final String ubicacion;
  final String estado;
  
  factory Parcela.fromJson(Map<String, dynamic> json) => ...
  Map<String, dynamic> toJson() => ...
}
```

### 2. **Services** (`lib/services/`)
Capa de comunicación con la API.

**Responsabilidades**:
- Realizar requests HTTP hacia la API
- Manejar autenticación (tokens)
- Convertir respuestas a modelos
- Gestionar SharedPreferences para persistencia

**Ejemplo**:
```dart
class ApiService {
  Future<List<Parcela>> getParcelas() async {
    final response = await _dio.get(Constants.parcelasEndpoint);
    return (response.data['results'] as List)
      .map((json) => Parcela.fromJson(json))
      .toList();
  }
}
```

**Patrón Singleton**:
```dart
static final ApiService _instance = ApiService._internal();

factory ApiService() {
  return _instance;
}
```

### 3. **Providers** (`lib/providers/`)
Gestión reactiva del estado con `Provider`.

**Responsabilidades**:
- Mantener estado de la aplicación
- Notificar cambios a widgets
- Orquestar lógica de negocio
- Manejar errores y loading states

**Ejemplo**:
```dart
class ParcelaProvider extends ChangeNotifier {
  List<Parcela> _parcelas = [];
  bool _isLoading = false;
  
  Future<void> getParcelas() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _parcelas = await _apiService.getParcelas();
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
```

**Patrón ChangeNotifier**:
- `notifyListeners()` para avisar cambios
- `Consumer` en widgets para reactividad
- `context.read<Provider>()` para acceso simple

### 4. **Screens** (`lib/screens/`)
Pantallas/vistas de la aplicación.

**Responsabilidades**:
- Construir la interfaz de usuario
- Interpretar interacciones del usuario
- Consumir datos de providers
- Navegar entre pantallas

**Estructura típica**:
```dart
class MiPantalla extends StatefulWidget {
  @override
  State<MiPantalla> createState() => _MiPantallaState();
}

class _MiPantallaState extends State<MiPantalla> {
  @override
  void initState() {
    // Cargar datos
    context.read<Provider>().getData();
  }
  
  @override
  Widget build(BuildContext context) {
    return Consumer<Provider>(
      builder: (context, provider, _) {
        if (provider.isLoading) return LoadingWidget();
        if (provider.error != null) return ErrorWidget();
        return ContentWidget(provider.data);
      },
    );
  }
}
```

### 5. **Widgets** (`lib/widgets/`)
Componentes reutilizables.

**Responsabilidades**:
- Fragmentos de UI reutilizables
- No mantienen estado complejo
- Reciben datos como parámetros

**Ejemplo**:
```dart
class RoleProtectedRoute extends StatelessWidget {
  final Widget child;
  final bool requireAdmin;
  
  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, auth, _) {
        if (!auth.isAuthenticated) return UnauthorizedWidget();
        if (requireAdmin && !auth.isAdmin) return ForbiddenWidget();
        return child;
      },
    );
  }
}
```

### 6. **Utils** (`lib/utils/`)
Utilidades, constantes y configuración.

**Archivos**:
- `constants.dart` - URLs de API, claves de almacenamiento
- `theme.dart` - Tema visual (colores, estilos)
- `datetime_utils.dart` - Formateo de fechas y números

---

## 🔐 Flujo de Autenticación

```
1. Usuario abre app
   ↓
2. App verifica token en SharedPreferences
   ↓
3. Si hay token válido → HomeScreen
   Si no → LoginScreen
   ↓
4. Usuario ingresa credenciales
   ↓
5. AuthProvider.login() llama a ApiService
   ↓
6. ApiService POST a /api/auth/login/
   ↓
7. API devuelve token
   ↓
8. AuthProvider guarda token y notifica
   ↓
9. App redirige a HomeScreen
```

**Clases involucradas**:
```
LoginScreen → AuthProvider.login() → ApiService.login()
             ↓ (guarda token)
         SharedPreferences
             ↓ (recupera token)
         _RootPage → HomeScreen
```

---

## 🛡️ Control de Acceso

### Niveles de Protección

**1. Nivel de Ruta (Navegación)**
```dart
// En main.dart
'/admin-parcelas': (context) => RoleProtectedRoute(
  requireAdmin: true,
  child: const AdminParcelasScreen(),
)
```

**2. Nivel de Widget**
```dart
Consumer<AuthProvider>(
  builder: (context, auth, _) {
    if (!auth.isAdmin) return UnauthorizedWidget();
    return AdminContent();
  },
)
```

**3. Nivel de API**
- El servidor (Django) valida permisos
- Devuelve 403 si no tiene acceso

### Roles Soportados

```dart
enum UserRole {
  ADMIN,     // Acceso a todo
  CLIENTE,   // Solo lectura, datos propios
  // Extensible para otros roles
}

// Mapeo en modelo
class Usuario {
  final String tipoUsuario; // "ADMIN", "CLIENTE"
  bool get isAdmin => tipoUsuario == 'ADMIN';
}
```

---

## 🔄 Gestión de Estado con Provider

### Patrón usado: MVVM

```
Screen (View)
   ↓ 
   └─→ Consumer<Provider> ↔ Provider (ViewModel)
                              ↓
                          ApiService (Model)
```

### Ciclo de vida típico

```dart
// 1. Cargar datos en initState
@override
void initState() {
  Future.microtask(() {
    context.read<ParcelaProvider>().getParcelas();
  });
}

// 2. Mostrar UI basada en estado
Consumer<ParcelaProvider>(
  builder: (context, provider, _) {
    // provider.isLoading
    // provider.error
    // provider.parcelas
  },
)

// 3. Actualizar datos
await provider.createParcela(nuevaParcela);
// Provider automáticamente recarga lista
```

### Estados Manejados

```dart
class ParcelaProvider {
  List<Parcela> _parcelas;      // Datos
  bool _isLoading;              // Cargando
  String? _error;               // Error
  int _currentPage;             // Paginación
}
```

---

## 📡 Comunicación con API

### Cliente HTTP: DIO

**Configuración**:
```dart
_dio = Dio(
  BaseOptions(
    baseUrl: Constants.apiBaseUrl,
    connectTimeout: const Duration(seconds: 30),
    contentType: Headers.jsonContentType,
  ),
);
```

**Interceptores**:
```dart
_dio.interceptors.add(
  InterceptorsWrapper(
    onRequest: (options, handler) async {
      // Agregar token a headers
      final token = await getToken();
      if (token != null) {
        options.headers['Authorization'] = 'Token $token';
      }
      return handler.next(options);
    },
  ),
);
```

### Endpoints y Parámetros

**Búsqueda**:
```dart
await _dio.get(
  Constants.parcelasEndpoint,
  queryParameters: {'search': 'A1'},
);
// GET /api/parcelas/?search=A1
```

**Paginación**:
```dart
queryParameters: {'page': 2},
// GET /api/parcelas/?page=2
```

**Autenticación**:
```
Authorization: Token abc123def456...
```

---

## 🎨 Diseño y Temas

### Sistema de Colores

```dart
class AppTheme {
  static const Color primaryColor = Color(0xFF2C3E50);
  static const Color secondaryColor = Color(0xFF27AE60);
  static const Color errorColor = Color(0xFFE74C3C);
  
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      primaryColor: primaryColor,
      // ... más configuración
    );
  }
}
```

### Aplicar Tema

```dart
MaterialApp(
  theme: AppTheme.lightTheme,
  home: const _RootPage(),
)
```

### Usar Colores en Widgets

```dart
Container(
  color: AppTheme.primaryColor,
  child: Text(
    'Ejemplo',
    style: TextStyle(
      color: AppTheme.textPrimaryColor,
    ),
  ),
)
```

---

## 🧪 Manejo de Errores

### Niveles de Error

**1. Error de Red**
```dart
try {
  await apiService.getParcelas();
} on DioException catch (e) {
  if (e.type == DioExceptionType.connectionTimeout) {
    // Timeout
  } else if (e.type == DioExceptionType.unknown) {
    // Sin conexión
  }
}
```

**2. Error de API**
```dart
// API devuelve 400/500
// Dio lanza excepción
// Provider captura y guarda en _error
```

**3. Error de Aplicación**
```dart
// Mostrar SnackBar o Dialog
ScaffoldMessenger.of(context).showSnackBar(
  SnackBar(content: Text(error)),
);
```

### Estados de Carga

```dart
if (provider.isLoading) {
  return const Center(child: CircularProgressIndicator());
}
if (provider.error != null) {
  return ErrorWidget(error: provider.error);
}
return ContentWidget(data: provider.data);
```

---

## 📊 Flujos de CRUD

### CREATE (Crear)
```
Usuario presiona "+"
  ↓
Dialog/Pantalla de formulario
  ↓
Provider.createXXX(objeto)
  ↓
ApiService.post()
  ↓
API crea recurso
  ↓
Provider recarga lista
  ↓
Mostrar notificación "Creado"
```

### READ (Leer)
```
CargarPantalla
  ↓
initState() → Provider.getXXXs()
  ↓
ApiService.get()
  ↓
API devuelve datos
  ↓
Provider actualiza estado
  ↓
Consumer rebuilda UI con datos
```

### UPDATE (Actualizar)
```
Presionar editar
  ↓
Dialog pre-lleno con datos
  ↓
Provider.updateXXX(id, objeto)
  ↓
ApiService.put()
  ↓
API actualiza recurso
  ↓
Provider recarga lista
  ↓
Mostrar notificación "Actualizado"
```

### DELETE (Eliminar)
```
Presionar eliminar
  ↓
Confirmar en dialog
  ↓
Provider.deleteXXX(id)
  ↓
ApiService.delete()
  ↓
API elimina recurso
  ↓
Provider recarga lista
  ↓
Mostrar notificación "Eliminado"
```

---

## 🔄 Flujos de Datos

### Obtención de Datos

```dart
// 1. Usuario abre pantalla
class ParcelasScreen extends StatefulWidget {
  @override
  void initState() {
    // 2. Trigger carga de datos
    context.read<ParcelaProvider>().getParcelas();
  }
}

// 3. Provider llama a service
Future<void> getParcelas() async {
  _isLoading = true;
  notifyListeners();
  
  try {
    // 4. Service hace request
    _parcelas = await _apiService.getParcelas();
  } catch (e) {
    _error = e.toString();
  }
  
  _isLoading = false;
  notifyListeners(); // 5. Notifica a UI
}

// 6. Consumer reconstruye UI
Consumer<ParcelaProvider>(
  builder: (context, provider, _) {
    return ListView(children: provider.parcelas...); // Con datos
  },
)
```

### Búsqueda y Filtrado

```dart
onChanged: (query) {
  // Usuario tipea en buscador
  context.read<ParcelaProvider>().getParcelas(search: query);
  // Provider: _searchQuery = query
  // Service: GET /api/parcelas/?search=query
}
```

---

## 💾 Persistencia Local

### SharedPreferences

**Guardar después de login**:
```dart
Future<void> login(String username, String password) async {
  final response = await _apiService.login(username, password);
  
  // Guardar credenciales
  await _prefs.setString(Constants.tokenKey, response.token);
  await _prefs.setInt(Constants.userIdKey, response.userId);
}
```

**Recuperar al abrir app**:
```dart
Future<bool> isAuthenticated() async {
  final token = await getToken();
  return token != null && token.isNotEmpty;
}
```

**Limpiar al logout**:
```dart
Future<void> logout() async {
  await _prefs.remove(Constants.tokenKey);
  await _prefs.remove(Constants.userIdKey);
  // ...
}
```

---

## 🚀 Extensibilidad

### Agregar Nuevo Modelo

1. **Crear modelo** (`lib/models/nuevo.dart`)
2. **Crear provider** (`lib/providers/nuevo_provider.dart`)
3. **Agregar métodos en ApiService** (`lib/services/api_service.dart`)
4. **Crear pantalla** (`lib/screens/nuevo_screen.dart`)
5. **Registrar provider en main.dart**
6. **Agregar ruta en main.dart**

### Agregar Nuevo Rol

1. **Actualizar enum en Django**
2. **Actualizar modelo Usuario en Flutter**
3. **Actualizar lógica en AuthProvider**
4. **Proteger nuevas rutas según rol**

---

## 📈 Performance

### Optimizaciones Implementadas

✅ **Singleton ApiService** - Una sola instancia
✅ **Interceptores Dio** - Manejo centralizado de headers
✅ **Provider changeNotifier** - Rebuilds optimizados
✅ **SharedPreferences** - Caché local de credenciales
✅ **Timeouts** - 30 segundos para evitar bloqueos
✅ **Paginación** - 10 items por página

### Mejoras Posibles

- Implementar caché de datos con sqflite
- Paginación lazy (infinite scroll)
- Compresión de imágenes
- Diferido de operaciones costosas
- Uso de FutureBuilder/StreamBuilder

---

## 🧭 Decisiones de Diseño

| Decisión | Razón | Alternativa |
|----------|-------|-------------|
| Provider para estado | Simpleza y reactividad | Bloc, GetX, Riverpod |
| Dio para HTTP | Interceptores, cancelación | http, dio, chopper |
| SharedPreferences para auth | Persistencia simple | secure_storage, hive |
| MVVM arquitectura | Separación de concerns | MVC, MVP, Clean |

---

**Documento Versión**: 1.0  
**Última actualización**: Enero 2026
