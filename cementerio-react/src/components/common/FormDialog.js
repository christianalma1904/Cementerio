import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';

const FormDialog = ({
  open,
  onClose,
  onSubmit,
  title,
  children,
  submitText = 'Guardar',
  cancelText = 'Cancelar',
  maxWidth = 'sm',
  loading = false,
  icon = null,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            pb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {icon && (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366f1',
                }}
              >
                {icon}
              </Box>
            )}
            <Box sx={{ fontWeight: 600 }}>{title}</Box>
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
        <DialogContent sx={{ pt: 3 }}>
          <Box>{children}</Box>
        </DialogContent>
        <DialogActions 
          sx={{ 
            p: 2.5, 
            borderTop: '1px solid #f1f5f9',
            gap: 1,
          }}
        >
          <Button 
            onClick={onClose} 
            disabled={loading}
            sx={{ 
              color: '#64748b',
              borderColor: '#e2e8f0',
              '&:hover': {
                bgcolor: '#f8fafc',
                borderColor: '#cbd5e1',
              },
            }}
            variant="outlined"
          >
            {cancelText}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            sx={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              '&:hover': { 
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              },
              '&:disabled': {
                background: '#e2e8f0',
              }
            }}
          >
            {loading ? 'Guardando...' : submitText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FormDialog;
