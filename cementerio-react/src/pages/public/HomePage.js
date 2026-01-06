import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Park,
  Security,
  Support,
  CalendarMonth,
  ArrowForward,
  CheckCircle,
  Phone,
  Email,
  LocationOn,
  Star,
  Spa,
  WbSunny,
  Favorite,
} from '@mui/icons-material';

const HomePage = () => {
  const servicios = [
    {
      icon: <Park sx={{ fontSize: 40 }} />,
      titulo: 'Parcelas Premium',
      descripcion: 'Espacios cuidadosamente diseñados en ubicaciones privilegiadas con mantenimiento permanente.',
      color: '#0d9488',
      bgColor: 'rgba(13, 148, 136, 0.1)',
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      titulo: 'Seguridad 24/7',
      descripcion: 'Vigilancia permanente con cámaras y personal capacitado para total tranquilidad.',
      color: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      icon: <Support sx={{ fontSize: 40 }} />,
      titulo: 'Atención Personalizada',
      descripcion: 'Equipo profesional disponible para acompañarle en cada momento con empatía.',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 40 }} />,
      titulo: 'Reservas Online',
      descripcion: 'Sistema digital moderno para gestionar reservas y pagos de manera conveniente.',
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  const estadisticas = [
    { numero: '50+', texto: 'Años de servicio', icon: <Star /> },
    { numero: '500+', texto: 'Parcelas disponibles', icon: <Park /> },
    { numero: '1000+', texto: 'Familias confían', icon: <Favorite /> },
    { numero: '24/7', texto: 'Atención continua', icon: <WbSunny /> },
  ];

  const testimonios = [
    {
      nombre: 'María García',
      texto: 'El servicio fue excepcional. Nos acompañaron en todo momento con mucha profesionalidad y empatía.',
      rating: 5,
    },
    {
      nombre: 'Carlos Rodríguez',
      texto: 'Las instalaciones son hermosas y el personal muy atento. Totalmente recomendado.',
      rating: 5,
    },
    {
      nombre: 'Ana Martínez',
      texto: 'Agradecidos por la dedicación y el cuidado que brindan. Un lugar de paz verdadero.',
      rating: 5,
    },
  ];

  return (
    <Box>
      {/* Hero Section - Diseño moderno con gradiente */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
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
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box className="animate-fade-in">
                <Chip 
                  label="✨ Más de 50 años de servicio" 
                  sx={{ 
                    mb: 3, 
                    bgcolor: 'rgba(13, 148, 136, 0.2)', 
                    color: '#5eead4',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    py: 2.5,
                    px: 1,
                  }} 
                />
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    fontWeight: 800,
                    color: 'white',
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Un lugar de{' '}
                  <Box 
                    component="span" 
                    sx={{ 
                      background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    paz y memoria
                  </Box>
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#94a3b8', 
                    mb: 4, 
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Honramos la memoria de sus seres queridos con espacios dignos, 
                  servicios de excelencia y el más profundo respeto.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/servicios"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.8,
                      px: 4,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 10px 40px rgba(13, 148, 136, 0.4)',
                      },
                    }}
                  >
                    Explorar Servicios
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/contacto"
                    sx={{
                      py: 1.8,
                      px: 4,
                      fontSize: '1rem',
                      borderColor: 'rgba(148, 163, 184, 0.3)',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#14b8a6',
                        bgcolor: 'rgba(13, 148, 136, 0.1)',
                      },
                    }}
                  >
                    Contactar
                  </Button>
                </Stack>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 5 }}>
              <Box 
                className="animate-float"
                sx={{ 
                  display: { xs: 'none', md: 'flex' },
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 350,
                    height: 350,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Spa sx={{ fontSize: 150, color: 'rgba(255, 255, 255, 0.15)' }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Estadísticas flotantes */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
        <Card 
          sx={{ 
            p: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <Grid container spacing={4}>
            {estadisticas.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    opacity: 0,
                    animation: 'fadeIn 0.6s ease-out forwards',
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Box sx={{ color: '#0d9488', mb: 1 }}>{stat.icon}</Box>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800, 
                      background: 'linear-gradient(135deg, #0d9488 0%, #6366f1 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {stat.numero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    {stat.texto}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </Container>

      {/* Servicios Section */}
      <Box sx={{ py: 12, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="Nuestros Servicios" 
              sx={{ 
                mb: 2, 
                bgcolor: 'rgba(13, 148, 136, 0.1)', 
                color: '#0d9488',
                fontWeight: 600,
              }} 
            />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Servicios de{' '}
              <Box component="span" sx={{ color: '#0d9488' }}>Excelencia</Box>
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ maxWidth: 600, mx: 'auto', fontSize: '1.1rem' }}
            >
              Ofrecemos servicios integrales con el más alto nivel de profesionalismo 
              y respeto hacia las familias que confían en nosotros.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {servicios.map((servicio, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    p: 1,
                    cursor: 'pointer',
                    border: '1px solid transparent',
                    '&:hover': {
                      borderColor: servicio.color,
                      '& .service-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      },
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box 
                      className="service-icon"
                      sx={{ 
                        width: 80,
                        height: 80,
                        borderRadius: 3,
                        bgcolor: servicio.bgColor,
                        color: servicio.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      {servicio.icon}
                    </Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {servicio.titulo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {servicio.descripcion}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/servicios"
              endIcon={<ArrowForward />}
              sx={{ 
                borderWidth: 2,
                '&:hover': { borderWidth: 2 },
              }}
            >
              Ver todos los servicios
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Por qué elegirnos */}
      <Box sx={{ py: 12, background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip 
                label="¿Por qué elegirnos?" 
                sx={{ 
                  mb: 2, 
                  bgcolor: 'rgba(99, 102, 241, 0.1)', 
                  color: '#6366f1',
                  fontWeight: 600,
                }} 
              />
              <Typography variant="h3" fontWeight={700} gutterBottom>
                Compromiso con la{' '}
                <Box component="span" sx={{ color: '#6366f1' }}>dignidad</Box>
                {' '}y el{' '}
                <Box component="span" sx={{ color: '#0d9488' }}>respeto</Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                Por más de 50 años, hemos sido el lugar de confianza para miles de familias. 
                Nuestro compromiso es brindar un espacio de paz donde honrar la memoria de sus seres queridos.
              </Typography>
              
              <Stack spacing={3}>
                {[
                  'Instalaciones modernas y bien mantenidas',
                  'Personal capacitado y empático',
                  'Precios justos y planes de pago flexibles',
                  'Atención personalizada 24/7',
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CheckCircle sx={{ color: '#10b981', fontSize: 24 }} />
                    <Typography variant="body1" fontWeight={500}>{item}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative' }}>
                <Card 
                  sx={{ 
                    p: 4, 
                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    color: 'white',
                  }}
                >
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    ¿Necesita asesoría?
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
                    Nuestro equipo está disponible para responder sus preguntas y guiarle 
                    en la elección del servicio adecuado para su familia.
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Phone />
                      <Typography>(123) 456-7890</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Email />
                      <Typography>info@cementerio.com</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocationOn />
                      <Typography>Av. Principal #123, Ciudad</Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to="/contacto"
                    sx={{ 
                      mt: 4, 
                      py: 1.5,
                      bgcolor: 'white', 
                      color: '#0d9488',
                      '&:hover': { 
                        bgcolor: '#f0fdfa',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    Solicitar información
                  </Button>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonios */}
      <Box sx={{ py: 12, bgcolor: '#0f172a' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="Testimonios" 
              sx={{ 
                mb: 2, 
                bgcolor: 'rgba(13, 148, 136, 0.2)', 
                color: '#5eead4',
                fontWeight: 600,
              }} 
            />
            <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
              Lo que dicen las familias
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', maxWidth: 500, mx: 'auto' }}>
              La confianza de las familias es nuestro mayor orgullo
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {testimonios.map((testimonio, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    p: 3,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                      {[...Array(testimonio.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                      ))}
                    </Stack>
                    <Typography variant="body1" sx={{ color: '#e2e8f0', mb: 3, lineHeight: 1.8 }}>
                      "{testimonio.texto}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#0d9488' }}>
                        {testimonio.nombre.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                        {testimonio.nombre}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Final */}
      <Box 
        sx={{ 
          py: 10, 
          background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight={700} color="white" gutterBottom>
            Estamos aquí para usted
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
            Contáctenos para recibir asesoría personalizada sin compromiso
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/login"
              sx={{
                py: 1.8,
                px: 5,
                bgcolor: 'white',
                color: '#0d9488',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#f0fdfa',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                },
              }}
            >
              Acceder al Sistema
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/contacto"
              sx={{
                py: 1.8,
                px: 5,
                borderColor: 'white',
                color: 'white',
                fontSize: '1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Contactar
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
