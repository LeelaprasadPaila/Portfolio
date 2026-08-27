import React, { useState } from 'react';

const TestimonialsEditor = ({ testimonials, onUpdate, loading }) => {
  const handleAdd = () => {
    const newItem = { text: 'New testimonial...', author: 'Author Name', role: 'Role' };
    onUpdate('testimonials', [newItem, ...testimonials], 'New testimonial added.');
  };

  const handleFieldChange = (idx, key, value) => {
    const updated = [...testimonials];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate('testimonials', updated);
  };

  const handleDelete = (idx) => {
    onUpdate('testimonials', testimonials.filter((_, i) => i !== idx), 'Testimonial removed.');
  };

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Testimonials</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {testimonials.map((item, idx) => (
          <div key={idx} className="cert-entry">
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>TESTIMONIAL TEXT</label>
                <textarea className="admin-input" rows="3" value={item.text} onChange={(e) => handleFieldChange(idx, 'text', e.target.value)} />
              </div>
              <div className="form-group">
                <label>AUTHOR</label>
                <input type="text" className="admin-input" value={item.author} onChange={(e) => handleFieldChange(idx, 'author', e.target.value)} />
              </div>
              <div className="form-group">
                <label>ROLE</label>
                <input type="text" className="admin-input" value={item.role || ''} onChange={(e) => handleFieldChange(idx, 'role', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button className="delete-btn" onClick={() => handleDelete(idx)}>DELETE</button>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={handleAdd}>+ ADD TESTIMONIAL</button>
    </div>
  );
};

export default TestimonialsEditor;