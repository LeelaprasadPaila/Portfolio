import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { setAuthToken } from '../../services/api';
import AdminNav from '../../components/AdminNav';
import AdminProjects from './AdminProjects';
import AdminCertificates from './AdminCertificates';
import AdminInternships from './AdminInternships';
import AdminSkills from './AdminSkills';
import AdminBio from './AdminBio';
import AdminContacts from './AdminContacts';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    // Ensure token is still valid
    const token = localStorage.getItem('portfolio_auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'internships', label: 'Internships' },
    { id: 'skills', label: 'Skills' },
    { id: 'bio', label: 'Bio' },
    { id: 'contacts', label: 'Contacts' },
  ];

  return (
    <div className="admin-dashboard">
      <AdminNav onLogout={logout} />

      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <span className="brand-dot" />
            <span className="brand-label">Admin Panel</span>
          </div>

          <nav className="sidebar-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <div className="admin-content">
            {activeTab === 'projects' && <AdminProjects />}
            {activeTab === 'certificates' && <AdminCertificates />}
            {activeTab === 'internships' && <AdminInternships />}
            {activeTab === 'skills' && <AdminSkills />}
            {activeTab === 'bio' && <AdminBio />}
            {activeTab === 'contacts' && <AdminContacts />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
