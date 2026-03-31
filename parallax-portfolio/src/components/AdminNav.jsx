import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AdminNav.css';

const AdminNav = ({ onLogout }) => {
  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <nav className="admin-nav">
      <div className="admin-nav-container">
        <div className="admin-logo">
          <Link to="/">Portfolio</Link>
        </div>
        <div className="admin-nav-right">
          <span className="admin-status">Admin Panel</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
