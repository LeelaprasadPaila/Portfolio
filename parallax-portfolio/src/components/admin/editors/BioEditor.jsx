import React from 'react';
import * as api from '../../../services/api';

/**
 * BioEditor Component
 * MongoDB-backed identity profile management.
 */
const BioEditor = ({ bio, onUpdate, loading }) => {
  const calculatedAge = () => {
    if (!bio?.birthday) return '--';
    const birthDate = new Date(bio.birthday);
    if (isNaN(birthDate)) return '--';
    const now = new Date();
    let y = now.getFullYear() - birthDate.getFullYear();
    if (now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())) {
      y--;
    }
    return y;
  };

  const handleFieldChange = (key, value) => {
    onUpdate('bio', { ...bio, [key]: value });
  };

  const handleSave = () => {
    onUpdate('bio', bio, 'Identity Synchronized.', api.updateBio);
  };

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Identity Profile</h2>
        <div style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--primary-color)', fontSize: '0.8rem' }}>
          AUTO-AGE: <strong>{calculatedAge()}</strong>
        </div>
      </div>
      <div className="form-grid">
        {Object.keys(bio || {}).map(key => (
          <div key={key} className="form-group">
            <label>{key.toUpperCase().replace('_', ' ')}</label>
            {key === 'intro' ? (
              <textarea 
                className="admin-input" 
                rows="5" 
                value={bio[key]} 
                onChange={(e) => handleFieldChange(key, e.target.value)} 
              />
            ) : key === 'age' ? (
              <input 
                type="text" 
                className="admin-input" 
                value={calculatedAge()} 
                disabled 
                style={{ opacity: 0.5 }} 
              />
            ) : (
              <input 
                type="text" 
                className="admin-input" 
                value={bio[key]} 
                onChange={(e) => handleFieldChange(key, e.target.value)} 
              />
            )}
          </div>
        ))}
      </div>
      <button className="save-btn" onClick={handleSave} disabled={loading}>
        {loading ? 'SYNCHRONIZING...' : 'APPLY PROFILE CHANGES'}
      </button>
    </div>
  );
};

export default BioEditor;