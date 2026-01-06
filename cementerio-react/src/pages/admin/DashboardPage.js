import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  GridOn as GridIcon,
  EventNote as EventIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  TrendingUp,
  TrendingDown,
  MoreVert,
  AttachMoney,
  CheckCircle,
  Schedule,
  ArrowUpward,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  usuarioService,
  parcelaService,
  reservaService,
  pagoService,
  difuntoService,
} from '../../services/apiService';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState({
    parcelas: [],
    reservas: [],
    pagos: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usuarios, parcelas, reservas, pagos, difuntos] = await Promise.all([
          usuarioService.getAll(),
          parcelaService.getAll(),
          reservaService.getAll(),
          pagoService.getAll(),
          difuntoService.getAll(),
        ]);

        const parcelasArray = Array.isArray(parcelas) ? parcelas : parcelas.results || [];
        const reservasArray = Array.isArray(reservas) ? reservas : reservas.results || [];
        const pagosArray = Array.isArray(pagos) ? pagos : pagos.results || [];

        setRawData({
          parcelas: parcelasArray,
          reservas: reservasArray,
          pagos: pagosArray,
        });

        setStats({
          usuarios: Array.isArray(usuarios) ? usuarios.length : usuarios.results?.length || 0,
          parcelas: {
            total: parcelasArray.length,
            disponibles: parcelasArray.filter(p => p.estado === 'DISPONIBLE').length,
            ocupadas: parcelasArray.filter(p => p.estado === 'OCUPADA').length,
            reservadas: parcelasArray.filter(p => p.estado === 'RESERVADA').length,
          },
          reservas: {
            total: reservasArray.length,
            pendientes: reservasArray.filter(r => r.estado === 'PENDIENTE').length,
            confirmadas: reservasArray.filter(r => r.estado === 'CONFIRMADA').length,
            canceladas: reservasArray.filter(r => r.estado === 'CANCELADA').length,
          },
          pagos: {
            total: pagosArray.length,
            pendientes: pagosArray.filter(p => p.estado_pago === 'PENDIENTE').length,
            pagados: pagosArray.filter(p => p.estado_pago === 'PAGADO').length,
            totalMonto: pagosArray.reduce((sum, p) => sum + parseFloat(p.monto || 0), 0),
            montoPagado: pagosArray
              .filter(p => p.estado_pago === 'PAGADO')
              .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0),
          },
          difuntos: Array.isArray(difuntos) ? difuntos.length : difuntos.results?.length || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Error al cargar las estadísticas. Verifique que la API esté funcionando.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>;
  }

  // Datos para gráficos con colores modernos
  const parcelasChartData = [
    { name: 'Disponibles', value: stats?.parcelas.disponibles || 0, color: '#10b981' },
    { name: 'Ocupadas', value: stats?.parcelas.ocupadas || 0, color: '#ef4444' },
    { name: 'Reservadas', value: stats?.parcelas.reservadas || 0, color: '#f59e0b' },
  ];

  const reservasChartData = [
    { name: 'Pendientes', value: stats?.reservas.pendientes || 0, color: '#f59e0b' },
    { name: 'Confirmadas', value: stats?.reservas.confirmadas || 0, color: '#10b981' },
    { name: 'Canceladas', value: stats?.reservas.canceladas || 0, color: '#ef4444' },
  ];

  const metodosPago = rawData.pagos.reduce((acc, pago) => {
    const metodo = pago.metodo_pago || 'Otro';
    if (!acc[metodo]) acc[metodo] = 0;
    acc[metodo] += parseFloat(pago.monto || 0);
    return acc;
  }, {});

  const metodosPagoData = Object.entries(metodosPago).map(([name, value]) => ({
    name,
    monto: value,
  }));

  const statCards = [
    {
      title: 'Usuarios',
      value: stats?.usuarios || 0,
      icon: <PeopleIcon />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
      subtitle: 'Usuarios registrados',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Parcelas',
      value: stats?.parcelas.total || 0,
      icon: <GridIcon />,
      gradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
      subtitle: `${stats?.parcelas.disponibles || 0} disponibles`,
      trend: `${stats?.parcelas.disponibles || 0} libres`,
      trendUp: true,
    },
    {
      title: 'Reservas',
      value: stats?.reservas.total || 0,
      icon: <EventIcon />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      subtitle: `${stats?.reservas.pendientes || 0} pendientes`,
      trend: `${stats?.reservas.confirmadas || 0} confirmadas`,
      trendUp: true,
    },
    {
      title: 'Pagos',
      value: stats?.pagos.total || 0,
      icon: <PaymentIcon />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
      subtitle: `$${stats?.pagos.montoPagado?.toFixed(0) || '0'} recaudado`,
      trend: `${stats?.pagos.pagados || 0} pagados`,
      trendUp: true,
    },
    {
      title: 'Difuntos',
      value: stats?.difuntos || 0,
      icon: <PersonIcon />,
      gradient: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
      subtitle: 'Registros totales',
      trend: 'Total',
      trendUp: true,
    },
  ];

  const pendienteCobro = (stats?.pagos.totalMonto || 0) - (stats?.pagos.montoPagado || 0);
  const porcentajeCobrado = stats?.pagos.totalMonto > 0 
    ? (stats?.pagos.montoPagado / stats?.pagos.totalMonto) * 100 
    : 0;

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
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Resumen general del sistema de administración
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      background: card.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Tooltip title="Más opciones">
                    <IconButton size="small" sx={{ opacity: 0.5 }}>
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {card.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {card.trendUp ? (
                    <ArrowUpward sx={{ fontSize: 14, color: '#10b981' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 14, color: '#ef4444' }} />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {card.subtitle}
                  </Typography>
                </Box>
              </CardContent>
              <Box sx={{ height: 4, background: card.gradient }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Financial Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    <TrendingUp />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Resumen Financiero
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Estado actual de ingresos
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <AttachMoney sx={{ color: '#6366f1' }} />
                      <Typography variant="body2" color="text.secondary">
                        Total Facturado
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#6366f1' }}>
                      ${stats?.pagos.totalMonto?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CheckCircle sx={{ color: '#10b981' }} />
                      <Typography variant="body2" color="text.secondary">
                        Total Cobrado
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#10b981' }}>
                      ${stats?.pagos.montoPagado?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Box 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      bgcolor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Schedule sx={{ color: '#f59e0b' }} />
                      <Typography variant="body2" color="text.secondary">
                        Pendiente de Cobro
                      </Typography>
                    </Box>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#f59e0b' }}>
                      ${pendienteCobro.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Progress Bar */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Porcentaje cobrado
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="#10b981">
                    {porcentajeCobrado.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={porcentajeCobrado}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: 'rgba(16, 185, 129, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 5,
                      background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Estado Rápido
              </Typography>
              
              <Stack spacing={2}>
                {[
                  { 
                    label: 'Parcelas Disponibles', 
                    value: stats?.parcelas.disponibles || 0,
                    total: stats?.parcelas.total || 0,
                    color: '#10b981',
                  },
                  { 
                    label: 'Reservas Pendientes', 
                    value: stats?.reservas.pendientes || 0,
                    total: stats?.reservas.total || 0,
                    color: '#f59e0b',
                  },
                  { 
                    label: 'Pagos Completados', 
                    value: stats?.pagos.pagados || 0,
                    total: stats?.pagos.total || 0,
                    color: '#6366f1',
                  },
                ].map((item, index) => {
                  const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;
                  return (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {item.value} / {item.total}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: `${item.color}20`,
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: item.color,
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Parcelas Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                  <GridIcon sx={{ color: '#0d9488' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Estado de Parcelas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distribución actual
                  </Typography>
                </Box>
              </Box>
              
              {stats?.parcelas.total > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={parcelasChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {parcelasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography color="text.secondary">No hay datos de parcelas</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Reservas Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EventIcon sx={{ color: '#f59e0b' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Estado de Reservas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Por estado actual
                  </Typography>
                </Box>
              </Box>
              
              {stats?.reservas.total > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={reservasChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {reservasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value, name) => [value, name]}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography color="text.secondary">No hay datos de reservas</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pagos Bar Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: 'rgba(139, 92, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PaymentIcon sx={{ color: '#8b5cf6' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Estado de Pagos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes vs Completados
                  </Typography>
                </Box>
              </Box>
              
              {stats?.pagos.total > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={[
                      { name: 'Pendientes', cantidad: stats?.pagos.pendientes || 0, fill: '#f59e0b' },
                      { name: 'Pagados', cantidad: stats?.pagos.pagados || 0, fill: '#10b981' },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                    <YAxis tick={{ fill: '#64748b' }} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                      <Cell fill="#f59e0b" />
                      <Cell fill="#10b981" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography color="text.secondary">No hay datos de pagos</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Métodos de Pago */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
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
                  <AttachMoney sx={{ color: '#6366f1' }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Montos por Método de Pago
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distribución de ingresos
                  </Typography>
                </Box>
              </Box>
              
              {metodosPagoData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={metodosPagoData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: '#64748b' }} />
                    <RechartsTooltip 
                      formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="monto" fill="#6366f1" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={280}>
                  <Typography color="text.secondary">No hay datos de métodos de pago</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
