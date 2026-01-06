import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
  Paper,
} from '@mui/material';
import { 
  Person as PersonIcon, 
  Save as SaveIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
  CheckCircle,
  Camera,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { meService } from '../../services/apiService';

const MiPerfil = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await meService.get();
        setUserData(data);
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        });
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
        setSnackbar({
          open: true,
          message: 'Error al cargar los datos del perfil',
          severity: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await meService.update(formData);
      setUserData({ ...userData, ...formData });
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Perfil actualizado correctamente',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      setSnackbar({
        open: true,
        message: 'Error al actualizar el perfil',
        severity: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#0d9488' }} />
      </Box>
    );
  }

  const profileItems = [
    { 
      label: 'Nombre de usuario', 
      value: userData?.username,
      icon: <PersonIcon />,
      color: '#0d9488',
    },
    { 
      label: 'Email', 
      value: userData?.email || 'No especificado',
      icon: <EmailIcon />,
      color: '#6366f1',
    },
    { 
      label: 'Nombre completo', 
      value: `${userData?.first_name || ''} ${userData?.last_name || ''}`.trim() || 'No especificado',
      icon: <BadgeIcon />,
      color: '#f59e0b',
    },
    { 
      label: 'Tipo de cuenta', 
      value: userData?.is_staff ? 'Administrador' : 'Cliente',
      icon: <SecurityIcon />,
      color: '#10b981',
    },
  ];

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
          Mi Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gestiona tu información personal y preferencias
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card 
            sx={{ 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              overflow: 'visible',
            }}
          >
            {/* Header Background */}
            <Box
              sx={{
                height: 100,
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                borderRadius: '16px 16px 0 0',
              }}
            />
            
            <CardContent sx={{ textAlign: 'center', mt: -6 }}>
              {/* Avatar */}
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 36,
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  {userData?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'white',
                    boxShadow: 1,
                    '&:hover': { bgcolor: '#f8fafc' },
                  }}
                >
                  <Camera fontSize="small" />
                </IconButton>
              </Box>
              
              <Typography variant="h5" fontWeight={600} sx={{ mt: 2 }}>
                {userData?.username}
              </Typography>
              
              <Chip
                label={userData?.is_staff ? 'Administrador' : 'Cliente'}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: userData?.is_staff 
                    ? 'rgba(99, 102, 241, 0.1)' 
                    : 'rgba(13, 148, 136, 0.1)',
                  color: userData?.is_staff ? '#6366f1' : '#0d9488',
                  fontWeight: 600,
                }}
              />
              
              <Divider sx={{ my: 3 }} />
              
              {/* Quick Info */}
              <Stack spacing={2} sx={{ textAlign: 'left' }}>
                {profileItems.map((item, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
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
                        bgcolor: `${item.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight={500}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 0 }}>
              {/* Form Header */}
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'rgba(13, 148, 136, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <EditIcon sx={{ color: '#0d9488' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Información Personal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Actualiza tu información de contacto
                    </Typography>
                  </Box>
                </Box>
                {!editMode && (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditMode(true)}
                    sx={{ borderColor: '#e2e8f0' }}
                  >
                    Editar
                  </Button>
                )}
              </Box>

              <Box sx={{ p: 3 }}>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Nombre"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        disabled={!editMode}
                        sx={{
                          '& .Mui-disabled': {
                            bgcolor: '#f8fafc',
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Apellido"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        disabled={!editMode}
                        sx={{
                          '& .Mui-disabled': {
                            bgcolor: '#f8fafc',
                          },
                        }}
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
                        placeholder="tu@email.com"
                        disabled={!editMode}
                        sx={{
                          '& .Mui-disabled': {
                            bgcolor: '#f8fafc',
                          },
                        }}
                      />
                    </Grid>
                  </Grid>

                  {editMode && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            first_name: userData?.first_name || '',
                            last_name: userData?.last_name || '',
                            email: userData?.email || '',
                          });
                        }}
                        sx={{ borderColor: '#e2e8f0' }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                        disabled={saving}
                        sx={{
                          background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                          },
                        }}
                      >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card sx={{ mt: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SecurityIcon sx={{ color: '#6366f1' }} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Seguridad
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gestiona tu contraseña y seguridad
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ p: 3 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: '#f8fafc',
                    borderRadius: 3,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <CheckCircle sx={{ color: '#10b981' }} />
                    <Typography variant="body1" fontWeight={500}>
                      Tu cuenta está protegida
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Para cambiar tu contraseña, por favor contacta al administrador del sistema.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    disabled
                    sx={{ borderColor: '#e2e8f0' }}
                  >
                    Cambiar Contraseña
                  </Button>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

export default MiPerfil;
