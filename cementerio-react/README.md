# Cementerio React - Frontend

## Descripción

Aplicación frontend desarrollada en ReactJS que consume la API REST del Sistema de Gestión de Cementerio desarrollada en Django.

## Características

### Sección Pública
- **Página de Inicio**: Presentación del cementerio con servicios destacados
- **Servicios**: Información detallada de los servicios ofrecidos
- **Nosotros**: Historia, misión, visión y equipo
- **Contacto**: Formulario de contacto e información de contacto

### Sección Privada (Admin)
- **Dashboard**: Resumen estadístico del sistema
- **Gestión de Usuarios**: CRUD completo de usuarios (ADMIN, CLIENTE)
- **Gestión de Parcelas**: CRUD de parcelas con estados (DISPONIBLE, RESERVADA, OCUPADA)
- **Gestión de Reservas**: CRUD de reservas con estados (PENDIENTE, CONFIRMADA, CANCELADA)
- **Gestión de Pagos**: CRUD de pagos con métodos y estados
- **Gestión de Difuntos**: CRUD de registros de difuntos

### Seguridad
- **Autenticación**: Login con token (Token Authentication)
- **Rutas Protegidas**: Acceso restringido a sección admin
- **Control de Roles**: Verificación de permisos por rol (ADMIN/CLIENTE)

## Tecnologías Utilizadas

- **React 18**: Biblioteca principal
- **React Router DOM 6**: Enrutamiento y navegación
- **Material UI 5**: Componentes de interfaz
- **Axios**: Cliente HTTP para consumo de API
- **Context API**: Manejo de estado global (autenticación)

## Estructura del Proyecto

```
cementerio-react/
├── public/
├── src/
│   ├── components/
│   │   ├── common/           # Componentes reutilizables
│   │   │   ├── DataTable.js  # Tabla con paginación, búsqueda y ordenamiento
│   │   │   ├── FormDialog.js # Diálogo para formularios
│   │   │   └── ConfirmDialog.js # Diálogo de confirmación
│   │   ├── Layout/
│   │   │   ├── Navbar.js     # Barra de navegación pública
│   │   │   ├── Footer.js     # Pie de página
│   │   │   ├── MainLayout.js # Layout público
│   │   │   └── AdminLayout.js # Layout de administración
│   │   └── ProtectedRoute.js # HOC para proteger rutas
│   ├── config/
│   │   └── api.js            # Configuración de endpoints
│   ├── contexts/
│   │   └── AuthContext.js    # Contexto de autenticación
│   ├── pages/
│   │   ├── admin/            # Páginas de administración
│   │   │   ├── DashboardPage.js
│   │   │   ├── UsuariosPage.js
│   │   │   ├── ParcelasPage.js
│   │   │   ├── ReservasPage.js
│   │   │   ├── PagosPage.js
│   │   │   └── DifuntosPage.js
│   │   ├── auth/             # Páginas de autenticación
│   │   │   ├── LoginPage.js
│   │   │   └── UnauthorizedPage.js
│   │   └── public/           # Páginas públicas
│   │       ├── HomePage.js
│   │       ├── ServiciosPage.js
│   │       ├── NosotrosPage.js
│   │       └── ContactoPage.js
│   ├── services/
│   │   └── apiService.js     # Servicios CRUD para cada entidad
│   ├── App.js                # Componente principal con rutas
│   ├── index.js              # Punto de entrada
│   └── index.css             # Estilos globales
├── .env.example              # Variables de entorno de ejemplo
├── package.json
└── README.md
```

## Instalación

1. **Clonar el repositorio**
```bash
cd cementerio-react
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con la URL de tu API
```

4. **Iniciar en modo desarrollo**
```bash
npm start
```

La aplicación se abrirá en http://localhost:3000

## Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8000
```

### API Backend

Asegúrate de que la API de Django esté corriendo y tenga CORS configurado:

```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

## Uso

### Credenciales de Prueba

- **Usuario**: admin
- **Contraseña**: 1234

### Flujo de Autenticación

1. El usuario ingresa a `/login`
2. Se envía POST a `/api/auth/login/` con credenciales
3. La API responde con token y datos del usuario
4. El token se guarda en localStorage
5. Se configura Axios para enviar el token en cada petición
6. El usuario es redirigido al panel de administración

### Control de Acceso

- **Rutas Públicas**: Accesibles sin autenticación
- **Rutas Admin**: Requieren autenticación y rol ADMIN
- **Redirección**: Usuarios no autenticados son redirigidos a `/login`
- **Acceso Denegado**: Usuarios sin permisos ven página `/unauthorized`

## Endpoints de la API Consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/auth/login/ | Autenticación |
| GET/POST | /api/usuarios/ | Listar/Crear usuarios |
| GET/PUT/DELETE | /api/usuarios/{id}/ | Detalle/Editar/Eliminar usuario |
| GET/POST | /api/parcelas/ | Listar/Crear parcelas |
| GET/PUT/DELETE | /api/parcelas/{id}/ | Detalle/Editar/Eliminar parcela |
| GET/POST | /api/reservas/ | Listar/Crear reservas |
| GET/PUT/DELETE | /api/reservas/{id}/ | Detalle/Editar/Eliminar reserva |
| GET/POST | /api/pagos/ | Listar/Crear pagos |
| GET/PUT/DELETE | /api/pagos/{id}/ | Detalle/Editar/Eliminar pago |
| GET/POST | /api/difuntos/ | Listar/Crear difuntos |
| GET/PUT/DELETE | /api/difuntos/{id}/ | Detalle/Editar/Eliminar difunto |

## Funcionalidades CRUD

Cada módulo de administración incluye:

- ✅ **Listado** con tabla paginada y búsqueda
- ✅ **Ordenamiento** por columnas
- ✅ **Creación** mediante formulario modal
- ✅ **Edición** de registros existentes
- ✅ **Eliminación** con confirmación
- ✅ **Validación** de formularios
- ✅ **Notificaciones** de éxito/error

## Pruebas Funcionales

### Escenarios de Prueba

1. **Login exitoso**: Ingresar con credenciales válidas
2. **Login fallido**: Ingresar con credenciales inválidas
3. **Acceso protegido**: Intentar acceder a /admin sin autenticación
4. **CRUD Usuarios**: Crear, editar, eliminar usuarios
5. **CRUD Parcelas**: Gestionar parcelas con diferentes estados
6. **CRUD Reservas**: Crear reservas vinculando usuarios y parcelas
7. **CRUD Pagos**: Registrar pagos para reservas
8. **CRUD Difuntos**: Registrar difuntos asociados a parcelas
9. **Búsqueda**: Filtrar datos en tablas
10. **Logout**: Cerrar sesión correctamente

## Scripts Disponibles

```bash
npm start       # Inicia servidor de desarrollo
npm build       # Genera build de producción
npm test        # Ejecuta tests
npm run eject   # Expone configuración de webpack
```

## Producción

```bash
npm run build
```

Se genera la carpeta `build/` lista para desplegar en cualquier servidor web.

## Autor

Desarrollado como proyecto académico para consumo de API REST Django.

## Licencia

MIT
