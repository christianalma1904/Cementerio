import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Grid,
} from '@mui/material';
import { 
  Login as LoginIcon, 
  Visibility, 
  VisibilityOff,
  Person,
  Lock,
  ArrowBack,
  Spa,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    setLoading(false);
    
    if (result.success) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (result.user?.is_staff) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/cliente', { replace: true });
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '50%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          p: 6,
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13, 148, 136, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <Box
            className="animate-float"
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Spa sx={{ fontSize: 60, color: 'rgba(255, 255, 255, 0.8)' }} />
          </Box>
          
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white', 
              fontWeight: 700, 
              mb: 2,
            }}
          >
            Cementerio Municipal
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#94a3b8', 
              lineHeight: 1.8,
              mb: 4,
            }}
          >
            Sistema de gestión integral para la administración de parcelas, 
            reservas y servicios. Acceda a su cuenta para continuar.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['Reservas', 'Pagos', 'Reportes'].map((item) => (
              <Box
                key={item}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography variant="body2" sx={{ color: '#5eead4' }}>
                  {item}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 6 },
          bgcolor: '#f8fafc',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          {/* Back button */}
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 4, 
              color: '#64748b',
              '&:hover': { bgcolor: 'transparent', color: '#0d9488' },
            }}
          >
            Volver al inicio
          </Button>

          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
              }}
            >
              <Spa sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Cementerio Municipal
            </Typography>
          </Box>

          {/* Form Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Bienvenido de vuelta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ingrese sus credenciales para acceder al sistema
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': { alignItems: 'center' },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              autoFocus
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#94a3b8' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.8,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                boxShadow: '0 4px 15px rgba(13, 148, 136, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                  boxShadow: '0 6px 20px rgba(13, 148, 136, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: '#e2e8f0',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                <>
                  <LoginIcon sx={{ mr: 1 }} />
                  Iniciar Sesión
                </>
              )}
            </Button>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Necesita ayuda?
            </Typography>
          </Divider>

          {/* Help Text */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              ¿No tiene una cuenta?{' '}
              <Link 
                to="/contacto" 
                style={{ 
                  color: '#0d9488', 
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Contáctenos
              </Link>
            </Typography>
          </Box>

          {/* Demo Credentials */}
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'rgba(13, 148, 136, 0.05)',
              border: '1px solid rgba(13, 148, 136, 0.1)',
              borderRadius: 3,
            }}
          >
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: '#0d9488', 
                fontWeight: 600,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              🔐 Credenciales de demostración
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Administrador
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    german / 1234
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Box sx={{ p: 1.5, bgcolor: 'white', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Cliente
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    usuario / 1234
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
