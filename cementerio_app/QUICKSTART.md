# Inicio Rápido - Cementerio App

Guía rápida para empezar a trabajar con Cementerio App.

## 🚀 5 Minutos de Setup

### 1. Clonar/Descargar Proyecto
```bash
cd cementerio_app
```

### 2. Instalar Dependencias
```bash
flutter pub get
```

### 3. Configurar API
Edita `lib/utils/constants.dart`:

```dart
// Cambiar esto según tu entorno:
static const String apiBaseUrl = 'http://10.0.2.2:8000'; // Android local
// o
static const String apiBaseUrl = 'http://localhost:8000'; // iOS local
// o
static const String apiBaseUrl = 'http://cementerio-api.desarrollo-software.xyz'; // Remoto
```

### 4. Ejecutar
```bash
flutter run
```

---

## 🔑 Credenciales de Prueba

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | 1234 | ADMIN |
| cliente | 1234 | CLIENTE |

*Créalas primero en la API Django si no existen*

---

## 📱 Estructura Rápida

```
lib/
├── main.dart           ← Punto de entrada
├── models/             ← Modelos de datos (Usuario, Parcela, etc)
├── services/           ← Conexión con API (ApiService)
├── providers/          ← Gestión de estado (Provider)
├── screens/            ← Pantallas de UI
└── utils/              ← Configuración y utilidades
```

---

## 🔄 Flujo Principal

```
LoginScreen
    ↓ (autenticación exitosa)
HomeScreen
    ├→ Parcelas Públicas
    ├→ Difuntos Públicos
    └→ Admin (solo si es ADMIN)
        ├→ Admin Parcelas
        ├→ Admin Reservas
        └→ Admin Difuntos
```

---

## 📡 APIs Consumidas

La app se conecta a los siguientes endpoints:

```
POST   /api/auth/login/          ← Login
GET    /api/parcelas/            ← Listar parcelas
GET    /api/difuntos/            ← Listar difuntos
GET    /api/reservas/            ← Listar reservas (admin)
POST   /api/parcelas/            ← Crear parcela (admin)
PUT    /api/parcelas/{id}/       ← Editar parcela (admin)
DELETE /api/parcelas/{id}/       ← Eliminar parcela (admin)
// ... más endpoints en README.md
```

---

## 🛠️ Desarrollo

### Agregar Nueva Pantalla

1. **Crear archivo en `lib/screens/`**
```dart
class MiPantalla extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mi Pantalla')),
      body: Center(child: const Text('Contenido')),
    );
  }
}
```

2. **Agregar ruta en `main.dart`**
```dart
routes: {
  '/mi-pantalla': (context) => const MiPantalla(),
}
```

3. **Navegar desde otro lugar**
```dart
Navigator.pushNamed(context, '/mi-pantalla');
```

### Conectar a Datos de API

1. **Usar Provider**
```dart
Consumer<ParcelaProvider>(
  builder: (context, provider, _) {
    if (provider.isLoading) return CircularProgressIndicator();
    return ListView(
      children: provider.parcelas.map((p) => ListTile(
        title: Text(p.ubicacion),
      )).toList(),
    );
  },
)
```

2. **Cargar datos al abrir pantalla**
```dart
@override
void initState() {
  super.initState();
  Future.microtask(() {
    context.read<ParcelaProvider>().getParcelas();
  });
}
```

---

## 🔐 Autenticación

### Verificar si está logueado
```dart
Consumer<AuthProvider>(
  builder: (context, auth, _) {
    if (auth.isAuthenticated) {
      return Text('Usuario: ${auth.currentUser?.username}');
    }
    return const LoginScreen();
  },
)
```

### Verificar si es Admin
```dart
if (authProvider.isAdmin) {
  // Mostrar opciones admin
}
```

### Proteger ruta
```dart
RoleProtectedRoute(
  requireAdmin: true,  // Solo admins
  child: const AdminParcelas(),
)
```

---

## 🐛 Debug

### Ver logs de red
```dart
// En api_service.dart, descomentar interceptor
_dio.interceptors.add(LoggingInterceptor());
```

### Ver estado
```dart
final auth = context.read<AuthProvider>();
debugPrint('Token: ${auth.currentUser?.token}');
debugPrint('Is Admin: ${auth.isAdmin}');
```

---

## ⚡ Consejos Prácticos

✅ **Usa `Consumer` para acceder a providers**
```dart
Consumer<AuthProvider>(
  builder: (context, authProvider, _) => ...
)
```

✅ **Carga datos en `initState`**
```dart
@override
void initState() {
  super.initState();
  Future.microtask(() {
    context.read<ParcelaProvider>().getParcelas();
  });
}
```

✅ **Valida antes de enviar**
```dart
if (_formKey.currentState!.validate()) {
  // Crear/actualizar
}
```

✅ **Maneja errores siempre**
```dart
try {
  await apiService.getParcelas();
} catch (e) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(e.toString())),
  );
}
```

---

## 📦 Dependencias Principales

| Paquete | Uso |
|---------|-----|
| `provider` | Gestión de estado |
| `dio` | Cliente HTTP |
| `shared_preferences` | Almacenamiento local |
| `intl` | Formateo de fechas/dinero |

---

## ❓ Preguntas Frecuentes

**P: ¿Dónde guardo el token?**
R: En `SharedPreferences`, automáticamente por `ApiService`

**P: ¿Cómo cambio la URL de API?**
R: En `lib/utils/constants.dart`, busca `apiBaseUrl`

**P: ¿Cómo agrego una nuevo rol?**
R: Modifica `Usuario.tipoUsuario` en Django y `isAdmin` en Flutter

**P: ¿Cómo cierro sesión?**
R: Llama a `authProvider.logout()`, limpia datos automáticamente

**P: ¿Cómo filtro datos?**
R: Usa el parámetro `search`: `getParcelas(search: "A1")`

---

## 📚 Recursos

- [Flutter Docs](https://flutter.dev/docs)
- [Provider Docs](https://pub.dev/packages/provider)
- [Dio Docs](https://pub.dev/packages/dio)

---

**Última actualización**: Enero 2026  
¡Listo para empezar! 🚀
