import React, { useState, useEffect } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../services/api';
import AdminForm from '../../components/admin/AdminForm';
import AdminTable from '../../components/admin/AdminTable';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    desc: '',
    link: '',
    meta: '',
    priority: false,
    image: null,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Error loading projects: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append('category', formData.category);
      formDataObj.append('title', formData.title);
      formDataObj.append('desc', formData.desc);
      formDataObj.append('link', formData.link);
      formDataObj.append('meta', formData.meta);
      formDataObj.append('priority', formData.priority);

      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }

      if (editingId) {
        await updateProject(editingId, formDataObj);
      } else {
        await createProject(formDataObj);
      }

      resetForm();
      loadProjects();
    } catch (error) {
      alert('Error saving project: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this project?')) {
      try {
        await deleteProject(id);
        loadProjects();
      } catch (error) {
        alert('Error deleting project: ' + error.message);
      }
    }
  };

  const handleEdit = (project) => {
    setFormData({ ...project, image: null });
    setEditingId(project._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      category: '',
      title: '',
      desc: '',
      link: '',
      meta: '',
      priority: false,
      image: null,
    });
    setEditingId(null);
  };

  return (
    <div className="admin-section">
      <h2>{editingId ? 'Edit' : 'Add'} Project</h2>
      
      <AdminForm
        title="Project Form"
        fields={[
          { name: 'category', label: 'Category', type: 'text', required: true },
          { name: 'title', label: 'Title', type: 'text', required: true },
          { name: 'desc', label: 'Description', type: 'textarea' },
          { name: 'link', label: 'Link', type: 'url' },
          { name: 'meta', label: 'Meta Info', type: 'text' },
          { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
          { name: 'priority', label: 'Priority', type: 'checkbox' },
        ]}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={loading}
        onCancel={editingId ? resetForm : null}
        submitText={editingId ? 'Update' : 'Add'}
      />

      <h2>Projects List ({projects.length})</h2>
      <AdminTable
        columns={['category', 'title', 'priority']}
        data={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminProjects;
