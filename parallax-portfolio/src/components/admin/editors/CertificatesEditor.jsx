import React, { useState } from 'react';
import * as api from '../../../services/api';

const CertificatesEditor = ({ certs, onUpdate, loading }) => {
  const [filter, setFilter] = useState('');

  const handleAdd = () => {
    const newCert = {
      title: 'New Certificate',
      category: 'course',
      description: 'Certificate description...',
      issuer: 'Issuer Name',
      issueDate: new Date().toISOString().split('T')[0],
      key: '',
      priority: false
    };
    onUpdate('certs', [newCert, ...certs], 'New certificate entry initialized.');
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...certs];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate('certs', updated);
  };

  const handleDelete = (idx) => {
    const item = certs[idx];
    if (item._id) {
      api.deleteCertificate(item._id).catch(console.error);
    }
    onUpdate('certs', certs.filter((_, i) => i !== idx), 'Certificate removed.');
  };

  const handleSaveAll = () => {
    onUpdate('certs', certs, 'Certificates synchronized with database.', async () => {
      for (const cert of certs) {
        if (cert._id) {
          await api.updateCertificate(cert._id, cert);
        } else {
          await api.createCertificate(cert);
        }
      }
    });
  };

  const filteredCerts = certs.filter(c =>
    c.title?.toLowerCase().includes(filter.toLowerCase()) ||
    c.issuer?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
        <h2 style={{ margin: 0 }}>Certificates & Achievements</h2>
        <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <i className="fas fa-search" style={{ marginLeft: '10px', opacity: 0.4 }}></i>
          <input
            type="text"
            placeholder="Search..."
            className="admin-input"
            style={{ width: '200px', marginBottom: 0, background: 'transparent', border: 'none' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredCerts.map((cert, idx) => {
          const realIdx = certs.indexOf(cert);
          return (
            <div key={realIdx} className="cert-entry">
              <div className="form-grid">
                <div className="form-group">
                  <label>TITLE</label>
                  <input type="text" className="admin-input" value={cert.title} onChange={(e) => handleFieldChange(realIdx, 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>CATEGORY</label>
                  <select className="admin-input" value={cert.category} onChange={(e) => handleFieldChange(realIdx, 'category', e.target.value)}>
                    <option value="course">Course</option>
                    <option value="licensed">Licensed</option>
                    <option value="achievement">Achievement</option>
                    <option value="certification">Certification</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>ISSUER</label>
                  <input type="text" className="admin-input" value={cert.issuer || ''} onChange={(e) => handleFieldChange(realIdx, 'issuer', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>ISSUE DATE</label>
                  <input type="date" className="admin-input" value={cert.issueDate ? cert.issueDate.split('T')[0] : ''} onChange={(e) => handleFieldChange(realIdx, 'issueDate', e.target.value)} />
                </div>
                {cert.category === 'licensed' && (
                  <div className="form-group">
                    <label>LICENSE KEY</label>
                    <input type="text" className="admin-input" value={cert.key || ''} onChange={(e) => handleFieldChange(realIdx, 'key', e.target.value)} />
                  </div>
                )}
                <div className="form-group">
                  <label>PRIORITY</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={cert.priority || false} onChange={(e) => handleFieldChange(realIdx, 'priority', e.target.checked)} />
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Featured</span>
                  </label>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>DESCRIPTION</label>
                <textarea className="admin-input" rows="3" value={cert.description || ''} onChange={(e) => handleFieldChange(realIdx, 'description', e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button className="delete-btn" onClick={() => handleDelete(realIdx)}>DELETE</button>
              </div>
            </div>
          );
        })}
      </div>

      <button className="add-btn" style={{ marginBottom: '5rem' }} onClick={handleAdd}>+ ADD CERTIFICATE</button>
      <button className="save-btn" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }} onClick={handleSaveAll} disabled={loading}>
        {loading ? 'SYNCHRONIZING...' : 'SYNC CERTIFICATES'}
      </button>
    </div>
  );
};

export default CertificatesEditor;