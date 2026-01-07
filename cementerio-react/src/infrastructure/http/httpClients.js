// httpClients.js - cliente HTTP sencillo usando axios
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

// Configurar interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicio genérico para CRUD
const createCRUDService = (endpoint) => ({
  getAll: async (params = {}) => {
    const response = await axios.get(endpoint, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${endpoint}${id}/`);
    return response.data;
  },

  create: async (data) => {
    const response = await axios.post(endpoint, data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await axios.put(`${endpoint}${id}/`, data);
    return response.data;
  },

  patch: async (id, data) => {
    const response = await axios.patch(`${endpoint}${id}/`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${endpoint}${id}/`);
    return response.data;
  },

  search: async (searchTerm) => {
    const response = await axios.get(endpoint, { params: { search: searchTerm } });
    return response.data;
  },
});

// Servicios específicos para cada recurso
export const usuarioService = createCRUDService(API_ENDPOINTS.USUARIOS);
export const parcelaService = createCRUDService(API_ENDPOINTS.PARCELAS);
export const reservaService = createCRUDService(API_ENDPOINTS.RESERVAS);
export const pagoService = createCRUDService(API_ENDPOINTS.PAGOS);
export const difuntoService = createCRUDService(API_ENDPOINTS.DIFUNTOS);
export const authUserService = createCRUDService(API_ENDPOINTS.AUTH_USERS);

// Servicio para el perfil del usuario autenticado
export const meService = {
  get: async () => {
    const response = await axios.get(API_ENDPOINTS.ME);
    return response.data;
  },
  update: async (data) => {
    const response = await axios.patch(API_ENDPOINTS.ME, data);
    return response.data;
  },
};

const apiServices = {
  usuarios: usuarioService,
  parcelas: parcelaService,
  reservas: reservaService,
  pagos: pagoService,
  difuntos: difuntoService,
  authUsers: authUserService,
  me: meService,
};

export default apiServices;
