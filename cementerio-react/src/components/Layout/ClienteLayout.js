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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Tooltip,
  Chip,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  EventNote as EventIcon,
  Payment as PaymentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  ChevronLeft,
  Settings,
  Spa,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

const ClienteLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout(true);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/cliente' },
    { text: 'Mis Reservas', icon: <EventIcon />, path: '/cliente/reservas' },
    { text: 'Mis Pagos', icon: <PaymentIcon />, path: '/cliente/pagos' },
    { text: 'Mi Perfil', icon: <PersonIcon />, path: '/cliente/perfil' },
  ];

  const drawer = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 45,
            height: 45,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spa sx={{ color: 'white', fontSize: 24 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 700 }}>
            Portal Cliente
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Cementerio Municipal
          </Typography>
        </Box>
        {isMobile && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ ml: 'auto', color: '#64748b' }}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      
      {/* User Info Card */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: 'white', 
                  fontWeight: 600,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.username}
              </Typography>
              <Chip
                label="Cliente"
                size="small"
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontSize: '0.65rem',
                  bgcolor: 'rgba(13, 148, 136, 0.2)',
                  color: '#5eead4',
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 2, flex: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: '#64748b',
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          Menú Principal
        </Typography>
        
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: isActive ? 'white' : '#94a3b8',
                bgcolor: isActive ? 'rgba(13, 148, 136, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #0d9488' : '3px solid transparent',
                '&:hover': {
                  bgcolor: isActive 
                    ? 'rgba(13, 148, 136, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: isActive ? '#14b8a6' : '#64748b',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    bgcolor: '#14b8a6',
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
      
      {/* Bottom Actions */}
      <List sx={{ p: 2 }}>
        <ListItemButton
          component={Link}
          to="/"
          sx={{
            borderRadius: 2,
            color: '#94a3b8',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
            },
          }}
        >
          <ListItemIcon sx={{ color: '#64748b', minWidth: 40 }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Ir al Sitio Principal" 
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, color: '#64748b' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                color: '#1e293b',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {menuItems.find(item => item.path === location.pathname)?.text || 'Portal del Cliente'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Configuración">
              <IconButton sx={{ color: '#64748b' }}>
                <Settings />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Mi cuenta">
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cliente
              </Typography>
            </Box>
            <Divider />
            <MenuItem 
              component={Link} 
              to="/cliente/perfil" 
              onClick={handleMenuClose}
              sx={{ py: 1.5 }}
            >
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Mi Perfil
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{ py: 1.5, color: '#ef4444' }}
            >
              <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              border: 'none',
              borderRadius: 0,
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
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

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default ClienteLayout;
