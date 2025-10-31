import { useState, useEffect, createContext, useContext } from 'react';
import { adminAPI } from '../api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  // Check if admin is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if admin is authenticated
  const checkAuth = async () => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      try {
        const adminData = localStorage.getItem('admin');
        if (adminData) {
          const user = JSON.parse(adminData);
          // Verify user is still admin and has valid token
          if (user.role === 'admin' && user.id) {
            setAdmin(user);
            setToken(adminToken);
          } else {
            // Not admin or invalid
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            setToken(null);
            setAdmin(null);
          }
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        setToken(null);
        setAdmin(null);
      }
    }
    setLoading(false);
  };

  // Login function
  const login = async credentials => {
    try {
      const response = await adminAPI.login(credentials);
      const { user, token: authToken } = response.data;

      // Check if user is admin
      if (user.role !== 'admin') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        throw new Error('Access denied. Admin privileges required.');
      }

      localStorage.setItem('adminToken', authToken);
      localStorage.setItem('admin', JSON.stringify(user));

      setToken(authToken);
      setAdmin(user);

      return response;
    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      setToken(null);
      setAdmin(null);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setToken(null);
    setAdmin(null);
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!admin && !!token,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

