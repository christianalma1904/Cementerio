import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  GridOn as GridIcon,
  EventNote as EventIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  ChevronLeft,
  Security as SecurityIcon,
  Notifications,
  Settings,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 260;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuItems = [
    { text: 'Dashboard', path: '/admin', icon: <DashboardIcon /> },
    { text: 'Cuentas', path: '/admin/cuentas', icon: <SecurityIcon /> },
    { text: 'Usuarios', path: '/admin/usuarios', icon: <PeopleIcon /> },
    { text: 'Parcelas', path: '/admin/parcelas', icon: <GridIcon /> },
    { text: 'Reservas', path: '/admin/reservas', icon: <EventIcon /> },
    { text: 'Pagos', path: '/admin/pagos', icon: <PaymentIcon /> },
    { text: 'Difuntos', path: '/admin/difuntos', icon: <PersonIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout(true);
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #111827 0%, #1f2937 100%)',
        color: 'white',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🏛️
          </Box>
          <Typography variant="subtitle1" fontWeight={700} letterSpacing={-0.5}>
            Cementerio
          </Typography>
        </Box>
        {isMobile && (
          <IconButton color="inherit" onClick={handleDrawerToggle} size="small">
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      {/* User Card */}
      <Box
        sx={{
          mx: 2,
          my: 2,
          p: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              fontWeight={600}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.username}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.7rem' }}>
              Administrador
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Typography
        variant="overline"
        sx={{ px: 2.5, pt: 2, pb: 0.5, opacity: 0.4, fontSize: '0.65rem', letterSpacing: 1 }}
      >
        Menú
      </Typography>

      <List sx={{ flexGrow: 1, px: 1.5, py: 0.5 }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                mb: 0.25,
                py: 1,
                bgcolor: active ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: active ? '#34d399' : 'rgba(255,255,255,0.65)',
                '&:hover': {
                  bgcolor: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: active ? '#34d399' : 'white',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: active ? '#34d399' : 'rgba(255,255,255,0.4)',
                  minWidth: 36,
                  '& svg': { fontSize: 20 },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  fontWeight: active ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* Bottom Actions */}
      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <ListItemButton
          component={Link}
          to="/"
          sx={{
            py: 1,
            color: 'rgba(255,255,255,0.65)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.08)',
              color: 'white',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 36, '& svg': { fontSize: 20 } }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Ver Sitio" 
            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 400 }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          color: 'text.primary',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={600} color="text.primary">
              Panel de Administración
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notificaciones">
              <IconButton sx={{ bgcolor: '#f1f5f9' }}>
                <Badge badgeContent={3} color="error" variant="dot">
                  <Notifications sx={{ color: '#64748b' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Configuración">
              <IconButton sx={{ bgcolor: '#f1f5f9' }}>
                <Settings sx={{ color: '#64748b' }} />
              </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

            <Tooltip title="Opciones de usuario">
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar 
                  sx={{ 
                    width: 38, 
                    height: 38, 
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    fontWeight: 700,
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {user?.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Administrador
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout} sx={{ color: '#ef4444', gap: 1 }}>
                <LogoutIcon fontSize="small" /> Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              border: 'none',
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              border: 'none',
              borderRadius: 0,
              boxShadow: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
