import React, { useState } from 'react';

const TechSkillsEditor = ({ techSkills, onUpdate, loading }) => {
  const [newCategory, setNewCategory] = useState({ title: '', icon: 'fas fa-code', skills: [] });
  const [newSkillInput, setNewSkillInput] = useState({});

  const handleAddCategory = () => {
    if (!newCategory.title.trim()) return;
    const updated = [...techSkills, { ...newCategory, skills: [] }];
    onUpdate('techSkills', updated, 'New category added.');
    setNewCategory({ title: '', icon: 'fas fa-code', skills: [] });
  };

  const handleCategoryChange = (idx, key, value) => {
    const updated = [...techSkills];
    updated[idx] = { ...updated[idx], [key]: value };
    onUpdate('techSkills', updated);
  };

  const handleAddSkill = (idx) => {
    const skillName = newSkillInput[idx]?.trim();
    if (!skillName) return;
    const updated = [...techSkills];
    updated[idx] = { ...updated[idx], skills: [...(updated[idx].skills || []), skillName] };
    onUpdate('techSkills', updated);
    setNewSkillInput({ ...newSkillInput, [idx]: '' });
  };

  const handleRemoveSkill = (catIdx, skillIdx) => {
    const updated = [...techSkills];
    updated[catIdx] = {
      ...updated[catIdx],
      skills: updated[catIdx].skills.filter((_, i) => i !== skillIdx)
    };
    onUpdate('techSkills', updated);
  };

  const handleDeleteCategory = (idx) => {
    const updated = techSkills.filter((_, i) => i !== idx);
    onUpdate('techSkills', updated, 'Category removed.');
  };

  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Specialized Expertise</h2>
      </div>

      {/* Add new category */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>CATEGORY TITLE</label>
          <input type="text" className="admin-input" value={newCategory.title} onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })} placeholder="e.g. Machine Learning & AI" />
        </div>
        <div className="form-group" style={{ flex: '0 0 150px' }}>
          <label>ICON (FontAwesome)</label>
          <input type="text" className="admin-input" value={newCategory.icon} onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })} placeholder="fas fa-brain" />
        </div>
        <button className="add-btn" style={{ width: 'auto', padding: '0.8rem 2rem', margin: 0 }} onClick={handleAddCategory}>+ ADD CATEGORY</button>
      </div>

      {/* Existing categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {techSkills.map((cat, catIdx) => (
          <div key={catIdx} className="tech-category-editor">
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>CATEGORY TITLE</label>
                <input type="text" className="admin-input" value={cat.title} onChange={(e) => handleCategoryChange(catIdx, 'title', e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label>ICON</label>
                <input type="text" className="admin-input" value={cat.icon} onChange={(e) => handleCategoryChange(catIdx, 'icon', e.target.value)} />
              </div>
              <button className="delete-btn" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDeleteCategory(catIdx)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>

            <label style={{ color: 'rgba(0, 242, 255, 0.6)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem', display: 'block' }}>SKILLS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1rem' }}>
              {(cat.skills || []).map((skill, skillIdx) => (
                <div key={skillIdx} className="nested-skill-tag">
                  <span>{skill}</span>
                  <button onClick={() => handleRemoveSkill(catIdx, skillIdx)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="admin-input"
                style={{ flex: 1, marginBottom: 0 }}
                placeholder="Add skill..."
                value={newSkillInput[catIdx] || ''}
                onChange={(e) => setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(catIdx))}
              />
              <button className="add-nested-skill" onClick={() => handleAddSkill(catIdx)}>+ ADD</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechSkillsEditor;