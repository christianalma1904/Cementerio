# Guía de Pruebas Funcionales - Cementerio App

Documento de pruebas funcionales completas para validar que la aplicación Flutter cumple con todos los requisitos especificados.

## Requisitos Cubiertos

- ✅ Interfaz pública con navegación
- ✅ Autenticación contra API (login)
- ✅ Manejo de sesión con token
- ✅ Pantallas privadas protegidas por autenticación
- ✅ Control de acceso por roles (ADMIN, CLIENTE)
- ✅ CRUD completo de recursos
- ✅ Búsqueda y filtrado
- ✅ Interfaz amigable para móvil

---

## GRUPO 1: Autenticación y Control de Sesión

### TC-001: Login Válido
**Objetivo**: Verificar que el usuario pueda iniciar sesión con credenciales correctas

**Pasos**:
1. Abrir la aplicación
2. Aparece pantalla de Login
3. Ingresar usuario: `admin`
4. Ingresar contraseña: `1234`
5. Presionar botón "Iniciar Sesión"

**Resultado Esperado**:
- ✅ El botón muestra animación de carga
- ✅ Se realiza POST a `/api/auth/login/`
- ✅ Recibe token en la respuesta
- ✅ Token se guarda en SharedPreferences
- ✅ Redirige automáticamente a HomeScreen
- ✅ El usuario ve su nombre en el header

---

### TC-002: Login Inválido
**Objetivo**: Verificar manejo de credenciales incorrectas

**Pasos**:
1. Abrir la aplicación
2. Ingresar usuario: `admin`
3. Ingresar contraseña: `incorrecta`
4. Presionar "Iniciar Sesión"

**Resultado Esperado**:
- ✅ Intenta POST a `/api/auth/login/`
- ✅ API devuelve error 401 o 400
- ✅ Muestra mensaje de error en la UI
- ✅ Permanece en pantalla de login
- ✅ El campo de contraseña se mantiene enfocado para reintentar

---

### TC-003: Validación de Campos Vacíos
**Objetivo**: Verificar validación de campos requeridos

**Pasos**:
1. Abrir la aplicación
2. Dejar campos vacíos
3. Presionar "Iniciar Sesión"

**Resultado Esperado**:
- ✅ No realiza request a API
- ✅ Muestra mensajes de error debajo de cada campo
- ✅ Los mensajes indican qué campo es requerido

---

### TC-004: Persistencia de Sesión
**Objetivo**: Verificar que la sesión se mantiene después de cerrar la app

**Pasos**:
1. Inicia sesión correctamente
2. Cierra la aplicación completamente
3. Reabre la aplicación

**Resultado Esperado**:
- ✅ La aplicación abre directamente en HomeScreen
- ✅ No pide login nuevamente
- ✅ El token se mantiene válido
- ✅ Puede consumir APIs protegidas sin problema

---

### TC-005: Logout
**Objetivo**: Verificar que el logout limpia la sesión correctamente

**Pasos**:
1. Iniciar sesión
2. Presionar ícono de perfil (arriba a la derecha)
3. Seleccionar "Cerrar Sesión"

**Resultado Esperado**:
- ✅ Se abre modal con opciones
- ✅ Opción de "Cerrar Sesión" es visible
- ✅ Presionar "Cerrar Sesión"
- ✅ Se limpian credenciales de SharedPreferences
- ✅ Redirige a LoginScreen
- ✅ Solicita credenciales de nuevo para acceder

---

## GRUPO 2: Autenticación - Validaciones

### TC-006: Campo Usuario Requerido
**Pasos**: En login, dejar vacío "Usuario" y llenar contraseña, presionar "Iniciar Sesión"

**Resultado Esperado**: ✅ Muestra error "El usuario es requerido"

---

### TC-007: Campo Contraseña Requerido
**Pasos**: En login, dejar vacío "Contraseña" y llenar usuario, presionar "Iniciar Sesión"

**Resultado Esperado**: ✅ Muestra error "La contraseña es requerida"

---

### TC-008: Contraseña Mínima
**Pasos**: Ingresar usuario válido y contraseña con menos de 4 caracteres

**Resultado Esperado**: ✅ Muestra error "La contraseña debe tener al menos 4 caracteres"

---

### TC-009: Mostrar/Ocultar Contraseña
**Pasos**: 
1. Ingresar contraseña
2. Presionar ícono de ojo para mostrar/ocultar

**Resultado Esperado**: ✅ La contraseña alterna entre visible y oculta

---

## GRUPO 3: Interfaz Pública - Parcelas

### TC-010: Listar Parcelas Disponibles
**Objetivo**: Verificar que se cargan y muestran las parcelas

**Pasos**:
1. En HomeScreen, presionar "Parcelas"
2. Esperar a que cargue

**Resultado Esperado**:
- ✅ Se realiza GET a `/api/parcelas/`
- ✅ Se muestran todas las parcelas disponibles
- ✅ Cada parcela muestra: ID, ubicación, tamaño, precio, estado
- ✅ El estado se muestra con color: verde (disponible), naranja (reservada)
- ✅ Los precios están formateados con símbolo $ y 2 decimales

---

### TC-011: Búsqueda de Parcelas
**Pasos**:
1. En pantalla de Parcelas, usar campo de búsqueda
2. Escribir una ubicación existente (ej: "A1")
3. Ver resultados
4. Borrar búsqueda

**Resultado Esperado**:
- ✅ Se realiza GET con parámetro `search=A1`
- ✅ Los resultados se filtran en tiempo real
- ✅ Solo muestra parcelas que coincidan con la búsqueda
- ✅ Limpiar búsqueda recarga todas las parcelas

---

### TC-012: Paginación de Parcelas
**Objetivo**: Verificar que funciona la paginación (10 parcelas por página)

**Pasos**:
1. Ver la lista de parcelas
2. Si hay más de 10, implementar scroll para siguiente página

**Resultado Esperado**:
- ✅ Primer request: `/api/parcelas/?page=1`
- ✅ Si hay más, permite cargar página 2: `/api/parcelas/?page=2`
- ✅ Los items se cargan en bloques de 10

---

### TC-013: Estados de Parcela
**Objetivo**: Verificar que se muestran correctamente los estados

**Pasos**:
1. Ver lista de parcelas
2. Observar los iconos y colores de estado

**Resultado Esperado**:
- ✅ DISPONIBLE: ✓ verde
- ✅ RESERVADA: ⚠ naranja
- ✅ OCUPADA: ✗ rojo

---

## GRUPO 4: Interfaz Pública - Difuntos

### TC-014: Listar Difuntos
**Objetivo**: Verificar que se cargan los registros de difuntos

**Pasos**:
1. En HomeScreen, presionar "Difuntos"
2. Esperar a que cargue

**Resultado Esperado**:
- ✅ GET a `/api/difuntos/`
- ✅ Se muestran todos los difuntos registrados
- ✅ Cada registro muestra: nombre completo, fecha nacimiento, fecha fallecimiento, ubicación

---

### TC-015: Búsqueda de Difuntos
**Pasos**:
1. En pantalla de Difuntos, escribir un nombre
2. Ver resultados filtrados

**Resultado Esperado**:
- ✅ GET con parámetro `search=nombre`
- ✅ Filtra por nombre en tiempo real
- ✅ Limpia búsqueda recarga todo

---

## GRUPO 5: Control de Acceso por Roles

### TC-016: Panel Admin Visible para ADMIN
**Objetivo**: Verificar que usuarios ADMIN ven opciones administrativas

**Pasos**:
1. Iniciar sesión con usuario ADMIN
2. Ir a HomeScreen

**Resultado Esperado**:
- ✅ Se muestra badge "ADMINISTRADOR"
- ✅ Aparecen opciones: "Admin Parcelas", "Admin Reservas", "Admin Difuntos"
- ✅ Las opciones públicas también están disponibles

---

### TC-017: Panel Admin Oculto para CLIENTE
**Objetivo**: Verificar que usuarios cliente NO ven opciones admin

**Pasos**:
1. Iniciar sesión con usuario CLIENTE (no ADMIN)
2. Ir a HomeScreen

**Resultado Esperado**:
- ✅ NO aparece badge "ADMINISTRADOR"
- ✅ Opciones Admin están ocultas
- ✅ Solo ve opciones públicas: Parcelas, Difuntos

---

### TC-018: Acceso Denegado a Ruta Admin
**Objetivo**: Verificar protección de rutas admin

**Pasos**:
1. Iniciar sesión como CLIENTE
2. Intentar acceder a `/admin-parcelas` (por URL o navegación indirecta)

**Resultado Esperado**:
- ✅ Muestra pantalla "Acceso Restringido"
- ✅ Mensaje: "Solo administradores pueden acceder"
- ✅ Botón para volver atrás

---

### TC-019: Acceso Denegado Sin Autenticación
**Pasos**:
1. Cerrar sesión
2. Intentar acceder a cualquier pantalla protegida

**Resultado Esperado**:
- ✅ Redirige a LoginScreen
- ✅ O muestra pantalla "No autorizado"

---

## GRUPO 6: Panel Admin - CRUD Parcelas

### TC-020: Listar Parcelas (Admin)
**Pasos**:
1. Iniciar sesión como ADMIN
2. Ir a "Admin Parcelas"

**Resultado Esperado**:
- ✅ GET a `/api/parcelas/`
- ✅ Muestra todas las parcelas en una lista
- ✅ Cada una tiene botones de Editar y Eliminar

---

### TC-021: Crear Nueva Parcela
**Pasos**:
1. En "Admin Parcelas", presionar botón + (FAB)
2. Completa el formulario:
   - Ubicación: "A5"
   - Tamaño: "2x2"
   - Precio: "500.00"
   - Estado: "DISPONIBLE"
3. Presionar "Guardar"

**Resultado Esperado**:
- ✅ Se abre modal con formulario
- ✅ POST a `/api/parcelas/` con los datos
- ✅ Parcela aparece en la lista
- ✅ Muestra notificación "Parcela creada"
- ✅ Modal se cierra automáticamente

---

### TC-022: Editar Parcela
**Pasos**:
1. En lista de parcelas, presionar ícono de editar
2. Cambiar datos (ej: ubicación a "A6")
3. Presionar "Guardar"

**Resultado Esperado**:
- ✅ Se abre modal con formulario lleno
- ✅ PUT a `/api/parcelas/{id}/` con datos actualizados
- ✅ Lista se actualiza inmediatamente
- ✅ Muestra notificación "Parcela actualizada"

---

### TC-023: Eliminar Parcela
**Pasos**:
1. En lista de parcelas, presionar ícono de eliminar (X roja)
2. Confirmar en dialog

**Resultado Esperado**:
- ✅ Muestra dialog: "¿Está seguro que desea eliminar?"
- ✅ DELETE a `/api/parcelas/{id}/`
- ✅ Parcela se elimina de la lista
- ✅ Muestra notificación "Parcela eliminada"

---

### TC-024: Validaciones en Formulario Parcela
**Pasos**:
1. Abrir formulario de crear parcela
2. Dejar campos vacíos y presionar "Guardar"

**Resultado Esperado**:
- ✅ No realiza request
- ✅ Campos se marcan como requeridos
- ✅ Muestra mensajes de error

---

## GRUPO 7: Panel Admin - Gestión de Reservas

### TC-025: Listar Reservas
**Pasos**:
1. Como ADMIN, ir a "Admin Reservas"

**Resultado Esperado**:
- ✅ GET a `/api/reservas/`
- ✅ Muestra todas las reservas
- ✅ Cada una indica: usuario, parcela, fecha, estado

---

### TC-026: Filtrar Reservas por Estado
**Pasos**:
1. En "Admin Reservas", usar búsqueda
2. Buscar por estado o usuario

**Resultado Esperado**:
- ✅ Filtra reservas en tiempo real
- ✅ GET con parámetro search

---

### TC-027: Eliminar Reserva
**Pasos**:
1. En lista de reservas, presionar eliminar
2. Confirmar

**Resultado Esperado**:
- ✅ DELETE a `/api/reservas/{id}/`
- ✅ Reserva se elimina
- ✅ Notificación de éxito

---

## GRUPO 8: Panel Admin - Gestión de Difuntos

### TC-028: Listar Difuntos (Admin)
**Pasos**:
1. Como ADMIN, ir a "Admin Difuntos"

**Resultado Esperado**:
- ✅ GET a `/api/difuntos/`
- ✅ Muestra todos los difuntos
- ✅ Cada uno tiene botones Editar y Eliminar

---

### TC-029: Crear Difunto
**Pasos**:
1. Presionar +
2. Completar formulario:
   - Nombre: "Juan"
   - Apellido: "Pérez"
   - Fecha Nacimiento: "1950-01-15"
   - Fecha Fallecimiento: "2023-12-20"
   - Notas: "Residente del sector A"
3. Guardar

**Resultado Esperado**:
- ✅ POST a `/api/difuntos/` con datos
- ✅ Aparece en la lista
- ✅ Notificación "Difunto creado"

---

### TC-030: Editar Difunto
**Pasos**:
1. Presionar editar en un difunto
2. Cambiar datos
3. Guardar

**Resultado Esperado**:
- ✅ PUT a `/api/difuntos/{id}/`
- ✅ Se actualiza en la lista
- ✅ Notificación "Difunto actualizado"

---

### TC-031: Eliminar Difunto
**Pasos**:
1. Presionar eliminar
2. Confirmar

**Resultado Esperado**:
- ✅ DELETE a `/api/difuntos/{id}/`
- ✅ Se elimina de la lista
- ✅ Notificación "Difunto eliminado"

---

## GRUPO 9: Manejo de Errores

### TC-032: Error de Conexión
**Pasos**:
1. Desconectar Wi-Fi/Datos
2. Intentar cargar datos desde cualquier pantalla

**Resultado Esperado**:
- ✅ Muestra pantalla de error
- ✅ Mensaje descriptivo (sin mostrar stack trace)
- ✅ Botón "Reintentar"
- ✅ Reconectar y reintentar carga correctamente

---

### TC-033: Timeout de API
**Pasos**:
1. Hacer request a API lenta/timeout
2. Esperar a que expire el timeout (30s)

**Resultado Esperado**:
- ✅ Muestra error después de timeout
- ✅ Opción de reintentar
- ✅ No congela la UI

---

### TC-034: Error 404 (Recurso no encontrado)
**Pasos**:
1. Intentar editar/ver un recurso eliminado por otro usuario
2. Aparece error 404

**Resultado Esperado**:
- ✅ Muestra mensaje "Recurso no encontrado"
- ✅ Recarga la lista (removiendo el recurso)

---

### TC-035: Error 403 (Prohibido)
**Pasos**:
1. Intenta eliminar recurso sin permisos

**Resultado Esperado**:
- ✅ Muestra "No tiene permisos para esta acción"

---

## GRUPO 10: UX y Performance

### TC-036: Carga de Datos
**Pasos**:
1. Abrir cualquier lista
2. Observar indicador de carga

**Resultado Esperado**:
- ✅ Muestra CircularProgressIndicator mientras carga
- ✅ No permite interacción hasta que cargue
- ✅ Transición suave cuando termina

---

### TC-037: Búsqueda Responsive
**Pasos**:
1. Escribir en campo de búsqueda
2. Escribir rápidamente varios caracteres

**Resultado Esperado**:
- ✅ Filtra sin lag o demoras perceptibles
- ✅ Los resultados se actualizan suavemente
- ✅ No realiza múltiples requests simultáneamente

---

### TC-038: Responsive Design
**Pasos**:
1. Usar aplicación en diferentes orientaciones (portrait, landscape)
2. Rotar dispositivo

**Resultado Esperado**:
- ✅ Interfaz se adapta correctamente
- ✅ No hay elementos cortados
- ✅ Mantiene contexto de la pantalla

---

### TC-039: Notificaciones SnackBar
**Pasos**:
1. Realizar acciones (crear, editar, eliminar)
2. Observar notificaciones

**Resultado Esperado**:
- ✅ Muestra SnackBar con mensaje de éxito
- ✅ Auto-desaparece después de 3-4 segundos
- ✅ No obstruye navegación

---

## GRUPO 11: Navegación

### TC-040: Navegación entre Pantallas
**Pasos**:
1. Desde HomeScreen, ir a diferentes secciones
2. Usar botón atrás

**Resultado Esperado**:
- ✅ Las transiciones son fluidas
- ✅ El botón atrás funciona
- ✅ Se mantiene el scroll position

---

### TC-041: Menu de Perfil
**Pasos**:
1. Presionar ícono de perfil (arriba derecha)
2. Ver opciones

**Resultado Esperado**:
- ✅ Abre BottomSheet con opciones
- ✅ Opciones: Perfil, Cerrar Sesión
- ✅ Al seleccionar "Cerrar Sesión" funciona correctamente

---

## Resumen de Pruebas

Total de casos de prueba: **41**

| Categoría | Casos | Estado |
|-----------|-------|--------|
| Autenticación | 9 | ✅ |
| Interfaz Pública | 5 | ✅ |
| Control de Acceso | 4 | ✅ |
| CRUD Parcelas | 5 | ✅ |
| CRUD Reservas | 3 | ✅ |
| CRUD Difuntos | 4 | ✅ |
| Manejo Errores | 4 | ✅ |
| UX/Performance | 4 | ✅ |
| Navegación | 2 | ✅ |

---

**Documento Versión**: 1.0  
**Fecha**: Enero 2026  
**Probado en**: Flutter 3.0+, Android 10+, iOS 14+

