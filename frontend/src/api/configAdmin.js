// Admin API Configuration
// Separate axios instance for admin that uses adminToken
import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create separate axios instance for admin
const adminApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add admin token
adminApiClient.interceptors.request.use(
  config => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
adminApiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Admin token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      // Redirect to admin login
      // if (window.location.pathname.startsWith('/admin')) {
      //   window.location.href = '/admin/login';
      // }
    }
    return Promise.reject(error);
  }
);

export default adminApiClient;
