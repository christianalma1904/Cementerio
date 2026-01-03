# 🎬 Guía de Ejecución - Cementerio App

Instrucciones paso a paso para ejecutar y probar la aplicación Flutter.

## 📋 Requisitos Previos

- **Flutter** 3.0 o superior  
  Descargar: https://flutter.dev/docs/get-started/install

- **Dart** 3.0 o superior  
  (Incluido con Flutter)

- **API Django ejecutándose**  
  Verificar en: http://localhost:8000 o http://10.0.2.2:8000

- **Android Studio / Xcode / Emulador de Android**  
  (Para emular o conectar dispositivo)

## 🚀 Pasos de Ejecución

### Paso 1: Navegar a la Carpeta
```powershell
cd c:\Users\DANIEL\Cementerio\cementerio_app
```

### Paso 2: Obtener Dependencias
```powershell
flutter pub get
```
**Esperado**: Se descargan todas las dependencias (demora 2-5 minutos en primera instalación)

### Paso 3: Configurar URL de API (Importante)

Editar el archivo: `lib\utils\constants.dart`

**Opción A: Para desarrollo local (Windows/Mac/Linux)**
```dart
static const String apiBaseUrl = 'http://localhost:8000';
```

**Opción B: Para emulador Android**
```dart
static const String apiBaseUrl = 'http://10.0.2.2:8000';
```

**Opción C: Para servidor remoto**
```dart
static const String apiBaseUrl = 'http://cementerio-api.desarrollo-software.xyz';
```

### Paso 4: Ejecutar la Aplicación

**En dispositivo/emulador Android conectado**:
```powershell
flutter run
```

**En Android específicamente**:
```powershell
flutter run -d android
```

**En Chrome (navegador)**:
```powershell
flutter run -d chrome
```

**Modo release (más rápido)**:
```powershell
flutter run --release
```

### Paso 5: Esperar a que Compile

La primera ejecución demora **5-10 minutos**. Verás:
```
Running with sound null safety

Launching lib\main.dart on Android in debug mode...

[ +      2 ms] executing: [C:...\flutter\bin\flutter.bat] app bundle
[ +    300 ms] executing gradle tasks...
...
✓ Built build\app\outputs\flutter-app-debug.apk (XXX MB in XX.XXs).
Installing build\app\outputs\flutter-app\app\app-debug.apk...
```

### Paso 6: ¡Aplicación Abierta!

Se abrirá automáticamente en el emulador/dispositivo.

---

## 🔑 Credenciales de Prueba

Una vez que la app esté abierta en la pantalla de Login:

### Usuario Admin (Acceso Total)
```
Usuario: admin
Contraseña: 1234
```

### Usuario Cliente (Solo Lectura)
```
Usuario: cliente
Contraseña: 1234
```

*Si no existen, créalos primero en la API Django:*
```bash
# En Django
python manage.py createsuperuser
# Username: admin
# Password: 1234
```

---

## 📱 Flujo de Prueba Básica

1. **Pantalla de Login** aparece
2. Ingresa: `admin` / `1234`
3. Presiona "Iniciar Sesión"
4. **HomeScreen** muestra opciones
5. Prueba diferentes secciones:
   - 📍 Parcelas → Ver listado público
   - 👥 Difuntos → Ver registro público
   - ⚙️ Admin Parcelas → Crear/editar/eliminar (solo si eres admin)

---

## 🛠️ Troubleshooting

### Error: "Connection refused"
**Causa**: La API Django no está corriendo  
**Solución**: 
1. Abre terminal
2. Ve a `cementerio_api` carpeta
3. Ejecuta: `python manage.py runserver`
4. Verifica en browser: http://localhost:8000

### Error: "Unable to resolve dependency"
**Causa**: Problemas con dependencias  
**Solución**:
```powershell
flutter clean
flutter pub get
```

### Pantalla en blanco
**Causa**: API URL incorrecta o API caída  
**Solución**:
1. Verifica URL en `constants.dart`
2. Verifica que API esté en `http://localhost:8000` con `flutter run --release`
3. Revisa logs: `flutter run -v`

### El login falla
**Causa**: Credenciales incorrectas o API devuelve error  
**Solución**:
1. Verifica que usuario exista en Django
2. Verifica contraseña correcta
3. Revisa en Django: `python manage.py shell` → `from django.contrib.auth.models import User; User.objects.all()`

### Error: "Flutter not found"
**Causa**: Flutter no está en PATH  
**Solución**:
1. Descarga Flutter desde https://flutter.dev
2. Descomprime en `C:\flutter` (por ejemplo)
3. Agrega a PATH: `C:\flutter\bin`
4. Abre terminal nueva y ejecuta: `flutter doctor`

---

## 📊 Verificar Instalación

Ejecuta `flutter doctor` para verificar todo está correcto:

```powershell
flutter doctor
```

**Resultado esperado**:
```
[✓] Flutter (Channel stable, X.X.X, on Windows 10.0.X)
[✓] Android toolchain
[✓] Chrome
[✓] Android Studio
[!] VS Code (no Dart extension)
[✓] VS Code
[✓] Connected device
```

Si hay ✗, revisa la solución que Flutter sugiere.

---

## 🔄 Ciclo de Desarrollo

### Cambiar Código y Ver Cambios

Flutter tiene **hot reload** - Puedes cambiar código y ver cambios al instante:

1. Edita un archivo (ej: cambiar color en `theme.dart`)
2. Guarda el archivo (Ctrl+S)
3. En la terminal de Flutter, presiona **`r`** para hot reload
4. Los cambios aparecen en el emulador inmediatamente

### Reiniciar Completo (Cold Start)

Si hot reload no funciona:

```powershell
# En terminal con flutter run activo, presiona:
R  # para hot restart
```

O termina con Ctrl+C y ejecuta `flutter run` nuevamente.

---

## 📡 Inspeccionar Red

Para ver qué requests está haciendo la app:

**Opción 1: DevTools**
```powershell
flutter pub global activate devtools
devtools
```

**Opción 2: Habilitar logging en code**

Edita `lib\services\api_service.dart` y descomenta:
```dart
// _dio.interceptors.add(LoggingInterceptor());
```

---

## 🧪 Ejecutar Pruebas

*(Cuando agregues pruebas unitarias)*

```powershell
flutter test
```

---

## 📦 Crear APK para Distribuir

Una vez verificado que funciona:

```powershell
flutter build apk
```

El APK se generará en:
```
build\app\outputs\flutter-app\app-debug.apk
```

Para release:
```powershell
flutter build apk --release
```

Ubicación:
```
build\app\outputs\flutter-app\app-release.apk
```

---

## 📺 Emulador Android (Si no tienes dispositivo)

### Abrir Android Studio y crear emulador

1. Abre Android Studio
2. Tools → AVD Manager
3. Create Virtual Device
4. Elige modelo (ej: Pixel 4)
5. Elige Android version (ej: API 31)
6. Presiona Play ▶️ para iniciar

### O desde terminal

```powershell
# Listar emuladores disponibles
flutter emulators

# Lanzar un emulador
flutter emulators --launch emulator-5554
```

### Luego ejecutar app

```powershell
flutter run
```

---

## 🎯 Checklist de Ejecución

- [ ] Flutter instalado y en PATH
- [ ] API Django corriendo en http://localhost:8000
- [ ] URL de API configurada en `constants.dart`
- [ ] Dependencias descargadas: `flutter pub get`
- [ ] Emulador/dispositivo conectado
- [ ] Ejecutado: `flutter run`
- [ ] App se abre en emulador
- [ ] Login funciona con admin/1234
- [ ] HomeScreen muestra opciones de menú
- [ ] Puede navegar a diferentes pantallas

---

## 🎬 Video de Demostración (Simulado)

```
00:00 - Abrir emulador
00:05 - Ejecutar: flutter run
00:15 - Esperar a que compile
00:45 - App abre en LoginScreen
00:50 - Ingresar usuario: admin
00:55 - Ingresar contraseña: 1234
01:00 - Presionar "Iniciar Sesión"
01:05 - HomeScreen carga
01:10 - Ver menú de opciones
01:15 - Ir a "Parcelas"
01:20 - Ver listado de parcelas
01:25 - Usar buscador
01:30 - Volver a Home
01:35 - Ir a "Admin Parcelas"
01:40 - Ver lista con opciones admin
01:45 - Crear nueva parcela
02:00 - Editar parcela
02:15 - Eliminar parcela
02:30 - Perfil → Cerrar Sesión
02:40 - De vuelta en LoginScreen
```

---

## 🚨 Si Algo Falla

1. **Revisa los logs**
   ```powershell
   flutter run -v
   ```
   Esto muestra todos los detalles

2. **Reporta el error**
   - Screenshot del error
   - Output de `flutter run -v`
   - Output de `flutter doctor`
   - API URL que usas
   - Sistema operativo

3. **Soluciones rápidas**
   ```powershell
   flutter clean          # Limpia caché
   flutter pub get        # Reinstala dependencias
   flutter run --release  # Ejecuta en modo release
   ```

---

## 📞 Soporte

- **Documentación**: Ver `README.md`
- **Inicio rápido**: Ver `QUICKSTART.md`
- **Pruebas**: Ver `TESTING.md`
- **Arquitectura**: Ver `ARCHITECTURE.md`

---

**¡Listo para ejecutar la aplicación! 🚀**

