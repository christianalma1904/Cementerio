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
import { parcelaService } from '../../services/apiService';

const ParcelasPage = () => {
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedParcela, setSelectedParcela] = useState(null);
  const [formData, setFormData] = useState({
    ubicacion: '',
    tamanio: '',
    estado: 'DISPONIBLE',
    precio: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { field: 'id_parcela', label: 'ID', minWidth: 60 },
    { field: 'ubicacion', label: 'Ubicación', minWidth: 150 },
    { field: 'tamanio', label: 'Tamaño', minWidth: 100 },
    { field: 'estado', label: 'Estado', minWidth: 120, type: 'chip' },
    { field: 'precio', label: 'Precio', minWidth: 100, type: 'currency' },
  ];

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      const data = await parcelaService.getAll();
      setParcelas(Array.isArray(data) ? data : data.results || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar las parcelas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcelas();
  }, []);

  const handleOpenCreate = () => {
    setSelectedParcela(null);
    setFormData({
      ubicacion: '',
      tamanio: '',
      estado: 'DISPONIBLE',
      precio: '',
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (parcela) => {
    setSelectedParcela(parcela);
    setFormData({
      ubicacion: parcela.ubicacion,
      tamanio: parcela.tamanio,
      estado: parcela.estado,
      precio: parcela.precio,
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (parcela) => {
    setSelectedParcela(parcela);
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
      if (selectedParcela) {
        await parcelaService.update(selectedParcela.id_parcela, formData);
        setSnackbar({ open: true, message: 'Parcela actualizada correctamente', severity: 'success' });
      } else {
        await parcelaService.create(formData);
        setSnackbar({ open: true, message: 'Parcela creada correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchParcelas();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al guardar la parcela', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await parcelaService.delete(selectedParcela.id_parcela);
      setSnackbar({ open: true, message: 'Parcela eliminada correctamente', severity: 'success' });
      setOpenDelete(false);
      fetchParcelas();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar la parcela', severity: 'error' });
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
            Parcelas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestión de parcelas del cementerio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ bgcolor: '#1a472a', '&:hover': { bgcolor: '#2d5a3f' } }}
        >
          Nueva Parcela
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <DataTable
        columns={columns}
        data={parcelas}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Formulario */}
      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        title={selectedParcela ? 'Editar Parcela' : 'Nueva Parcela'}
        loading={saving}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ubicación"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              placeholder="Ej: Sector A - Fila 3 - Número 15"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tamaño"
              name="tamanio"
              value={formData.tamanio}
              onChange={handleChange}
              required
              placeholder="Ej: 2m x 1m"
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
              <MenuItem value="DISPONIBLE">Disponible</MenuItem>
              <MenuItem value="RESERVADA">Reservada</MenuItem>
              <MenuItem value="OCUPADA">Ocupada</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleChange}
              required
              InputProps={{ inputProps: { min: 0, step: 0.01 } }}
            />
          </Grid>
        </Grid>
      </FormDialog>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Parcela"
        message={`¿Está seguro de eliminar la parcela "${selectedParcela?.ubicacion}"?`}
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

export default ParcelasPage;
