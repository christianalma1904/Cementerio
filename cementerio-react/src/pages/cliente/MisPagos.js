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
  Grid,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
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
        Mis Pagos
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Historial de todos tus pagos realizados.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Resumen de pagos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total Pagado
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                ${totalPagado.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#fff3e0' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Pendiente por Pagar
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                ${totalPendiente.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Total de Pagos
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {pagos.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar por ID, estado o método..."
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

          {filteredPagos.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={4}>
              No se encontraron pagos
            </Typography>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>ID Pago</strong></TableCell>
                    <TableCell><strong>Reserva</strong></TableCell>
                    <TableCell><strong>Monto</strong></TableCell>
                    <TableCell><strong>Fecha</strong></TableCell>
                    <TableCell><strong>Método</strong></TableCell>
                    <TableCell><strong>Estado</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPagos.map((pago) => (
                    <TableRow key={pago.id_pago} hover>
                      <TableCell>#{pago.id_pago}</TableCell>
                      <TableCell>Reserva #{pago.reserva}</TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          ${parseFloat(pago.monto).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(pago.fecha_pago).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pago.metodo_pago}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={pago.estado_pago}
                          size="small"
                          color={
                            pago.estado_pago === 'PAGADO' ? 'success' :
                            pago.estado_pago === 'PENDIENTE' ? 'warning' : 'error'
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
    </Box>
  );
};

export default MisPagos;
