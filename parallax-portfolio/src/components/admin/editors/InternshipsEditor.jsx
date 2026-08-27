import React, { useState } from 'react';
import * as api from '../../../services/api';

const InternshipsEditor = ({ internships, onUpdate, loading }) => {
  const [filter, setFilter] = useState('');

  const handleAdd = () => {
    const newItem = {
      type: 'Internship',
      company: 'New Company',
      role: 'Position',
      duration: 'Month Year - Month Year',
      desc: 'Description...',
      link: '#',
      priority: false,
      technologies: [],
      achievements: []
    };
    onUpdate('internships', [newItem, ...internships], 'New entry initialized.');
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...internships];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate('internships', updated);
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...internships];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    onUpdate('internships', updated);
  };

  const handleMoveDown = (idx) => {
    if (idx === internships.length - 1) return;
    const updated = [...internships];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    onUpdate('internships', updated);
  };

  const handleDelete = (idx) => {
    const item = internships[idx];
    if (item._id) {
      api.deleteInternship(item._id).catch(console.error);
    }
    onUpdate('internships', internships.filter((_, i) => i !== idx), 'Entry removed.');
  };

  const handleSaveAll = () => {
    // Assign sortOrder based on array index before syncing
    const itemsWithOrder = internships.map((item, index) => ({
      ...item,
      sortOrder: index
    }));
    onUpdate('internships', itemsWithOrder, 'Internships synchronized.', async () => {
      for (const item of itemsWithOrder) {
        if (item._id) {
          await api.updateInternship(item._id, item);
        } else {
          await api.createInternship(item);
        }
      }
    });
  };

  const filtered = internships.filter(i =>
    i.company?.toLowerCase().includes(filter.toLowerCase()) ||
    i.role?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Internships & Experience</h2>
        <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <i className="fas fa-search" style={{ marginLeft: '10px', opacity: 0.4 }}></i>
          <input type="text" placeholder="Search..." className="admin-input" style={{ width: '200px', marginBottom: 0, background: 'transparent', border: 'none' }} value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filtered.map((item, idx) => {
          const realIdx = internships.indexOf(item);
          return (
            <div key={realIdx} className="tech-category-editor">
              <div className="form-grid">
                <div className="form-group">
                  <label>TYPE</label>
                  <select className="admin-input" value={item.type} onChange={(e) => handleFieldChange(realIdx, 'type', e.target.value)}>
                    <option value="Internship">Internship</option>
                    <option value="Experience">Experience</option>
                    <option value="Research">Research</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>COMPANY</label>
                  <input type="text" className="admin-input" value={item.company} onChange={(e) => handleFieldChange(realIdx, 'company', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>ROLE</label>
                  <input type="text" className="admin-input" value={item.role} onChange={(e) => handleFieldChange(realIdx, 'role', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>DURATION</label>
                  <input type="text" className="admin-input" value={item.duration} onChange={(e) => handleFieldChange(realIdx, 'duration', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>LINK</label>
                  <input type="text" className="admin-input" value={item.link || ''} onChange={(e) => handleFieldChange(realIdx, 'link', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>PRIORITY</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={item.priority || false} onChange={(e) => handleFieldChange(realIdx, 'priority', e.target.checked)} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Featured</span>
                  </label>
                </div>
              </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label>DESCRIPTION</label>
                  <textarea className="admin-input" rows="3" value={item.desc} onChange={(e) => handleFieldChange(realIdx, 'desc', e.target.value)} />
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label>TECHNOLOGIES (comma-separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={Array.isArray(item.technologies) ? item.technologies.join(', ') : ''}
                    onChange={(e) => handleFieldChange(realIdx, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="e.g. Python, React, Node.js"
                  />
                </div>
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label>ACHIEVEMENTS (one per line)</label>
                  <textarea
                    className="admin-input"
                    rows="4"
                    value={Array.isArray(item.achievements) ? item.achievements.join('\n') : ''}
                    onChange={(e) => handleFieldChange(realIdx, 'achievements', e.target.value.split('\n').map(a => a.trim()).filter(Boolean))}
                    placeholder="Led a team of 5 developers&#10;Increased efficiency by 30%&#10;Deployed to production"
                  />
                </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-sm"
                    onClick={() => handleMoveUp(realIdx)}
                    disabled={realIdx === 0}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: realIdx === 0 ? 0.3 : 1, cursor: realIdx === 0 ? 'not-allowed' : 'pointer' }}
                    title="Move Up"
                  >
                    ↑ Move Up
                  </button>
                  <button
                    className="btn-sm"
                    onClick={() => handleMoveDown(realIdx)}
                    disabled={realIdx === internships.length - 1}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: realIdx === internships.length - 1 ? 0.3 : 1, cursor: realIdx === internships.length - 1 ? 'not-allowed' : 'pointer' }}
                    title="Move Down"
                  >
                    ↓ Move Down
                  </button>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(realIdx)}>DELETE</button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="add-btn" style={{ marginBottom: '5rem' }} onClick={handleAdd}>+ ADD ENTRY</button>
      <button className="save-btn" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }} onClick={handleSaveAll} disabled={loading}>
        {loading ? 'SYNCHRONIZING...' : 'SYNC INTERNSHIPS'}
      </button>
    </div>
  );
};

export default InternshipsEditor;