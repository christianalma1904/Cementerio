import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Card,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  FilterList,
} from '@mui/icons-material';

const DataTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  title,
  searchable = true,
  actions = true,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filtrar datos por búsqueda
  const filteredData = data.filter((row) =>
    columns.some((col) => {
      const value = row[col.field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  // Ordenar datos
  const sortedData = [...filteredData].sort((a, b) => {
    if (!orderBy) return 0;
    const aVal = a[orderBy];
    const bVal = b[orderBy];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginar datos
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getChipStyles = (value) => {
    const styles = {
      DISPONIBLE: { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      OCUPADA: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
      RESERVADA: { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
      PENDIENTE: { bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
      CONFIRMADA: { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      CANCELADA: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
      PAGADO: { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      ANULADO: { bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
      ADMIN: { bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
      CLIENTE: { bgcolor: 'rgba(100, 116, 139, 0.1)', color: '#64748b' },
      EFECTIVO: { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      TARJETA: { bgcolor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
      TRANSFERENCIA: { bgcolor: 'rgba(13, 148, 136, 0.1)', color: '#0d9488' },
      Activo: { bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
      Inactivo: { bgcolor: 'rgba(100, 116, 139, 0.1)', color: '#64748b' },
    };
    return styles[value] || { bgcolor: 'rgba(100, 116, 139, 0.1)', color: '#64748b' };
  };

  const renderCellValue = (row, column) => {
    const value = row[column.field];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.type === 'chip') {
      const chipStyle = getChipStyles(value);
      return (
        <Chip
          label={value}
          size="small"
          sx={{
            ...chipStyle,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />
      );
    }
    
    if (column.type === 'currency') {
      return (
        <Typography variant="body2" fontWeight={600} sx={{ color: '#10b981' }}>
          ${parseFloat(value).toFixed(2)}
        </Typography>
      );
    }
    
    if (column.type === 'date') {
      return value ? new Date(value).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : '-';
    }
    
    return value ?? '-';
  };

  // Vista de cards para móvil
  const renderMobileCards = () => (
    <Box sx={{ p: 2 }}>
      {paginatedData.length === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            No hay datos disponibles
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Intenta ajustar los filtros de búsqueda
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {paginatedData.map((row, index) => (
            <Card
              key={row.id || row.id_usuario || row.id_parcela || row.id_reserva || row.id_pago || row.id_difunto || index}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #f1f5f9',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {/* Contenido de la card */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {columns.slice(0, 4).map((column) => (
                  <Box key={column.field} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                      {column.label}
                    </Typography>
                    <Box sx={{ textAlign: 'right' }}>
                      {renderCellValue(row, column)}
                    </Box>
                  </Box>
                ))}
              </Box>
              
              {/* Acciones */}
              {actions && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    {onView && (
                      <Tooltip title="Ver detalles">
                        <IconButton 
                          size="small" 
                          onClick={() => onView(row)}
                          sx={{
                            bgcolor: 'rgba(99, 102, 241, 0.1)',
                            color: '#6366f1',
                            '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' },
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onEdit && (
                      <Tooltip title="Editar">
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(row)}
                          sx={{
                            bgcolor: 'rgba(13, 148, 136, 0.1)',
                            color: '#0d9488',
                            '&:hover': { bgcolor: 'rgba(13, 148, 136, 0.2)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {onDelete && (
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete(row)}
                          sx={{
                            bgcolor: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </>
              )}
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );

  // Vista de tabla para desktop
  const renderDesktopTable = () => (
    <TableContainer sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="medium">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                align={column.align || 'left'}
                style={{ minWidth: column.minWidth }}
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#64748b',
                  bgcolor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  py: 2,
                }}
              >
                {column.sortable !== false ? (
                  <TableSortLabel
                    active={orderBy === column.field}
                    direction={orderBy === column.field ? order : 'asc'}
                    onClick={() => handleSort(column.field)}
                    sx={{
                      '&.Mui-active': { color: '#6366f1' },
                      '& .MuiTableSortLabel-icon': { color: '#6366f1 !important' },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                ) : (
                  column.label
                )}
              </TableCell>
            ))}
            {actions && (
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#64748b',
                  bgcolor: '#f8fafc',
                  borderBottom: '2px solid #e2e8f0',
                  py: 2,
                }}
              >
                Acciones
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 1 : 0)} align="center">
                <Box sx={{ py: 6 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No hay datos disponibles
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Intenta ajustar los filtros de búsqueda
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((row, index) => (
              <TableRow 
                hover 
                key={row.id || row.id_usuario || row.id_parcela || row.id_reserva || row.id_pago || row.id_difunto || index}
                sx={{
                  '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.04)' },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.field} 
                    align={column.align || 'left'}
                    sx={{ py: 2, borderBottom: '1px solid #f1f5f9' }}
                  >
                    {renderCellValue(row, column)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell 
                    align="center"
                    sx={{ py: 2, borderBottom: '1px solid #f1f5f9' }}
                  >
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      {onView && (
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small" 
                            onClick={() => onView(row)}
                            sx={{
                              bgcolor: 'rgba(99, 102, 241, 0.1)',
                              color: '#6366f1',
                              '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.2)' },
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onEdit && (
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            onClick={() => onEdit(row)}
                            sx={{
                              bgcolor: 'rgba(13, 148, 136, 0.1)',
                              color: '#0d9488',
                              '&:hover': { bgcolor: 'rgba(13, 148, 136, 0.2)' },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            onClick={() => onDelete(row)}
                            sx={{
                              bgcolor: 'rgba(239, 68, 68, 0.1)',
                              color: '#ef4444',
                              '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)' },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Card 
      sx={{ 
        width: '100%', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        borderRadius: 3,
      }}
    >
      {/* Header con búsqueda */}
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        {title && (
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        )}
        {searchable && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              fullWidth={isMobile}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                minWidth: { xs: '100%', sm: 280 },
                '& .MuiOutlinedInput-root': {
                  bgcolor: '#f8fafc',
                  borderRadius: 2,
                }
              }}
            />
            <Tooltip title="Filtros">
              <IconButton sx={{ bgcolor: '#f8fafc' }}>
                <FilterList sx={{ color: '#64748b' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
      
      {/* Contenido: Cards en móvil, Tabla en desktop */}
      {isMobile ? renderMobileCards() : renderDesktopTable()}
      
      {/* Paginación */}
      <TablePagination
        rowsPerPageOptions={isMobile ? [5, 10] : [5, 10, 25, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={isMobile ? "Filas:" : "Filas por página:"}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={{
          borderTop: '1px solid #f1f5f9',
          '& .MuiTablePagination-toolbar': {
            px: 2,
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' },
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            color: '#64748b',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          },
        }}
      />
    </Card>
  );
};

export default DataTable;
