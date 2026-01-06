import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Check } from '@mui/icons-material';

const ServiciosPage = () => {
  const servicios = [
    {
      titulo: 'Parcelas Individuales',
      descripcion: 'Espacios individuales con diferentes opciones de ubicación y acabados.',
      imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      caracteristicas: [
        'Diferentes tamaños disponibles',
        'Ubicaciones preferenciales',
        'Mantenimiento incluido',
        'Placas conmemorativas',
      ],
    },
    {
      titulo: 'Parcelas Familiares',
      descripcion: 'Espacios amplios para mantener unida a toda la familia.',
      imagen: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400',
      caracteristicas: [
        'Capacidad múltiple',
        'Diseño personalizado',
        'Áreas verdes',
        'Monumentos opcionales',
      ],
    },
    {
      titulo: 'Servicios de Mantenimiento',
      descripcion: 'Cuidado permanente de las instalaciones y áreas verdes.',
      imagen: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      caracteristicas: [
        'Jardinería profesional',
        'Limpieza regular',
        'Cuidado de flores',
        'Vigilancia 24/7',
      ],
    },
    {
      titulo: 'Asesoría y Planificación',
      descripcion: 'Orientación completa para la planificación anticipada.',
      imagen: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
      caracteristicas: [
        'Asesoría personalizada',
        'Planes de pago flexibles',
        'Documentación legal',
        'Trámites incluidos',
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
        Nuestros Servicios
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        color="text.secondary"
        sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
      >
        Ofrecemos una amplia gama de servicios diseñados para brindar tranquilidad
        y dignidad a las familias.
      </Typography>

      <Grid container spacing={4}>
        {servicios.map((servicio, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  bgcolor: '#1a472a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" color="white">
                  🏛️
                </Typography>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {servicio.titulo}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {servicio.descripcion}
                </Typography>
                <List dense>
                  {servicio.caracteristicas.map((caracteristica, idx) => (
                    <ListItem key={idx} sx={{ py: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Check color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={caracteristica}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          ¿Tiene preguntas sobre nuestros servicios?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Contáctenos al +1 234 567 890 o visite nuestras oficinas.
        </Typography>
      </Box>
    </Container>
  );
};

export default ServiciosPage;
