import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Block } from '@mui/icons-material';

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Block sx={{ fontSize: 100, color: 'error.main', mb: 3 }} />
      <Typography variant="h3" gutterBottom>
        Acceso Denegado
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        No tiene permisos para acceder a esta sección.
        Por favor, contacte al administrador si cree que esto es un error.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          component={Link}
          to="/"
          sx={{ mr: 2, bgcolor: '#1a472a' }}
        >
          Volver al Inicio
        </Button>
        <Button variant="outlined" component={Link} to="/login">
          Iniciar Sesión
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
