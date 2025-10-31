import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../custom-hooks/useAdminAuth';

const AdminGuard = ({ children }) => {
  const { isAuthenticated, admin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and is admin
  // Check for both 'role' and 'user_role' for compatibility
  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check admin role
  const isAdmin = admin.role === 'admin' ;
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminGuard;

