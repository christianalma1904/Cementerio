import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, hasRole, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated()) {
    // Redirigir al login guardando la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar roles si se especificaron
  if (requiredRoles.length > 0 && !hasRole(requiredRoles) && !isAdmin()) {
    // Usuario autenticado pero sin permisos
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
