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
} from '@mui/material';
import {
  People as PeopleIcon,
  GridOn as GridIcon,
  EventNote as EventIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  TrendingUp,
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
  Tooltip,
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
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Datos para gráficos
  const parcelasChartData = [
    { name: 'Disponibles', value: stats?.parcelas.disponibles || 0, color: '#4caf50' },
    { name: 'Ocupadas', value: stats?.parcelas.ocupadas || 0, color: '#f44336' },
    { name: 'Reservadas', value: stats?.parcelas.reservadas || 0, color: '#ff9800' },
  ];

  const reservasChartData = [
    { name: 'Pendientes', value: stats?.reservas.pendientes || 0, color: '#ff9800' },
    { name: 'Confirmadas', value: stats?.reservas.confirmadas || 0, color: '#4caf50' },
    { name: 'Canceladas', value: stats?.reservas.canceladas || 0, color: '#f44336' },
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
      icon: <PeopleIcon sx={{ fontSize: 48 }} />,
      color: '#1a472a',
      subtitle: 'Usuarios registrados',
    },
    {
      title: 'Parcelas',
      value: stats?.parcelas.total || 0,
      icon: <GridIcon sx={{ fontSize: 48 }} />,
      color: '#2e7d32',
      subtitle: `${stats?.parcelas.disponibles || 0} disponibles`,
    },
    {
      title: 'Reservas',
      value: stats?.reservas.total || 0,
      icon: <EventIcon sx={{ fontSize: 48 }} />,
      color: '#1565c0',
      subtitle: `${stats?.reservas.pendientes || 0} pendientes`,
    },
    {
      title: 'Pagos',
      value: stats?.pagos.total || 0,
      icon: <PaymentIcon sx={{ fontSize: 48 }} />,
      color: '#6a1b9a',
      subtitle: `$${stats?.pagos.montoPagado?.toFixed(2) || '0.00'} recaudado`,
    },
    {
      title: 'Difuntos',
      value: stats?.difuntos || 0,
      icon: <PersonIcon sx={{ fontSize: 48 }} />,
      color: '#37474f',
      subtitle: 'Registros totales',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Resumen general del sistema de administración
      </Typography>

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      {card.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.subtitle}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color, opacity: 0.3 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Gráfico de Parcelas */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📊 Estado de Parcelas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.parcelas.total > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={parcelasChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {parcelasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No hay datos de parcelas</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Reservas */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📅 Estado de Reservas
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.reservas.total > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reservasChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) =>
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reservasChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No hay datos de reservas</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Pagos por Estado */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💰 Estado de Pagos
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {stats?.pagos.total > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Pendientes', cantidad: stats?.pagos.pendientes || 0 },
                      { name: 'Pagados', cantidad: stats?.pagos.pagados || 0 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#2196f3">
                      <Cell fill="#ff9800" />
                      <Cell fill="#4caf50" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No hay datos de pagos</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico de Pagos por Método */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💳 Montos por Método de Pago
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {metodosPagoData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={metodosPagoData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Monto']} />
                    <Bar dataKey="monto" fill="#6a1b9a" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No hay datos de métodos de pago</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen financiero */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6">Resumen Financiero</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, bgcolor: '#e3f2fd', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="overline" color="text.secondary">
                      Total Facturado
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      ${stats?.pagos.totalMonto?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, bgcolor: '#e8f5e9', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="overline" color="text.secondary">
                      Total Cobrado
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      ${stats?.pagos.montoPagado?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ p: 3, bgcolor: '#fff3e0', borderRadius: 2, textAlign: 'center' }}>
                    <Typography variant="overline" color="text.secondary">
                      Pendiente de Cobro
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      ${((stats?.pagos.totalMonto || 0) - (stats?.pagos.montoPagado || 0)).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
