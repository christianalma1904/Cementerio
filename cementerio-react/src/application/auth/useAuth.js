// useAuth.js - reexporta el hook existente si está presente
try {
  module.exports = require('../../contexts/AuthContext').useAuth;
} catch (e) {
  // fallback simple
  module.exports = function useAuth() {
    return { user: null, login: () => {}, logout: () => {}, isAuthenticated: false };
  };
}
