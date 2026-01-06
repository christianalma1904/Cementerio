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
import { Add as AddIcon, People as PeopleIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { usuarioService } from '../../services/apiService';

const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipo_usuario: 'CLIENTE',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { field: 'id_usuario', label: 'ID', minWidth: 60 },
    { field: 'nombre', label: 'Nombre', minWidth: 120 },
    { field: 'apellido', label: 'Apellido', minWidth: 120 },
    { field: 'email', label: 'Email', minWidth: 180 },
    { field: 'telefono', label: 'Teléfono', minWidth: 120 },
    { field: 'tipo_usuario', label: 'Tipo', minWidth: 100, type: 'chip' },
    { field: 'fecha_registro', label: 'Registro', minWidth: 100, type: 'date' },
  ];

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(Array.isArray(data) ? data : data.results || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar los usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      tipo_usuario: 'CLIENTE',
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono || '',
      tipo_usuario: usuario.tipo_usuario,
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (usuario) => {
    setSelectedUsuario(usuario);
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
      if (selectedUsuario) {
        await usuarioService.update(selectedUsuario.id_usuario, formData);
        setSnackbar({ open: true, message: 'Usuario actualizado correctamente', severity: 'success' });
      } else {
        await usuarioService.create(formData);
        setSnackbar({ open: true, message: 'Usuario creado correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.email?.[0] || 'Error al guardar el usuario', 
        severity: 'error' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await usuarioService.delete(selectedUsuario.id_usuario);
      setSnackbar({ open: true, message: 'Usuario eliminado correctamente', severity: 'success' });
      setOpenDelete(false);
      fetchUsuarios();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar el usuario', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#6366f1' }} />
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
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <PeopleIcon />
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
              Usuarios
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de usuarios del sistema
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
            },
          }}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <DataTable
        columns={columns}
        data={usuarios}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Formulario */}
      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        title={selectedUsuario ? 'Editar Usuario' : 'Nuevo Usuario'}
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
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              select
              label="Tipo de Usuario"
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              required
            >
              <MenuItem value="ADMIN">Administrador</MenuItem>
              <MenuItem value="CLIENTE">Cliente</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </FormDialog>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Usuario"
        message={`¿Está seguro de eliminar al usuario "${selectedUsuario?.nombre} ${selectedUsuario?.apellido}"?`}
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

export default UsuariosPage;
