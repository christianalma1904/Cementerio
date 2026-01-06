import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Avatar,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  EventNote as EventIcon,
  Payment as PaymentIcon,
  CheckCircle,
  HourglassEmpty,
  TrendingUp,
  ArrowForward,
  CalendarMonth,
  Receipt,
  Visibility,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { reservaService, pagoService } from '../../services/apiService';

const ClienteDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    reservas: [],
    pagos: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reservasData, pagosData] = await Promise.all([
          reservaService.getAll(),
          pagoService.getAll(),
        ]);
        
        setStats({
          reservas: reservasData.results || reservasData || [],
          pagos: pagosData.results || pagosData || [],
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#0d9488' }} />
      </Box>
    );
  }

  const reservasPendientes = stats.reservas.filter(r => r.estado === 'PENDIENTE').length;
  const reservasConfirmadas = stats.reservas.filter(r => r.estado === 'CONFIRMADA').length;
  const pagosPendientes = stats.pagos.filter(p => p.estado_pago === 'PENDIENTE').length;
  const pagosCompletados = stats.pagos.filter(p => p.estado_pago === 'PAGADO').length;
  const totalPagado = stats.pagos
    .filter(p => p.estado_pago === 'PAGADO')
    .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);

  const statCards = [
    {
      title: 'Total Reservas',
      value: stats.reservas.length,
      subtitle: `${reservasConfirmadas} confirmadas`,
      icon: <EventIcon />,
      gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      bgLight: 'rgba(13, 148, 136, 0.1)',
    },
    {
      title: 'Pendientes',
      value: reservasPendientes,
      subtitle: 'Por confirmar',
      icon: <HourglassEmpty />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      bgLight: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Pagos Realizados',
      value: pagosCompletados,
      subtitle: `$${totalPagado.toFixed(2)} total`,
      icon: <CheckCircle />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      bgLight: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Por Pagar',
      value: pagosPendientes,
      subtitle: 'Pagos pendientes',
      icon: <PaymentIcon />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      bgLight: 'rgba(99, 102, 241, 0.1)',
    },
  ];

  return (
    <Box className="animate-fade-in">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ¡Bienvenido, {user?.username}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí tienes un resumen de tu actividad reciente
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: stat.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <TrendingUp sx={{ color: '#10b981', fontSize: 20 }} />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {stat.title}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                  {stat.subtitle}
                </Typography>
              </CardContent>
              {/* Decorative gradient line */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: stat.gradient,
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Últimas Reservas */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'rgba(13, 148, 136, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalendarMonth sx={{ color: '#0d9488' }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Últimas Reservas
                  </Typography>
                </Box>
                <Button 
                  component={Link} 
                  to="/cliente/reservas" 
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{ color: '#0d9488' }}
                >
                  Ver todas
                </Button>
              </Box>
              
              <Box sx={{ p: 2 }}>
                {stats.reservas.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <EventIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography color="text.secondary">
                      No tienes reservas aún
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    {stats.reservas.slice(0, 4).map((reserva) => (
                      <Box
                        key={reserva.id_reserva}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#f8fafc',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#f1f5f9',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: reserva.estado === 'CONFIRMADA' 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : 'rgba(245, 158, 11, 0.1)',
                              color: reserva.estado === 'CONFIRMADA' 
                                ? '#10b981' 
                                : '#f59e0b',
                            }}
                          >
                            <EventIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              Reserva #{reserva.id_reserva}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={reserva.estado}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: reserva.estado === 'CONFIRMADA' 
                              ? 'rgba(16, 185, 129, 0.1)' 
                              : reserva.estado === 'PENDIENTE'
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'rgba(239, 68, 68, 0.1)',
                            color: reserva.estado === 'CONFIRMADA' 
                              ? '#10b981' 
                              : reserva.estado === 'PENDIENTE'
                              ? '#f59e0b'
                              : '#ef4444',
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Últimos Pagos */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Receipt sx={{ color: '#6366f1' }} />
                  </Box>
                  <Typography variant="h6" fontWeight={600}>
                    Últimos Pagos
                  </Typography>
                </Box>
                <Button 
                  component={Link} 
                  to="/cliente/pagos" 
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{ color: '#6366f1' }}
                >
                  Ver todos
                </Button>
              </Box>
              
              <Box sx={{ p: 2 }}>
                {stats.pagos.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <PaymentIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
                    <Typography color="text.secondary">
                      No tienes pagos registrados
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={1}>
                    {stats.pagos.slice(0, 4).map((pago) => (
                      <Box
                        key={pago.id_pago}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          bgcolor: '#f8fafc',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            bgcolor: '#f1f5f9',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: pago.estado_pago === 'PAGADO' 
                                ? 'rgba(16, 185, 129, 0.1)' 
                                : 'rgba(245, 158, 11, 0.1)',
                              color: pago.estado_pago === 'PAGADO' 
                                ? '#10b981' 
                                : '#f59e0b',
                            }}
                          >
                            <PaymentIcon fontSize="small" />
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>
                              ${parseFloat(pago.monto).toFixed(2)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {pago.metodo_pago} • {new Date(pago.fecha_pago).toLocaleDateString('es-ES')}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip
                          label={pago.estado_pago}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: pago.estado_pago === 'PAGADO' 
                              ? 'rgba(16, 185, 129, 0.1)' 
                              : 'rgba(245, 158, 11, 0.1)',
                            color: pago.estado_pago === 'PAGADO' 
                              ? '#10b981' 
                              : '#f59e0b',
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mt: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Acciones Rápidas
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Button
                component={Link}
                to="/cliente/reservas"
                fullWidth
                variant="outlined"
                startIcon={<EventIcon />}
                sx={{
                  py: 2,
                  borderColor: '#e2e8f0',
                  color: '#1e293b',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    borderColor: '#0d9488',
                    bgcolor: 'rgba(13, 148, 136, 0.05)',
                  },
                }}
              >
                Ver Mis Reservas
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Button
                component={Link}
                to="/cliente/pagos"
                fullWidth
                variant="outlined"
                startIcon={<PaymentIcon />}
                sx={{
                  py: 2,
                  borderColor: '#e2e8f0',
                  color: '#1e293b',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    borderColor: '#6366f1',
                    bgcolor: 'rgba(99, 102, 241, 0.05)',
                  },
                }}
              >
                Ver Mis Pagos
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Button
                component={Link}
                to="/contacto"
                fullWidth
                variant="outlined"
                sx={{
                  py: 2,
                  borderColor: '#e2e8f0',
                  color: '#1e293b',
                  justifyContent: 'flex-start',
                  '&:hover': {
                    borderColor: '#f59e0b',
                    bgcolor: 'rgba(245, 158, 11, 0.05)',
                  },
                }}
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
