import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Paper,
} from '@mui/material';

const NosotrosPage = () => {
  const equipo = [
    {
      nombre: 'Carlos Rodríguez',
      cargo: 'Director General',
      descripcion: 'Más de 20 años de experiencia en servicios funerarios.',
    },
    {
      nombre: 'María González',
      cargo: 'Coordinadora de Servicios',
      descripcion: 'Especialista en atención a familias y planificación.',
    },
    {
      nombre: 'Juan Martínez',
      cargo: 'Jefe de Mantenimiento',
      descripcion: 'Responsable del cuidado de las instalaciones.',
    },
    {
      nombre: 'Ana López',
      cargo: 'Administradora',
      descripcion: 'Gestión administrativa y atención al cliente.',
    },
  ];

  const valores = [
    {
      titulo: 'Respeto',
      descripcion: 'Tratamos a cada familia con dignidad y comprensión.',
    },
    {
      titulo: 'Compromiso',
      descripcion: 'Nos dedicamos a brindar el mejor servicio posible.',
    },
    {
      titulo: 'Transparencia',
      descripcion: 'Claridad en todos nuestros procesos y costos.',
    },
    {
      titulo: 'Profesionalismo',
      descripcion: 'Personal capacitado para cada situación.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Historia */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h3" component="h1" textAlign="center" gutterBottom>
          Sobre Nosotros
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}
        >
          El Cementerio Municipal ha sido un pilar de la comunidad durante más de 50 años,
          brindando un espacio de paz y reflexión para honrar la memoria de nuestros seres queridos.
        </Typography>

        <Paper sx={{ p: 4, bgcolor: '#f8f9fa' }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" gutterBottom>
                Nuestra Historia
              </Typography>
              <Typography variant="body1" paragraph>
                Fundado en 1970, el Cementerio Municipal nació con la visión de crear
                un espacio digno donde las familias pudieran rendir homenaje a sus seres queridos.
              </Typography>
              <Typography variant="body1" paragraph>
                A lo largo de los años, hemos crecido y evolucionado, incorporando tecnología
                moderna mientras mantenemos nuestros valores tradicionales de respeto y servicio.
              </Typography>
              <Typography variant="body1">
                Hoy, somos reconocidos por la calidad de nuestros servicios y el cuidado
                que ponemos en cada detalle.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  height: 300,
                  bgcolor: '#1a472a',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h1" sx={{ opacity: 0.5 }}>
                  🏛️
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Misión y Visión */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', bgcolor: '#1a472a', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Nuestra Misión
              </Typography>
              <Typography variant="body1">
                Proporcionar servicios funerarios y de cementerio con los más altos
                estándares de calidad, respeto y dignidad, acompañando a las familias
                en sus momentos más difíciles con profesionalismo y empatía.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', bgcolor: '#2d5a3f', color: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Nuestra Visión
              </Typography>
              <Typography variant="body1">
                Ser el cementerio de referencia en la región, reconocido por la
                excelencia de nuestros servicios, la belleza de nuestras instalaciones
                y el compromiso con la comunidad.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Valores */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Nuestros Valores
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {valores.map((valor, index) => (
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
                  <Typography variant="h6" gutterBottom color="primary">
                    {valor.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {valor.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Equipo */}
      <Box>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Nuestro Equipo
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Profesionales comprometidos con brindarle el mejor servicio
        </Typography>
        <Grid container spacing={4}>
          {equipo.map((miembro, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: '#1a472a',
                      fontSize: 32,
                    }}
                  >
                    {miembro.nombre.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{miembro.nombre}</Typography>
                  <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                    {miembro.cargo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {miembro.descripcion}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default NosotrosPage;
