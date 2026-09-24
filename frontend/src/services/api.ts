import axios from 'axios';
import { BackendType } from '../types';

export const BACKEND_CONFIG: Record<BackendType, { name: string; url: string; port: number }> = {
  springboot: { name: 'Spring Boot (Java + PostgreSQL)', url: 'http://localhost:8080/api', port: 8080 },
  node: { name: 'Node.js (Express + MongoDB)', url: 'http://localhost:5000/api', port: 5000 },
  go: { name: 'Go (Gin + MySQL)', url: 'http://localhost:8081/api', port: 8081 }
};

// Default backend or from localStorage
export const getActiveBackend = (): BackendType => {
  if (typeof window === 'undefined') return 'springboot';
  return (localStorage.getItem('quantum_backend') as BackendType) || 'springboot';
};

export const setActiveBackend = (backend: BackendType) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('quantum_backend', backend);
    window.location.reload();
  }
};

export const getBaseURL = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  const backend = getActiveBackend();
  return BACKEND_CONFIG[backend]?.url || 'http://localhost:8080/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('quantum_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor: purge broken/expired tokens on 401 or 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response && (error.response.status === 401 || error.response.status === 403)) {
      const token = localStorage.getItem('quantum_token');
      if (token && (token.startsWith('demo-jwt-token') || window.location.pathname.startsWith('/admin'))) {
        localStorage.removeItem('quantum_token');
        localStorage.removeItem('quantum_user');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/login?redirect=/admin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
