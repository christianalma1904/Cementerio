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
  Paper,
  Divider,
} from '@mui/material';
import { 
  Search as SearchIcon,
  CalendarMonth,
  LocationOn,
  EventNote,
  CheckCircle,
  Schedule,
  Cancel,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { reservaService } from '../../services/apiService';

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        const data = await reservaService.getAll();
        setReservas(Array.isArray(data) ? data : data.results || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar las reservas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const filteredReservas = reservas.filter((reserva) =>
    reserva.id_reserva.toString().includes(searchTerm) ||
    reserva.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (estado) => {
    const configs = {
      'CONFIRMADA': { 
        color: '#10b981', 
        bgColor: 'rgba(16, 185, 129, 0.1)', 
        icon: <CheckCircle fontSize="small" />,
        label: 'Confirmada'
      },
      'PENDIENTE': { 
        color: '#f59e0b', 
        bgColor: 'rgba(245, 158, 11, 0.1)', 
        icon: <Schedule fontSize="small" />,
        label: 'Pendiente'
      },
      'CANCELADA': { 
        color: '#ef4444', 
        bgColor: 'rgba(239, 68, 68, 0.1)', 
        icon: <Cancel fontSize="small" />,
        label: 'Cancelada'
      },
    };
    return configs[estado] || configs['PENDIENTE'];
  };

  // Stats
  const stats = {
    total: reservas.length,
    confirmadas: reservas.filter(r => r.estado === 'CONFIRMADA').length,
    pendientes: reservas.filter(r => r.estado === 'PENDIENTE').length,
    canceladas: reservas.filter(r => r.estado === 'CANCELADA').length,
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
          Mis Reservas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Consulta el estado de todas tus reservas de parcelas
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { 
            label: 'Total Reservas', 
            value: stats.total, 
            icon: <EventNote />,
            gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
          },
          { 
            label: 'Confirmadas', 
            value: stats.confirmadas, 
            icon: <CheckCircle />,
            gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          },
          { 
            label: 'Pendientes', 
            value: stats.pendientes, 
            icon: <Schedule />,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          },
          { 
            label: 'Canceladas', 
            value: stats.canceladas, 
            icon: <Cancel />,
            gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
          },
        ].map((stat, index) => (
          <Grid size={{ xs: 6, md: 3 }} key={index}>
            <Card 
              sx={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
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
                </Box>
              </CardContent>
              <Box 
                sx={{ 
                  height: 4, 
                  background: stat.gradient,
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Card sx={{ mb: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Buscar por ID o estado..."
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

      {/* Reservas List */}
      {filteredReservas.length === 0 ? (
        <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <EventNote sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No se encontraron reservas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tus reservas aparecerán aquí cuando realices una
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredReservas.map((reserva, index) => {
            const statusConfig = getStatusConfig(reserva.estado);
            return (
              <Card 
                key={reserva.id_reserva}
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
                          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                        }}
                      >
                        <EventNote />
                      </Avatar>
                    </Grid>

                    {/* Info */}
                    <Grid size={{ xs: 12, sm: true }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h6" fontWeight={600}>
                          Reserva #{reserva.id_reserva}
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
                          <CalendarMonth sx={{ fontSize: 18, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary">
                            {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 18, color: '#64748b' }} />
                          <Typography variant="body2" color="text.secondary">
                            {reserva.parcela_ubicacion || `Parcela #${reserva.parcela}`}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Actions */}
                    <Grid size={{ xs: 12, sm: 'auto' }}>
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          sx={{ 
                            bgcolor: 'rgba(13, 148, 136, 0.1)',
                            color: '#0d9488',
                            '&:hover': {
                              bgcolor: 'rgba(13, 148, 136, 0.2)',
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

      {/* Leyenda */}
      <Card sx={{ mt: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            Estados de Reserva
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {[
              { estado: 'PENDIENTE', desc: 'En espera de confirmación' },
              { estado: 'CONFIRMADA', desc: 'Reserva aprobada' },
              { estado: 'CANCELADA', desc: 'Reserva cancelada' },
            ].map((item) => {
              const config = getStatusConfig(item.estado);
              return (
                <Box key={item.estado} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Chip
                    icon={config.icon}
                    label={config.label}
                    size="small"
                    sx={{
                      bgcolor: config.bgColor,
                      color: config.color,
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: config.color },
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MisReservas;
