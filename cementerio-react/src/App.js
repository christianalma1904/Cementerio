import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Contextos
import { AuthProvider } from './contexts/AuthContext';

// Componentes
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './components/Layout/MainLayout';
import AdminLayout from './components/Layout/AdminLayout';
import ClienteLayout from './components/Layout/ClienteLayout';

// Páginas públicas
import HomePage from './pages/public/HomePage';
import ServiciosPage from './pages/public/ServiciosPage';
import NosotrosPage from './pages/public/NosotrosPage';
import ContactoPage from './pages/public/ContactoPage';

// Páginas de autenticación
import LoginPage from './pages/auth/LoginPage';
import UnauthorizedPage from './pages/auth/UnauthorizedPage';

// Páginas de administración
import DashboardPage from './pages/admin/DashboardPage';
import UsuariosPage from './pages/admin/UsuariosPage';
import ParcelasPage from './pages/admin/ParcelasPage';
import ReservasPage from './pages/admin/ReservasPage';
import PagosPage from './pages/admin/PagosPage';
import DifuntosPage from './pages/admin/DifuntosPage';
import CuentasPage from './pages/admin/CuentasPage';

// Páginas de cliente
import ClienteDashboard from './pages/cliente/ClienteDashboard';
import MisReservas from './pages/cliente/MisReservas';
import MisPagos from './pages/cliente/MisPagos';
import MiPerfil from './pages/cliente/MiPerfil';

// Tema personalizado - Diseño moderno y elegante
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0d9488', // Teal elegante
      light: '#14b8a6',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1', // Indigo moderno
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      letterSpacing: '0.025em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
          border: '1px solid #e2e8f0',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        },
        elevation3: {
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(13, 148, 136, 0.15)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '4px 8px',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rutas públicas con layout principal */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/servicios" element={<ServiciosPage />} />
              <Route path="/nosotros" element={<NosotrosPage />} />
              <Route path="/contacto" element={<ContactoPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* Rutas protegidas de administración */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRoles={['ADMIN']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="usuarios" element={<UsuariosPage />} />
              <Route path="cuentas" element={<CuentasPage />} />
              <Route path="parcelas" element={<ParcelasPage />} />
              <Route path="reservas" element={<ReservasPage />} />
              <Route path="pagos" element={<PagosPage />} />
              <Route path="difuntos" element={<DifuntosPage />} />
              <Route path="perfil" element={<MiPerfil />} />
            </Route>

            {/* Rutas protegidas de cliente */}
            <Route
              path="/cliente"
              element={
                <ProtectedRoute requiredRoles={['CLIENTE', 'ADMIN']}>
                  <ClienteLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ClienteDashboard />} />
              <Route path="reservas" element={<MisReservas />} />
              <Route path="pagos" element={<MisPagos />} />
              <Route path="perfil" element={<MiPerfil />} />
            </Route>

            {/* Ruta 404 */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <div style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h1>404 - Página no encontrada</h1>
                    <p>La página que busca no existe.</p>
                  </div>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
