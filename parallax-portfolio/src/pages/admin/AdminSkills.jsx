import React, { useState, useEffect } from 'react';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../../services/api';
import AdminForm from '../../components/admin/AdminForm';
import AdminTable from '../../components/admin/AdminTable';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    icon: '',
    skills: '',
  });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Error loading skills: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const skillsArray = typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(s => s)
        : formData.skills;

      const skillData = {
        category: formData.category,
        title: formData.title,
        icon: formData.icon,
        skills: skillsArray,
      };

      if (editingId) {
        await updateSkill(editingId, skillData);
      } else {
        await createSkill(skillData);
      }

      resetForm();
      loadSkills();
    } catch (error) {
      alert('Error saving skill: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this skill?')) {
      try {
        await deleteSkill(id);
        loadSkills();
      } catch (error) {
        alert('Error deleting skill: ' + error.message);
      }
    }
  };

  const handleEdit = (skill) => {
    setFormData({
      ...skill,
      skills: Array.isArray(skill.skills) ? skill.skills.join(', ') : skill.skills,
    });
    setEditingId(skill._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      icon: '',
      skills: '',
    });
    setEditingId(null);
  };

  return (
    <div className="admin-section">
      <h2>{editingId ? 'Edit' : 'Add'} Skill</h2>
      
      <AdminForm
        title="Skill Form"
        fields={[
          { name: 'category', label: 'Category', type: 'text', required: true },
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'icon', label: 'Icon Class', type: 'text', placeholder: 'fas fa-code' },
          { name: 'skills', label: 'Skills (comma-separated)', type: 'textarea', placeholder: 'Python, JavaScript, React' },
        ]}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={loading}
        onCancel={editingId ? resetForm : null}
        submitText={editingId ? 'Update' : 'Add'}
      />

      <h2>Skills List ({skills.length})</h2>
      <AdminTable
        columns={['category', 'title']}
        data={skills}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminSkills;
