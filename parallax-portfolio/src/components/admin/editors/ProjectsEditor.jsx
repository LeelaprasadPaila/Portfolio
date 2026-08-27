import React, { useState } from 'react';
import * as api from '../../../services/api';

/**
 * ProjectsEditor
 * MongoDB-backed portfolio project management with filtering, image upload, and real-time sync.
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
      image: null,
      link: '#',
      githubLink: '',
      videoUrl: '',
      meta: 'Python | React',
      priority: false,
      archived: false
    };
    onUpdate('projects', [newProject, ...projects], 'New Project Entry Initialized.');
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...projects];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate('projects', updated);
  };

  const handleImageUpload = (idx, file) => {
    if (!file) return;
    const updated = [...projects];
    updated[idx] = { ...updated[idx], imageFile: file, image: file.name };
    onUpdate('projects', updated);
  };

  const handleMoveUp = (idx) => {
    if (idx === 0) return;
    const updated = [...projects];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    onUpdate('projects', updated);
  };

  const handleMoveDown = (idx) => {
    if (idx === projects.length - 1) return;
    const updated = [...projects];
    [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
    onUpdate('projects', updated);
  };

  const handleDelete = (idx) => {
    const item = projects[idx];
    if (item._id) {
      api.deleteProject(item._id).catch(console.error);
    }
    onUpdate('projects', projects.filter((_, i) => i !== idx), 'Project Entry Redacted.');
  };

  const handleSave = () => {
    // Assign sortOrder based on array index before syncing
    const itemsWithOrder = projects.map((item, index) => ({
      ...item,
      sortOrder: index
    }));
    onUpdate('projects', itemsWithOrder, 'Projects synchronized with database.', async () => {
      for (const project of itemsWithOrder) {
        const { imageFile, ...projectData } = project;
        
        if (project._id) {
          if (imageFile) {
            // Use FormData for image upload
            const formData = new FormData();
            Object.keys(projectData).forEach(key => {
              if (projectData[key] !== undefined && projectData[key] !== null) {
                formData.append(key, projectData[key]);
              }
            });
            formData.append('image', imageFile);
            await api.updateProject(project._id, formData);
          } else {
            await api.updateProject(project._id, projectData);
          }
        } else {
          if (imageFile) {
            const formData = new FormData();
            Object.keys(projectData).forEach(key => {
              if (projectData[key] !== undefined && projectData[key] !== null) {
                formData.append(key, projectData[key]);
              }
            });
            formData.append('image', imageFile);
            await api.createProject(formData);
          } else {
            await api.createProject(projectData);
          }
        }
      }
    });
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
                  <label>LIVE LINK</label>
                  <input type="text" className="admin-input" value={project.link} onChange={(e) => handleFieldChange(idx, 'link', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>GITHUB LINK</label>
                  <input type="text" className="admin-input" value={project.githubLink || ''} onChange={(e) => handleFieldChange(idx, 'githubLink', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>VIDEO URL</label>
                  <input type="text" className="admin-input" value={project.videoUrl || ''} onChange={(e) => handleFieldChange(idx, 'videoUrl', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>PROJECT IMAGE</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="admin-input"
                    onChange={(e) => handleImageUpload(idx, e.target.files[0])}
                  />
                  {project.image && !project.imageFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                      Current: {project.image}
                    </div>
                  )}
                  {project.imageFile && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#00f2ff' }}>
                      New image selected: {project.imageFile.name}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>PRIORITY</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={project.priority || false} onChange={(e) => handleFieldChange(idx, 'priority', e.target.checked)} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Featured</span>
                  </label>
                </div>
                <div className="form-group">
                  <label>ARCHIVED</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={project.archived || false} onChange={(e) => handleFieldChange(idx, 'archived', e.target.checked)} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Hidden from public</span>
                  </label>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>DESCRIPTION</label>
                <textarea className="admin-input" rows="3" value={project.desc} onChange={(e) => handleFieldChange(idx, 'desc', e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn-sm"
                    onClick={() => handleMoveUp(idx)}
                    disabled={idx === 0}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                    title="Move Up"
                  >
                    ↑ Move Up
                  </button>
                  <button
                    className="btn-sm"
                    onClick={() => handleMoveDown(idx)}
                    disabled={idx === projects.length - 1}
                    style={{ padding: '6px 12px', fontSize: '0.8rem', opacity: idx === projects.length - 1 ? 0.3 : 1, cursor: idx === projects.length - 1 ? 'not-allowed' : 'pointer' }}
                    title="Move Down"
                  >
                    ↓ Move Down
                  </button>
                </div>
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