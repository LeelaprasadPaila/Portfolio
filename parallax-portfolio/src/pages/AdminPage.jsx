import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

const AdminPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useContext(AuthContext);

  const [error, setError] = React.useState(null);

  useEffect(() => {
    // If the backend is slow, it might take time to verify
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
        color: 'white',
        textAlign: 'center',
        gap: '1rem'
      }}>
        <div className="loader" style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid rgba(0, 242, 255, 0.1)',
          borderTop: '4px solid #00f2ff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>COMMAND CENTER WAKING UP...</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>This can take up to 45s on first load (Render Free Tier)</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }


  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
};

export default AdminPage;
