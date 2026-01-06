import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Park,
  Security,
  Support,
  CalendarMonth,
} from '@mui/icons-material';

const HomePage = () => {
  const servicios = [
    {
      icon: <Park sx={{ fontSize: 48, color: '#1a472a' }} />,
      titulo: 'Parcelas Disponibles',
      descripcion: 'Amplia variedad de parcelas en diferentes ubicaciones y tamaños.',
    },
    {
      icon: <Security sx={{ fontSize: 48, color: '#1a472a' }} />,
      titulo: 'Seguridad 24/7',
      descripcion: 'Vigilancia permanente para la tranquilidad de las familias.',
    },
    {
      icon: <Support sx={{ fontSize: 48, color: '#1a472a' }} />,
      titulo: 'Atención Personalizada',
      descripcion: 'Personal capacitado para acompañarle en todo momento.',
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 48, color: '#1a472a' }} />,
      titulo: 'Reservas Online',
      descripcion: 'Sistema de reservas digital fácil y conveniente.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Cementerio Municipal
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
            Un lugar de paz y respeto para honrar la memoria de sus seres queridos
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/servicios"
              sx={{ bgcolor: 'white', color: '#1a472a', '&:hover': { bgcolor: '#f5f5f5' } }}
            >
              Nuestros Servicios
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contacto"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Contactar
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Servicios Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Nuestros Servicios
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Ofrecemos servicios integrales con el más alto nivel de profesionalismo
          y respeto hacia las familias.
        </Typography>

        <Grid container spacing={4}>
          {servicios.map((servicio, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>{servicio.icon}</Box>
                  <Typography variant="h6" gutterBottom>
                    {servicio.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {servicio.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Estadísticas */}
      <Box sx={{ bgcolor: '#f5f5f5', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                50+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Años de servicio
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                500+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Parcelas disponibles
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                1000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Familias confiaron
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h3" color="primary" fontWeight="bold">
                24/7
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Atención continua
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom>
            ¿Necesita más información?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Nuestro equipo está disponible para resolver todas sus dudas
          </Typography>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/contacto"
            sx={{ bgcolor: 'white', color: '#1a472a', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            Contáctenos Ahora
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default HomePage;
