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
import { reservaService, usuarioService, parcelaService } from '../../services/apiService';

const ReservasPage = () => {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [formData, setFormData] = useState({
    usuario: '',
    parcela: '',
    fecha_reserva: '',
    estado: 'PENDIENTE',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { field: 'id_reserva', label: 'ID', minWidth: 60 },
    { 
      field: 'usuario', 
      label: 'Usuario', 
      minWidth: 150,
      render: (value, row) => row.usuario_nombre || `Usuario ${value}`
    },
    { 
      field: 'parcela', 
      label: 'Parcela', 
      minWidth: 150,
      render: (value, row) => row.parcela_ubicacion || `Parcela ${value}`
    },
    { field: 'fecha_reserva', label: 'Fecha Reserva', minWidth: 120, type: 'date' },
    { field: 'estado', label: 'Estado', minWidth: 120, type: 'chip' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservasData, usuariosData, parcelasData] = await Promise.all([
        reservaService.getAll(),
        usuarioService.getAll(),
        parcelaService.getAll(),
      ]);
      setReservas(Array.isArray(reservasData) ? reservasData : reservasData.results || []);
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : usuariosData.results || []);
      setParcelas(Array.isArray(parcelasData) ? parcelasData : parcelasData.results || []);
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
    setSelectedReserva(null);
    setFormData({
      usuario: '',
      parcela: '',
      fecha_reserva: new Date().toISOString().split('T')[0],
      estado: 'PENDIENTE',
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (reserva) => {
    setSelectedReserva(reserva);
    setFormData({
      usuario: reserva.usuario,
      parcela: reserva.parcela,
      fecha_reserva: reserva.fecha_reserva,
      estado: reserva.estado,
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (reserva) => {
    setSelectedReserva(reserva);
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
      if (selectedReserva) {
        await reservaService.update(selectedReserva.id_reserva, formData);
        setSnackbar({ open: true, message: 'Reserva actualizada correctamente', severity: 'success' });
      } else {
        await reservaService.create(formData);
        setSnackbar({ open: true, message: 'Reserva creada correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al guardar la reserva', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await reservaService.delete(selectedReserva.id_reserva);
      setSnackbar({ open: true, message: 'Reserva eliminada correctamente', severity: 'success' });
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar la reserva', severity: 'error' });
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
            Reservas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de reservas de parcelas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ bgcolor: '#1a472a', '&:hover': { bgcolor: '#2d5a3f' } }}
        >
          Nueva Reserva
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataTable
        columns={columns}
        data={reservas}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Formulario */}
      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        title={selectedReserva ? 'Editar Reserva' : 'Nueva Reserva'}
        loading={saving}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre} {usuario.apellido} - {usuario.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Parcela"
              name="parcela"
              value={formData.parcela}
              onChange={handleChange}
              required
            >
              {parcelas.map((parcela) => (
                <MenuItem key={parcela.id_parcela} value={parcela.id_parcela}>
                  {parcela.ubicacion} - {parcela.estado} - ${parcela.precio}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Fecha de Reserva"
              name="fecha_reserva"
              type="date"
              value={formData.fecha_reserva}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              required
            >
              <MenuItem value="PENDIENTE">Pendiente</MenuItem>
              <MenuItem value="CONFIRMADA">Confirmada</MenuItem>
              <MenuItem value="CANCELADA">Cancelada</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormDialog>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Reserva"
        message={`¿Está seguro de eliminar la reserva #${selectedReserva?.id_reserva}?`}
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

export default ReservasPage;
