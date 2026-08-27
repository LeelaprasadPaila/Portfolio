import React, { useState } from 'react';
import * as api from '../../../services/api';

const SkillsEditor = ({ skills, onUpdate, loading }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 50 });

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    const updated = [...skills, { ...newSkill, _id: undefined }];
    onUpdate('skills', updated, 'New skill added.', async () => {
      await api.createSkill(updated);
    });
    setNewSkill({ name: '', level: 50 });
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...skills];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate('skills', updated);
  };

  const handleDelete = (idx) => {
    const updated = skills.filter((_, i) => i !== idx);
    onUpdate('skills', updated, 'Skill removed.');
  };

  const handleSaveAll = () => {
    onUpdate('skills', skills, 'Skills synchronized with database.', async () => {
      for (const skill of skills) {
        if (skill._id) {
          await api.updateSkill(skill._id, skill);
        } else {
          await api.createSkill(skill);
        }
      }
    });
  };

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Technical Skills</h2>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>SKILL NAME</label>
          <input
            type="text"
            className="admin-input"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="e.g. React, Python..."
          />
        </div>
        <div className="form-group" style={{ flex: '0 0 120px' }}>
          <label>LEVEL (%)</label>
          <input
            type="number"
            className="admin-input"
            min="0"
            max="100"
            value={newSkill.level}
            onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })}
          />
        </div>
        <button className="add-btn" style={{ width: 'auto', padding: '0.8rem 2rem', margin: 0 }} onClick={handleAddSkill}>
          + ADD SKILL
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {skills.map((skill, idx) => (
          <div key={idx} className="skill-list-item">
            <div className="form-group" style={{ flex: 1 }}>
              <input
                type="text"
                className="admin-input"
                value={skill.name}
                onChange={(e) => handleFieldChange(idx, 'name', e.target.value)}
              />
            </div>
            <div className="form-group" style={{ flex: '0 0 100px' }}>
              <input
                type="number"
                className="admin-input"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => handleFieldChange(idx, 'level', parseInt(e.target.value) || 0)}
              />
            </div>
            <div style={{ minWidth: '80px', textAlign: 'center' }}>
              <div style={{
                height: '8px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${skill.level}%`,
                  background: 'linear-gradient(90deg, #00f2ff, #7c3aed)',
                  borderRadius: '4px',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
            <button className="delete-btn" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(idx)}>
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ))}
      </div>

      <button className="save-btn" style={{ marginTop: '2rem' }} onClick={handleSaveAll} disabled={loading}>
        {loading ? 'SYNCHRONIZING...' : 'SYNC ALL SKILLS'}
      </button>
    </div>
  );
};

export default SkillsEditor;