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
import { useAuth } from '../../../contexts/AuthContext';

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
            }}
          >
            Volver
          </Button>
          <Paper sx={{ p: 4 }} elevation={3}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
              Iniciar sesión
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                label="Usuario"
                fullWidth
                sx={{ mb: 2 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Person /></InputAdornment> }}
              />
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                sx={{ mb: 2 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={loading ? <CircularProgress size={18} /> : <LoginIcon />}
              >
                {loading ? 'Ingresando...' : 'Ingresar'}
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body2">¿No tienes cuenta?</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Button component={Link} to="/register">Registrarse</Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
