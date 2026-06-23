import React, { useState, useEffect } from 'react';
import AdminLogin from './admin/AdminLogin';
import AdminContainer from './admin/AdminContainer';
import { useAdminData } from '../hooks/useAdminData';
import * as api from '../services/api';
import '../styles/Admin.css';

/**
 * Admin Component (New Entry Point)
 * Refactored into a high-level orchestration layer.
 */
const Admin = ({ onNavClick }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!api.getAuthToken());
  const adminData = useAdminData(isAuthenticated);

  const handleLogout = () => {
    api.clearAuthToken();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        onAuthSuccess={() => setIsAuthenticated(true)}
        onBackToPortfolio={() => onNavClick('home')}
        loading={adminData.loading}
        notification={adminData.notification}
      />
    );
  }

  return (
    <AdminContainer 
      adminData={adminData} 
      onLogout={handleLogout} 
    />
  );
};

export default Admin;
