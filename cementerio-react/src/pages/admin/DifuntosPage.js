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
import { Add as AddIcon, Person as PersonIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { difuntoService, parcelaService } from '../../services/apiService';

const DifuntosPage = () => {
  const [difuntos, setDifuntos] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedDifunto, setSelectedDifunto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    fecha_fallecimiento: '',
    parcela: '',
    notas: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { field: 'id_difunto', label: 'ID', minWidth: 60 },
    { field: 'nombre', label: 'Nombre', minWidth: 120 },
    { field: 'apellido', label: 'Apellido', minWidth: 120 },
    { field: 'fecha_nacimiento', label: 'Nacimiento', minWidth: 110, type: 'date' },
    { field: 'fecha_fallecimiento', label: 'Fallecimiento', minWidth: 110, type: 'date' },
    { 
      field: 'parcela', 
      label: 'Parcela', 
      minWidth: 150,
      render: (value, row) => row.parcela_ubicacion || `Parcela ${value}`
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [difuntosData, parcelasData] = await Promise.all([
        difuntoService.getAll(),
        parcelaService.getAll(),
      ]);
      setDifuntos(Array.isArray(difuntosData) ? difuntosData : difuntosData.results || []);
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
    setSelectedDifunto(null);
    setFormData({
      nombre: '',
      apellido: '',
      fecha_nacimiento: '',
      fecha_fallecimiento: '',
      parcela: '',
      notas: '',
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (difunto) => {
    setSelectedDifunto(difunto);
    setFormData({
      nombre: difunto.nombre,
      apellido: difunto.apellido,
      fecha_nacimiento: difunto.fecha_nacimiento || '',
      fecha_fallecimiento: difunto.fecha_fallecimiento,
      parcela: difunto.parcela,
      notas: difunto.notas || '',
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (difunto) => {
    setSelectedDifunto(difunto);
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
      const dataToSend = {
        ...formData,
        fecha_nacimiento: formData.fecha_nacimiento || null,
      };
      
      if (selectedDifunto) {
        await difuntoService.update(selectedDifunto.id_difunto, dataToSend);
        setSnackbar({ open: true, message: 'Registro actualizado correctamente', severity: 'success' });
      } else {
        await difuntoService.create(dataToSend);
        setSnackbar({ open: true, message: 'Registro creado correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al guardar el registro', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await difuntoService.delete(selectedDifunto.id_difunto);
      setSnackbar({ open: true, message: 'Registro eliminado correctamente', severity: 'success' });
      setOpenDelete(false);
      fetchData();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar el registro', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#64748b' }} />
      </Box>
    );
  }

  return (
    <Box className="animate-fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <PersonIcon />
          </Box>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Difuntos
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Registro de personas fallecidas
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ 
            background: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)',
            boxShadow: '0 4px 14px rgba(100, 116, 139, 0.35)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
            },
          }}
        >
          Nuevo Registro
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <DataTable
        columns={columns}
        data={difuntos}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Formulario */}
      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        title={selectedDifunto ? 'Editar Registro' : 'Nuevo Registro'}
        loading={saving}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Fecha de Fallecimiento"
              name="fecha_fallecimiento"
              type="date"
              value={formData.fecha_fallecimiento}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
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
                  {parcela.ubicacion} - {parcela.estado}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Notas"
              name="notas"
              value={formData.notas}
              onChange={handleChange}
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </FormDialog>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Registro"
        message={`¿Está seguro de eliminar el registro de "${selectedDifunto?.nombre} ${selectedDifunto?.apellido}"?`}
        severity="danger"
        confirmText="Eliminar"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DifuntosPage;
