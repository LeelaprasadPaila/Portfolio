import React, { useState, useEffect } from 'react';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
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
    githubLink: '',
    videoUrl: '',
    meta: '',
    priority: false,
    archived: false,
    image: null,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getAllProjects();
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
      formDataObj.append('githubLink', formData.githubLink);
      formDataObj.append('videoUrl', formData.videoUrl);
      formDataObj.append('meta', formData.meta);
      formDataObj.append('priority', formData.priority);
      formDataObj.append('archived', formData.archived);

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
      githubLink: '',
      videoUrl: '',
      meta: '',
      priority: false,
      archived: false,
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
          { name: 'link', label: 'Live Link', type: 'url' },
          { name: 'githubLink', label: 'GitHub Link', type: 'url' },
          { name: 'videoUrl', label: 'Video URL', type: 'url' },
          { name: 'meta', label: 'Tech Meta (pipe | separated)', type: 'text' },
          { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
          { name: 'priority', label: 'Priority', type: 'checkbox' },
          { name: 'archived', label: 'Archived (hidden from public)', type: 'checkbox' },
        ]}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={loading}
        onCancel={editingId ? resetForm : null}
        submitText={editingId ? 'Update' : 'Add'}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <h2>Projects List ({projects.length})</h2>
        <button
          className="add-btn"
          onClick={async () => {
            const orderedIds = projects.map(p => p._id);
            await reorderProjects(orderedIds);
            loadProjects();
          }}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <i className="fas fa-sort"></i> Save Current Order
        </button>
      </div>
      <AdminTable
        columns={['category', 'title', 'priority', 'archived']}
        data={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraActions={(item, index) => (
          <div style={{ display: 'inline-flex', gap: '4px', marginLeft: '8px' }}>
            <button
              className="btn-sm"
              onClick={async (e) => {
                e.stopPropagation();
                if (index === 0) return;
                const arr = [...projects];
                [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
                setProjects(arr);
              }}
              title="Move Up"
              style={{ padding: '2px 8px', fontSize: '0.75rem', opacity: index === 0 ? 0.3 : 1 }}
              disabled={index === 0}
            >
              ↑
            </button>
            <button
              className="btn-sm"
              onClick={async (e) => {
                e.stopPropagation();
                if (index === projects.length - 1) return;
                const arr = [...projects];
                [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
                setProjects(arr);
              }}
              title="Move Down"
              style={{ padding: '2px 8px', fontSize: '0.75rem', opacity: index === projects.length - 1 ? 0.3 : 1 }}
              disabled={index === projects.length - 1}
            >
              ↓
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default AdminProjects;