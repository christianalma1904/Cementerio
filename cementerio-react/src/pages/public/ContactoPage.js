import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Schedule,
} from '@mui/icons-material';

const ContactoPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular envío de formulario
    console.log('Datos del formulario:', formData);
    setShowSuccess(true);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    });
  };

  const infoContacto = [
    {
      icon: <Phone sx={{ fontSize: 40 }} />,
      titulo: 'Teléfono',
      info: '+1 234 567 890',
      extra: '+1 234 567 891',
    },
    {
      icon: <Email sx={{ fontSize: 40 }} />,
      titulo: 'Email',
      info: 'info@cementerio.com',
      extra: 'contacto@cementerio.com',
    },
    {
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      titulo: 'Dirección',
      info: 'Av. Principal 123',
      extra: 'Ciudad, CP 12345',
    },
    {
      icon: <Schedule sx={{ fontSize: 40 }} />,
      titulo: 'Horarios',
      info: 'Lun-Vie: 8:00 - 18:00',
      extra: 'Sáb-Dom: 9:00 - 14:00',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
        Contáctenos
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
      >
        Estamos aquí para ayudarle. No dude en comunicarse con nosotros para
        cualquier consulta o información adicional.
      </Typography>

      {/* Tarjetas de información */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {infoContacto.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card
              sx={{
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' },
              }}
            >
              <CardContent>
                <Box sx={{ color: '#1a472a', mb: 2 }}>{item.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {item.titulo}
                </Typography>
                <Typography variant="body2">{item.info}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.extra}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Formulario de contacto */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Envíenos un Mensaje
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  required
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  multiline
                  rows={4}
                  margin="normal"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{ mt: 2, bgcolor: '#1a472a', '&:hover': { bgcolor: '#2d5a3f' } }}
                >
                  Enviar Mensaje
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Mapa */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', minHeight: 400 }}>
            <Box
              sx={{
                height: '100%',
                bgcolor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <LocationOn sx={{ fontSize: 64, color: '#1a472a', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                Ubicación del Cementerio
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Av. Principal 123, Ciudad
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                href="https://maps.google.com"
                target="_blank"
              >
                Ver en Google Maps
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          ¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ContactoPage;
