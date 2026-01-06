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
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Add as AddIcon, Security as SecurityIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import FormDialog from '../../components/common/FormDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { authUserService } from '../../services/apiService';

const CuentasPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
    is_active: true,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [saving, setSaving] = useState(false);

  const columns = [
    { field: 'id', label: 'ID', minWidth: 60 },
    { field: 'username', label: 'Usuario', minWidth: 120 },
    { field: 'email', label: 'Email', minWidth: 180 },
    { field: 'first_name', label: 'Nombre', minWidth: 120 },
    { field: 'last_name', label: 'Apellido', minWidth: 120 },
    { 
      field: 'is_staff', 
      label: 'Rol', 
      minWidth: 100,
      render: (value) => (
        <Chip 
          label={value ? 'ADMIN' : 'CLIENTE'} 
          size="small" 
          color={value ? 'error' : 'primary'}
        />
      )
    },
    { 
      field: 'is_active', 
      label: 'Estado', 
      minWidth: 80,
      render: (value) => (
        <Chip 
          label={value ? 'Activo' : 'Inactivo'} 
          size="small" 
          color={value ? 'success' : 'default'}
        />
      )
    },
    { field: 'date_joined', label: 'Registro', minWidth: 100, type: 'date' },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authUserService.getAll();
      setUsers(Array.isArray(data) ? data : data.results || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar las cuentas de usuario');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      is_staff: false,
      is_active: true,
    });
    setOpenForm(true);
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      password: '', // No mostramos la contraseña actual
      is_staff: user.is_staff,
      is_active: user.is_active,
    });
    setOpenForm(true);
  };

  const handleOpenDelete = (user) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Preparar datos para enviar
      const dataToSend = { ...formData };
      
      // Si es edición y no se cambió la contraseña, no enviarla
      if (selectedUser && !dataToSend.password) {
        delete dataToSend.password;
      }
      
      if (selectedUser) {
        await authUserService.update(selectedUser.id, dataToSend);
        setSnackbar({ open: true, message: 'Cuenta actualizada correctamente', severity: 'success' });
      } else {
        if (!dataToSend.password) {
          setSnackbar({ open: true, message: 'La contraseña es requerida para nuevos usuarios', severity: 'error' });
          setSaving(false);
          return;
        }
        await authUserService.create(dataToSend);
        setSnackbar({ open: true, message: 'Cuenta creada correctamente', severity: 'success' });
      }
      setOpenForm(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.email?.[0] || 
                       err.response?.data?.password?.[0] ||
                       'Error al guardar la cuenta';
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await authUserService.delete(selectedUser.id);
      setSnackbar({ open: true, message: 'Cuenta eliminada correctamente', severity: 'success' });
      setOpenDelete(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Error al eliminar la cuenta', severity: 'error' });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#dc2626' }} />
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
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <SecurityIcon />
          </Box>
          <Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cuentas del Sistema
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gestión de cuentas de acceso (usuario y contraseña)
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ 
            background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
            boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #b91c1c 0%, #dc2626 100%)',
            },
          }}
        >
          Nueva Cuenta
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
        <strong>Nota:</strong> Estas son las cuentas de acceso al sistema. 
        Los usuarios tipo "ADMIN" pueden acceder al panel de administración, 
        los tipo "CLIENTE" solo al portal de cliente.
      </Alert>

      <DataTable
        columns={columns}
        data={users}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Formulario */}
      <FormDialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        title={selectedUser ? 'Editar Cuenta' : 'Nueva Cuenta'}
        loading={saving}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              helperText="Este es el nombre para iniciar sesión"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label={selectedUser ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!selectedUser}
              helperText={selectedUser ? 'Solo completar si desea cambiar la contraseña' : 'Contraseña para iniciar sesión'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
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
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_staff}
                  onChange={handleChange}
                  name="is_staff"
                  color="primary"
                />
              }
              label="Es Administrador"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Los administradores acceden al panel de admin
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={handleChange}
                  name="is_active"
                  color="success"
                />
              }
              label="Cuenta Activa"
            />
            <Typography variant="caption" color="text.secondary" display="block">
              Las cuentas inactivas no pueden iniciar sesión
            </Typography>
          </Grid>
        </Grid>
      </FormDialog>

      {/* Confirmación de eliminación */}
      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar Cuenta"
        message={`¿Está seguro de eliminar la cuenta "${selectedUser?.username}"? Esta acción no se puede deshacer.`}
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

export default CuentasPage;
