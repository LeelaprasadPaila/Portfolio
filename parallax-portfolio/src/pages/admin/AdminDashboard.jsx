import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { setAuthToken, trainAI, getAIStatus } from '../../services/api';
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
  const [aiStatus, setAiStatus] = useState({ trained: false, version: null, lastTrainedAt: null });
  const [aiSyncing, setAiSyncing] = useState(false);
  const [aiStatusLoading, setAiStatusLoading] = useState(true);
  const [aiStatusError, setAiStatusError] = useState(null);

  // Fetch AI status on mount
  useEffect(() => {
    checkAIStatus();
  }, []);

  const checkAIStatus = async () => {
    setAiStatusLoading(true);
    setAiStatusError(null);
    try {
      const status = await getAIStatus();
      setAiStatus(status);
    } catch (e) {
      // AI backend route not available yet - that's okay
      setAiStatus({ trained: false, version: null, lastTrainedAt: null });
      setAiStatusError(null);
    } finally {
      setAiStatusLoading(false);
    }
  };

  useEffect(() => {
    // Ensure token is still valid
    const token = localStorage.getItem('portfolio_auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const handleSyncAI = async () => {
    if (aiSyncing) return;
    setAiSyncing(true);
    setAiStatusError(null);
    try {
      const result = await trainAI();
      console.log('[Admin] AI training result:', result);
      // Refresh status
      await checkAIStatus();
      
      // Show success via a temporary state
      setAiStatus(prev => ({
        ...prev,
        trained: true,
        version: result.version || prev.version,
        lastTrainedAt: result.lastTrainedAt || new Date().toISOString(),
      }));
      
      // Flash effect feedback
      const btn = document.querySelector('.ai-sync-btn');
      if (btn) {
        btn.classList.add('syncing');
        setTimeout(() => btn.classList.remove('syncing'), 2000);
      }
    } catch (e) {
      setAiStatusError(e.message || 'Sync failed. Is the backend running?');
      console.error('[Admin] AI Sync Error:', e);
    } finally {
      setAiSyncing(false);
    }
  };

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'internships', label: 'Internships' },
    { id: 'skills', label: 'Skills' },
    { id: 'bio', label: 'Bio' },
    { id: 'contacts', label: 'Contacts' },
  ];

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminNav onLogout={logout} />

      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <span className="brand-dot" />
            <span className="brand-label">Command Center</span>
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

          {/* AI Sync Section */}
          <div className="ai-sync-section">
            <div className="ai-sync-header">
              <span className="ai-sync-icon">🧠</span>
              <span className="ai-sync-title">JARVIS Knowledge Base</span>
            </div>
            
            <div className="ai-sync-status">
              {aiStatusLoading ? (
                <span className="ai-sync-status-text loading">Checking status...</span>
              ) : (
                <>
                  <span className={`ai-sync-status-dot ${aiStatus.trained ? 'ready' : 'offline'}`} />
                  <span className="ai-sync-status-text">
                    {aiStatus.trained ? `Trained • v${aiStatus.version || '?'}` : 'Not trained'}
                  </span>
                </>
              )}
            </div>

            <div className="ai-sync-meta">
              <span className="ai-sync-label">Last trained:</span>
              <span className="ai-sync-value">{formatDate(aiStatus.lastTrainedAt)}</span>
            </div>

            {aiStatusError && (
              <div className="ai-sync-error">{aiStatusError}</div>
            )}

            <button
              className={`ai-sync-btn ${aiSyncing ? 'syncing' : ''}`}
              onClick={handleSyncAI}
              disabled={aiSyncing || aiStatusLoading}
            >
              {aiSyncing ? (
                <>
                  <span className="ai-sync-spinner" />
                  Training Knowledge Base...
                </>
              ) : (
                <>
                  <span className="ai-sync-icon-small">⚡</span>
                  Sync AI Data Now
                </>
              )}
            </button>
          </div>
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
