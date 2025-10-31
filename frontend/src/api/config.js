// API Configuration
// Create axios instance with default config
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid - only redirect if it's a protected endpoint
      const protectedEndpoints = [
        '/auth/profile',
        '/cart',
        '/orders',
        '/reviews/my-reviews',
      ];

      const isProtectedEndpoint = protectedEndpoints.some(endpoint =>
        error.config?.url?.includes(endpoint)
      );

      if (isProtectedEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
