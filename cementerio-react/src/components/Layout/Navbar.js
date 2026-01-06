import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const publicLinks = [
    { text: 'Inicio', path: '/', icon: <HomeIcon /> },
    { text: 'Servicios', path: '/servicios', icon: <InfoIcon /> },
    { text: 'Nosotros', path: '/nosotros', icon: <InfoIcon /> },
    { text: 'Contacto', path: '/contacto', icon: <ContactIcon /> },
  ];

  const renderDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
    >
      <Box sx={{ width: 250 }} role="presentation">
        <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">Cementerio Municipal</Typography>
        </Box>
        <List>
          {publicLinks.map((link) => (
            <ListItem
              button
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {isAuthenticated() ? (
            <>
              {isAdmin() && (
                <ListItem
                  button
                  component={Link}
                  to="/admin"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemIcon><DashboardIcon /></ListItemIcon>
                  <ListItemText primary="Panel Admin" />
                </ListItem>
              )}
              <ListItem button onClick={handleLogout}>
                <ListItemIcon><LogoutIcon /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItem>
            </>
          ) : (
            <ListItem
              button
              component={Link}
              to="/login"
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon><LoginIcon /></ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#1a472a' }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            🏛️ Cementerio Municipal
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {publicLinks.map((link) => (
                <Button
                  key={link.path}
                  color="inherit"
                  component={Link}
                  to={link.path}
                >
                  {link.text}
                </Button>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ ml: 2 }}>
              {isAuthenticated() ? (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleMenuOpen}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem disabled>
                      <Typography variant="body2">
                        {user?.username} ({user?.role})
                      </Typography>
                    </MenuItem>
                    <Divider />
                    {isAdmin() && (
                      <MenuItem
                        component={Link}
                        to="/admin"
                        onClick={handleMenuClose}
                      >
                        <DashboardIcon sx={{ mr: 1 }} /> Panel Admin
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} /> Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{ borderColor: 'white' }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {renderDrawer()}
    </>
  );
};

export default Navbar;
