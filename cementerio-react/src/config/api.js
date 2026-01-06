// Configuración de la API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/api/auth/login/`,
  AUTH_USERS: `${API_BASE_URL}/api/auth-users/`,
  ME: `${API_BASE_URL}/api/me/`,
  
  // Recursos
  USUARIOS: `${API_BASE_URL}/api/usuarios/`,
  PARCELAS: `${API_BASE_URL}/api/parcelas/`,
  RESERVAS: `${API_BASE_URL}/api/reservas/`,
  PAGOS: `${API_BASE_URL}/api/pagos/`,
  DIFUNTOS: `${API_BASE_URL}/api/difuntos/`,
};

export default API_BASE_URL;
