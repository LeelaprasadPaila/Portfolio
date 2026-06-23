import React, { useState } from 'react';
import { STORAGE_KEYS } from '../../../data/dataStore';
import * as api from '../../../services/api';

/**
 * ProjectsEditor
 * Advanced portfolio management with filtering and real-time backend sync.
 */
const ProjectsEditor = ({ projects, onUpdate, loading }) => {
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = [...new Set(projects.map(p => p.category))];

  const handleAddField = () => {
    const newProject = {
      category: 'Machine Learning',
      title: 'New Portfolio Project',
      desc: 'Project overview and objectives...',
      image: 'images/projects/project-1-thumb.png',
      link: '#',
      meta: 'Python | React'
    };
    onUpdate(STORAGE_KEYS.PROJECTS, [newProject, ...projects], 'New Project Entry Initialized locally.');
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...projects];
    updated[idx][key] = value;
    onUpdate(STORAGE_KEYS.PROJECTS, updated);
  };

  const handleDelete = (idx) => {
    onUpdate(STORAGE_KEYS.PROJECTS, projects.filter((_, i) => i !== idx), 'Project Entry Redacted.');
  };

  const handleSave = () => {
    onUpdate(STORAGE_KEYS.PROJECTS, projects, 'Projects Mainframe Synchronized.', api.createProject);
  };

  const filteredProjects = projects.filter(p => 
    (categoryFilter === 'All' || p.category === categoryFilter) && 
    p.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Project Portfolio</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select
            className="admin-input"
            style={{ width: '150px', marginBottom: 0 }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <i className="fas fa-search" style={{ marginLeft: '10px', opacity: 0.4 }}></i>
            <input
              type="text"
              placeholder="Search title..."
              className="admin-input"
              style={{ width: '200px', marginBottom: 0, background: 'transparent', border: 'none' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredProjects.map((project) => {
          const idx = projects.indexOf(project);
          return (
            <div key={idx} className="tech-category-editor" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>CATEGORY</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={project.category}
                    onChange={(e) => handleFieldChange(idx, 'category', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>TITLE</label>
                  <input type="text" className="admin-input" value={project.title} onChange={(e) => handleFieldChange(idx, 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>TECH META</label>
                  <input type="text" className="admin-input" value={project.meta} onChange={(e) => handleFieldChange(idx, 'meta', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>IMAGE URL</label>
                  <input type="text" className="admin-input" value={project.image} onChange={(e) => handleFieldChange(idx, 'image', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>LIVE LINK</label>
                  <input type="text" className="admin-input" value={project.link} onChange={(e) => handleFieldChange(idx, 'link', e.target.value)} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>DESCRIPTION</label>
                <textarea className="admin-input" rows="3" value={project.desc} onChange={(e) => handleFieldChange(idx, 'desc', e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button className="delete-btn" onClick={() => handleDelete(idx)}>DELETE PROJECT</button>
              </div>
            </div>
          );
        })}
      </div>
      <button className="add-btn" style={{ marginBottom: '5rem' }} onClick={handleAddField}>+ DEPLOY NEW PROJECT ENTRY</button>
      <button className="save-btn" 
              style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }} 
              onClick={handleSave} 
              disabled={loading}>
        {loading ? 'SYNCHRONIZING...' : 'SYNC PROJECT DATA'}
      </button>
    </div>
  );
};

export default ProjectsEditor;
