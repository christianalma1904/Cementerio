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

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a472a',
      light: '#2d5a3f',
      dark: '#0f2d1a',
    },
    secondary: {
      main: '#6c757d',
    },
    success: {
      main: '#28a745',
    },
    warning: {
      main: '#ffc107',
    },
    error: {
      main: '#dc3545',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
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
