import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  Warning as WarningIcon,
  Delete as DeleteIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = '¿Está seguro?',
  message = '¿Desea continuar con esta acción?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  severity = 'warning',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (severity) {
      case 'error':
      case 'danger':
        return <DeleteIcon sx={{ fontSize: 28 }} />;
      case 'warning':
      default:
        return <WarningIcon sx={{ fontSize: 28 }} />;
    }
  };

  const getColors = () => {
    switch (severity) {
      case 'error':
      case 'danger':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          buttonBg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
          buttonHover: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        };
      case 'warning':
      default:
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          color: '#f59e0b',
          buttonBg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
          buttonHover: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
        };
    }
  };

  const colors = getColors();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              bgcolor: colors.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.color,
            }}
          >
            {getIcon()}
          </Box>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: '#f8fafc',
            '&:hover': { bgcolor: '#f1f5f9' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography color="text.secondary" sx={{ pl: 7 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions 
        sx={{ 
          p: 2.5, 
          pt: 1,
          gap: 1,
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            color: '#64748b',
            borderColor: '#e2e8f0',
            '&:hover': {
              bgcolor: '#f8fafc',
              borderColor: '#cbd5e1',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ 
            background: colors.buttonBg,
            boxShadow: `0 4px 14px ${colors.color}50`,
            '&:hover': { 
              background: colors.buttonHover,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
