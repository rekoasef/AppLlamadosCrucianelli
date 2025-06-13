// frontend/src/services/api.ts

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Más adelante, aquí configuraremos los interceptors para añadir
// automáticamente el token de autenticación a cada petición.

export default api;