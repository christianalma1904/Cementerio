import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import {
  EventNote as EventIcon,
  Payment as PaymentIcon,
  CheckCircle,
  HourglassEmpty,
  Cancel,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { reservaService, pagoService } from '../../services/apiService';

const ClienteDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    reservas: [],
    pagos: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reservasData, pagosData] = await Promise.all([
          reservaService.getAll(),
          pagoService.getAll(),
        ]);

        // Filtrar por usuario actual (simulado - en producción la API debería filtrar)
        const reservas = Array.isArray(reservasData) ? reservasData : reservasData.results || [];
        const pagos = Array.isArray(pagosData) ? pagosData : pagosData.results || [];

        setStats({ reservas, pagos });
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const reservasPendientes = stats.reservas.filter(r => r.estado === 'PENDIENTE').length;
  const reservasConfirmadas = stats.reservas.filter(r => r.estado === 'CONFIRMADA').length;
  const pagosPendientes = stats.pagos.filter(p => p.estado_pago === 'PENDIENTE').length;
  const pagosCompletados = stats.pagos.filter(p => p.estado_pago === 'PAGADO').length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        ¡Bienvenido, {user?.username}!
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Este es tu panel personal donde puedes gestionar tus reservas y pagos.
      </Typography>

      {/* Resumen de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <EventIcon color="primary" />
                <Typography variant="h6">Reservas</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" color="primary">
                {stats.reservas.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total de reservas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3e0', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <HourglassEmpty sx={{ color: '#ff9800' }} />
                <Typography variant="h6">Pendientes</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#ff9800' }}>
                {reservasPendientes}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reservas por confirmar
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircle sx={{ color: '#4caf50' }} />
                <Typography variant="h6">Confirmadas</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#4caf50' }}>
                {reservasConfirmadas}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reservas confirmadas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fce4ec', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PaymentIcon sx={{ color: '#e91e63' }} />
                <Typography variant="h6">Pagos</Typography>
              </Box>
              <Typography variant="h3" fontWeight="bold" sx={{ color: '#e91e63' }}>
                {stats.pagos.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pagosPendientes} pendientes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Últimas reservas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Últimas Reservas</Typography>
                <Button component={Link} to="/cliente/reservas" size="small">
                  Ver todas
                </Button>
              </Box>
              {stats.reservas.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  No tienes reservas aún
                </Typography>
              ) : (
                stats.reservas.slice(0, 5).map((reserva) => (
                  <Box
                    key={reserva.id_reserva}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid #eee',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Reserva #{reserva.id_reserva}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(reserva.fecha_reserva).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={reserva.estado}
                      size="small"
                      color={
                        reserva.estado === 'CONFIRMADA' ? 'success' :
                        reserva.estado === 'PENDIENTE' ? 'warning' : 'error'
                      }
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Últimos Pagos</Typography>
                <Button component={Link} to="/cliente/pagos" size="small">
                  Ver todos
                </Button>
              </Box>
              {stats.pagos.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  No tienes pagos registrados
                </Typography>
              ) : (
                stats.pagos.slice(0, 5).map((pago) => (
                  <Box
                    key={pago.id_pago}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      borderBottom: '1px solid #eee',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        ${parseFloat(pago.monto).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(pago.fecha_pago).toLocaleDateString()} - {pago.metodo_pago}
                      </Typography>
                    </Box>
                    <Chip
                      label={pago.estado_pago}
                      size="small"
                      color={
                        pago.estado_pago === 'PAGADO' ? 'success' :
                        pago.estado_pago === 'PENDIENTE' ? 'warning' : 'error'
                      }
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Acciones rápidas */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Acciones Rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Button
                component={Link}
                to="/cliente/reservas"
                variant="outlined"
                fullWidth
                startIcon={<EventIcon />}
                sx={{ py: 2 }}
              >
                Ver Mis Reservas
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                component={Link}
                to="/cliente/pagos"
                variant="outlined"
                fullWidth
                startIcon={<PaymentIcon />}
                sx={{ py: 2 }}
              >
                Ver Mis Pagos
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                component={Link}
                to="/contacto"
                variant="outlined"
                fullWidth
                sx={{ py: 2 }}
              >
                Contactar Soporte
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClienteDashboard;
