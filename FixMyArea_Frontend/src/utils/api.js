import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4009/v1/api',
  timeout: 15000,
});

// Attach token on every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('fma_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fma_token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const getAttachmentUrl = (photoPath) => {
  if (!photoPath) return '';
  const baseUrl = api.defaults.baseURL || 'http://localhost:4009/v1/api';
  const serverUrl = baseUrl.replace('/v1/api', '');
  const cleanPath = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
  const cleanServerUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl;
  return `${cleanServerUrl}${cleanPath}`;
};

export default api;
