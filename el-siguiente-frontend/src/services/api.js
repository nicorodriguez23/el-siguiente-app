// src/services/api.js
import axios from "axios";

// Detecta si estamos en producción (Vercel) o en local
const isProduction = import.meta.env.PROD;

// URL base del backend
export const API_BASE_URL = isProduction
  ? "https://el-siguiente-backend.onrender.com/api"
  : "http://localhost:4000/api";

// Claves de localStorage
export const LS_USER_KEY = "el_siguiente_usuario";
export const LS_TOKEN_KEY = "el_siguiente_token";

// Instancia de Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor: agrega el token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(LS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
