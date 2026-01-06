import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { 
  Search as SearchIcon,
  Payment,
  CheckCircle,
  Schedule,
  CreditCard,
  AccountBalance,
  AttachMoney,
  Visibility,
  FilterList,
  TrendingUp,
  Receipt,
} from '@mui/icons-material';
import { pagoService } from '../../services/apiService';

const MisPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        const data = await pagoService.getAll();
        setPagos(Array.isArray(data) ? data : data.results || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los pagos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, []);

  const filteredPagos = pagos.filter((pago) =>
    pago.id_pago.toString().includes(searchTerm) ||
    pago.estado_pago.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.metodo_pago.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPagado = pagos
    .filter(p => p.estado_pago === 'PAGADO')
    .reduce((sum, p) => sum + parseFloat(p.monto), 0);

  const totalPendiente = pagos
    .filter(p => p.estado_pago === 'PENDIENTE')
    .reduce((sum, p) => sum + parseFloat(p.monto), 0);

  const totalGeneral = totalPagado + totalPendiente;
  const porcentajePagado = totalGeneral > 0 ? (totalPagado / totalGeneral) * 100 : 0;

  const getStatusConfig = (estado) => {
    const configs = {
      'PAGADO': { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        icon: <CheckCircle fontSize="small" />,
        label: 'Pagado'
      },
      'PENDIENTE': { 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)', 
        icon: <Schedule fontSize="small" />,
        label: 'Pendiente'
      },
    };
    return configs[estado] || configs['PENDIENTE'];
  };

  const getMetodoIcon = (metodo) => {
    switch(metodo?.toUpperCase()) {
      case 'TARJETA':
        return <CreditCard />;
      case 'TRANSFERENCIA':
        return <AccountBalance />;
      default:
        return <AttachMoney />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#0d9488' }} />
      </Box>
    );
  }

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
          Mis Pagos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Historial y estado de todos tus pagos
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Pagado */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Total Pagado
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#10b981' }}>
                    ${totalPagado.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {pagos.filter(p => p.estado_pago === 'PAGADO').length} pagos completados
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <CheckCircle sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ height: 4, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }} />
          </Card>
        </Grid>

        {/* Pendiente */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Pendiente por Pagar
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#f59e0b' }}>
                    ${totalPendiente.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {pagos.filter(p => p.estado_pago === 'PENDIENTE').length} pagos pendientes
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Schedule sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ height: 4, background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }} />
          </Card>
        </Grid>

        {/* Total */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Progreso de Pagos
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#6366f1' }}>
                    {porcentajePagado.toFixed(0)}%
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={porcentajePagado}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                        }
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    ml: 2,
                    flexShrink: 0,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
            <Box sx={{ height: 4, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }} />
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Buscar por ID, estado o método..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                maxWidth: 400,
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8fafc',
                }
              }}
            />
            <Tooltip title="Filtros">
              <IconButton sx={{ bgcolor: '#f8fafc' }}>
                <FilterList />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Pagos List */}
      {filteredPagos.length === 0 ? (
        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <Receipt sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No se encontraron pagos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tus pagos aparecerán aquí cuando realices una reserva
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredPagos.map((pago, index) => {
            const statusConfig = getStatusConfig(pago.estado_pago);
            return (
              <Card 
                key={pago.id_pago}
                sx={{ 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                    transform: 'translateY(-2px)',
                  },
                }}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3} alignItems="center">
                    {/* Icon */}
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Avatar
                        sx={{
                          width: 56,
                          height: 56,
                          background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                        }}
                      >
                        {getMetodoIcon(pago.metodo_pago)}
                      </Avatar>
                    </Grid>

                    {/* Info */}
                    <Grid size={{ xs: 12, sm: true }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          Pago #{pago.id_pago}
                        </Typography>
                        <Chip
                          icon={statusConfig.icon}
                          label={statusConfig.label}
                          size="small"
                          sx={{
                            bgcolor: statusConfig.bgColor,
                            color: statusConfig.color,
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: statusConfig.color,
                            },
                          }}
                        />
                      </Box>
                      
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Payment sx={{ fontSize: 18, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary">
                            {pago.metodo_pago}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Receipt sx={{ fontSize: 18, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary">
                            Reserva #{pago.reserva}
                          </Typography>
                        </Box>
                        {pago.fecha_pago && (
                          <Typography variant="body2" color="text.secondary">
                            {new Date(pago.fecha_pago).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>

                    {/* Amount */}
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                        <Typography 
                          variant="h5" 
                          fontWeight={700}
                          sx={{
                            color: pago.estado_pago === 'PAGADO' ? '#10b981' : '#64748b',
                          }}
                        >
                          ${parseFloat(pago.monto).toFixed(2)}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Actions */}
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          sx={{ 
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            '&:hover': {
                              bgcolor: 'rgba(99, 102, 241, 0.2)',
                            }
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Métodos de Pago Info */}
      <Card sx={{ mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Métodos de Pago Aceptados
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { icon: <AttachMoney />, label: 'Efectivo', color: '#10b981' },
              { icon: <CreditCard />, label: 'Tarjeta', color: '#6366f1' },
              { icon: <AccountBalance />, label: 'Transferencia', color: '#0d9488' },
            ].map((method, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: `${method.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: method.color,
                  }}
                >
                  {method.icon}
                </Box>
                <Typography variant="body2" fontWeight={500}>
                  {method.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MisPagos;
