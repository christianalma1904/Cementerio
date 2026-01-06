import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Mis Reservas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Consulta el estado de todas tus reservas de parcelas.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar por ID o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
            />
          </Box>

          {filteredReservas.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No se encontraron reservas
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>ID Reserva</strong></TableCell>
                    <TableCell><strong>Fecha de Reserva</strong></TableCell>
                    <TableCell><strong>Parcela</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReservas.map((reserva) => (
                    <TableRow key={reserva.id_reserva} hover>
                      <TableCell>#{reserva.id_reserva}</TableCell>
                      <TableCell>
                        {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        {reserva.parcela_ubicacion || `Parcela #${reserva.parcela}`}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reserva.estado}
                          size="small"
                          color={
                            reserva.estado === 'CONFIRMADA' ? 'success' :
                            reserva.estado === 'PENDIENTE' ? 'warning' : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Leyenda de estados */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            Estados de Reserva:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="PENDIENTE" size="small" color="warning" />
              <Typography variant="body2">En espera de confirmación</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="CONFIRMADA" size="small" color="success" />
              <Typography variant="body2">Reserva aprobada</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip label="CANCELADA" size="small" color="error" />
              <Typography variant="body2">Reserva cancelada</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MisReservas;
