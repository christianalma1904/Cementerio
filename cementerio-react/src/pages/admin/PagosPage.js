import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
  Snackbar,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { pagoService, reservaService } from '../../services/apiService';

const PagosPage = () => {
  const [pagos, setPagos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPago, setSelectedPago] = useState(null);
  const [formData, setFormData] = useState({
    reserva: '',
    monto: '',
    fecha_pago: '',
    metodo_pago: 'EFECTIVO',
    estado_pago: 'PENDIENTE',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { field: 'id_pago', label: 'ID', minWidth: 60 },
    { 
      field: 'reserva', 
      label: 'Reserva', 
      minWidth: 100,
      render: (value) => `#${value}`
    },
    { field: 'monto', label: 'Monto', minWidth: 100, type: 'currency' },
    { field: 'fecha_pago', label: 'Fecha', minWidth: 120, type: 'date' },
    { field: 'metodo_pago', label: 'Método', minWidth: 120, type: 'chip' },
    { field: 'estado_pago', label: 'Estado', minWidth: 120, type: 'chip' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pagosData, reservasData] = await Promise.all([
        pagoService.getAll(),
        reservaService.getAll(),
      ]);
      setPagos(Array.isArray(pagosData) ? pagosData : pagosData.results || []);
      setReservas(Array.isArray(reservasData) ? reservasData : reservasData.results || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setSelectedPago(null);
    setFormData({
      reserva: '',
      monto: '',
      fecha_pago: new Date().toISOString().split('T')[0],
      metodo_pago: 'EFECTIVO',
      estado_pago: 'PENDIENTE',
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (pago) => {
    setSelectedPago(pago);
    setFormData({
      reserva: pago.reserva,
      monto: pago.monto,
      fecha_pago: pago.fecha_pago,
      metodo_pago: pago.metodo_pago,
      estado_pago: pago.estado_pago,
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (pago) => {
    setSelectedPago(pago);
    setOpenDelete(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (selectedPago) {
        await pagoService.update(selectedPago.id_pago, formData);
        setSnackbar({ open: true, message: 'Pago actualizado correctamente', severity: 'success' });
      } else {
        await pagoService.create(formData);
        setSnackbar({ open: true, message: 'Pago registrado correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al guardar el pago', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await pagoService.delete(selectedPago.id_pago);
      setSnackbar({ open: true, message: 'Pago eliminado correctamente', severity: 'success' });
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar el pago', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Pagos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de pagos de reservas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ bgcolor: '#1a472a', '&:hover': { bgcolor: '#2d5a3f' } }}
        >
          Nuevo Pago
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataTable
        columns={columns}
        data={pagos}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Formulario */}
      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        title={selectedPago ? 'Editar Pago' : 'Nuevo Pago'}
        loading={saving}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Reserva"
              name="reserva"
              value={formData.reserva}
              onChange={handleChange}
              required
            >
              {reservas.map((reserva) => (
                <MenuItem key={reserva.id_reserva} value={reserva.id_reserva}>
                  Reserva #{reserva.id_reserva} - {reserva.estado}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Monto"
              name="monto"
              type="number"
              value={formData.monto}
              onChange={handleChange}
              required
              InputProps={{ inputProps: { min: 0.01, step: 0.01 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Pago"
              name="fecha_pago"
              type="date"
              value={formData.fecha_pago}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Método de Pago"
              name="metodo_pago"
              value={formData.metodo_pago}
              onChange={handleChange}
              required
            >
              <MenuItem value="EFECTIVO">Efectivo</MenuItem>
              <MenuItem value="TARJETA">Tarjeta</MenuItem>
              <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Estado del Pago"
              name="estado_pago"
              value={formData.estado_pago}
              onChange={handleChange}
              required
            >
              <MenuItem value="PENDIENTE">Pendiente</MenuItem>
              <MenuItem value="PAGADO">Pagado</MenuItem>
              <MenuItem value="ANULADO">Anulado</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormDialog>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Pago"
        message={`¿Está seguro de eliminar el pago #${selectedPago?.id_pago}?`}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PagosPage;
