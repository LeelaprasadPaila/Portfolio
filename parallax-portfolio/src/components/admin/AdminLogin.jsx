import React, { useState } from 'react';
import * as api from '../../services/api';

/**
 * AdminLogin Gateway
 * Handles authentication for the command center.
 */
const AdminLogin = ({ onAuthSuccess, onBackToPortfolio, loading: externalLoading, notification }) => {
  const [credentials, setCredentials] = useState({ username: 'admin', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.loginAdmin(credentials.username, credentials.password);
      if (data.token) {
        api.setAuthToken(data.token);
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-gateway" style={{ justifyContent: 'center', alignItems: 'center' }}>
      {notification && <div className={`admin-toast ${notification.type}`}>{notification.msg}</div>}
      <div className="admin-login-card">
        <h1>SECURE ACCESS</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="admin-input"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
            autoComplete="username"
          />
          <input
            type="password"
            className="admin-input"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
            autoComplete="current-password"
          />
          <button type="submit" className="save-btn" style={{ width: '100%' }} disabled={loading || externalLoading}>
            {loading || externalLoading ? 'ESTABLISHING...' : 'ESTABLISH LINK'}
          </button>
        </form>
        <button
          onClick={onBackToPortfolio}
          style={{ 
            marginTop: '2rem', 
            background: 'transparent', 
            border: 'none', 
            color: 'rgba(255,255,255,0.3)', 
            cursor: 'pointer', 
            fontSize: '0.8rem' 
          }}
        >
          ← Back to Portfolio
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
