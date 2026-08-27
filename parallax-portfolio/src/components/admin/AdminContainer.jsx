import React, { useState } from 'react';
import BioEditor from './editors/BioEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import SkillsEditor from './editors/SkillsEditor';
import CertificatesEditor from './editors/CertificatesEditor';
import InternshipsEditor from './editors/InternshipsEditor';
import TechSkillsEditor from './editors/TechSkillsEditor';
import TestimonialsEditor from './editors/TestimonialsEditor';
import StatsEditor from './editors/StatsEditor';

/**
 * AdminContainer
 * Main dashboard shell for the administrator command center.
 * All data is fetched from and synced to MongoDB via the API layer.
 */
const AdminContainer = ({ adminData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('bio');
  const { bio, projects, certs, skills, techSkills, internships, testimonials, stats, loading, notification, handleUpdate } = adminData;

  const tabs = [
    { id: 'bio', label: 'PROFILE', icon: 'fa-user' },
    { id: 'skills', label: 'SKILL MASTERY', icon: 'fa-percentage' },
    { id: 'tech', label: 'SPECIALIZED EXPERTISE', icon: 'fa-th' },
    { id: 'projects', label: 'PROJECTS', icon: 'fa-project-diagram' },
    { id: 'certs', label: 'ACHIEVEMENTS', icon: 'fa-certificate' },
    { id: 'testimonials', label: 'KIND WORDS', icon: 'fa-quote-right' },
    { id: 'stats', label: 'METRICS', icon: 'fa-chart-line' },
    { id: 'internships', label: 'INTERNSHIPS', icon: 'fa-briefcase' }
  ];

  const renderActiveEditor = () => {
    switch (activeTab) {
      case 'bio':
        return <BioEditor bio={bio} onUpdate={handleUpdate} loading={loading} />;
      case 'projects':
        return <ProjectsEditor projects={projects} onUpdate={handleUpdate} loading={loading} />;
      case 'skills':
        return <SkillsEditor skills={skills} onUpdate={handleUpdate} loading={loading} />;
      case 'certs':
        return <CertificatesEditor certs={certs} onUpdate={handleUpdate} loading={loading} />;
      case 'internships':
        return <InternshipsEditor internships={internships} onUpdate={handleUpdate} loading={loading} />;
      case 'tech':
        return <TechSkillsEditor techSkills={techSkills} onUpdate={handleUpdate} loading={loading} />;
      case 'testimonials':
        return <TestimonialsEditor testimonials={testimonials} onUpdate={handleUpdate} loading={loading} />;
      case 'stats':
        return <StatsEditor stats={stats} />;
      default:
        return (
          <div className="admin-section-card" style={{ textAlign: 'center', opacity: 0.5 }}>
            <i className={`fas ${tabs.find(t => t.id === activeTab).icon} fa-4x`} style={{ marginBottom: '2rem' }}></i>
            <h2>{tabs.find(t => t.id === activeTab).label} EDITOR</h2>
            <p>Component ready for data from database.</p>
          </div>
        );
    }
  };

  return (
    <div className="admin-gateway">
      {notification && <div className={`admin-toast ${notification.type}`}><i className="fas fa-check-circle"></i> {notification.msg}</div>}

      <div className="admin-sidebar">
        <div className="sidebar-title">
          <i className="fas fa-shield-alt" style={{ marginRight: '12px', fontSize: '1.4rem' }}></i>
          COMMAND CENTER
        </div>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <button className="delete-btn" style={{ width: '100%', fontSize: '0.7rem', opacity: 0.6 }} onClick={onLogout}>LOGOUT SESSION</button>
        </div>
      </div>

      <div className="admin-main-content">
        <div className="admin-dashboard">
          <div className="dashboard-header">
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>{tabs.find(t => t.id === activeTab).label}</h1>
              <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem', fontSize: '0.9rem' }}>MongoDB-backed real-time modifications.</p>
            </div>
          </div>
          {renderActiveEditor()}
        </div>
      </div>
    </div>
  );
};

export default AdminContainer;