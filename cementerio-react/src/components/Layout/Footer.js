import React from 'react';
import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Email,
  LocationOn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a472a',
        color: 'white',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              🏛️ Cementerio Municipal
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Brindamos servicios de calidad con respeto y dignidad
              para honrar la memoria de sus seres queridos.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contacto
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">+1 234 567 890</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">info@cementerio.com</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ mr: 1, fontSize: 18 }} />
              <Typography variant="body2">
                Av. Principal 123, Ciudad
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Horarios
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Lunes a Viernes: 8:00 - 18:00
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Sábados y Domingos: 9:00 - 14:00
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            mt: 3,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            © {new Date().getFullYear()} Cementerio Municipal. Todos los derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
