import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { loginAdmin, setAuthToken } from '../../services/api';
import '../../styles/AdminLogin.css';

const AdminLogin = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginAdmin(username, password);
      setAuthToken(response.token);
      setIsAuthenticated(true);
      setUser(response.user);
      setPassword('');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1>Admin Dashboard</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-hint">
          <p>Tip: if your admin account is not yet created, set <code>ADMIN_USERNAME</code>, <code>ADMIN_PASSWORD</code>, and <code>ADMIN_EMAIL</code> in the backend .env, then run <code>npm run init-admin</code>.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
