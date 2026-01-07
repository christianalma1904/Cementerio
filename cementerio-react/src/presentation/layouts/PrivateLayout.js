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
  Chip,
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

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer and AppBar omitted for brevity; using Outlet for nested routes */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default ClienteLayout;
