import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    // Check if token exists but not authenticated (can happen on page refresh)
    // AuthContext will verify automatically
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminPage;
