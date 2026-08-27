import React, { useState, useEffect } from 'react';
import {
  getAllInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  reorderInternships,
} from '../../services/api';
import AdminForm from '../../components/admin/AdminForm';
import AdminTable from '../../components/admin/AdminTable';

const AdminInternships = () => {
  const [internships, setInternships] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Internship',
    company: '',
    role: '',
    duration: '',
    desc: '',
    link: '',
    priority: false,
    archived: false,
    image: null,
  });

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      const data = await getAllInternships();
      setInternships(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Error loading internships: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append('type', formData.type);
      formDataObj.append('company', formData.company);
      formDataObj.append('role', formData.role);
      formDataObj.append('duration', formData.duration);
      formDataObj.append('desc', formData.desc);
      formDataObj.append('link', formData.link);
      formDataObj.append('priority', formData.priority);
      formDataObj.append('archived', formData.archived);

      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }

      if (editingId) {
        await updateInternship(editingId, formDataObj);
      } else {
        await createInternship(formDataObj);
      }

      resetForm();
      loadInternships();
    } catch (error) {
      alert('Error saving internship: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this internship?')) {
      try {
        await deleteInternship(id);
        loadInternships();
      } catch (error) {
        alert('Error deleting internship: ' + error.message);
      }
    }
  };

  const handleEdit = (internship) => {
    setFormData({ ...internship, image: null });
    setEditingId(internship._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({
      type: 'Internship',
      company: '',
      role: '',
      duration: '',
      desc: '',
      link: '',
      priority: false,
      archived: false,
      image: null,
    });
    setEditingId(null);
  };

  return (
    <div className="admin-section">
      <h2>{editingId ? 'Edit' : 'Add'} Internship</h2>
      
      <AdminForm
        title="Internship Form"
        fields={[
          { name: 'type', label: 'Type', type: 'select', options: ['Internship', 'Experience'] },
          { name: 'company', label: 'Company', type: 'text', required: true },
          { name: 'role', label: 'Role', type: 'text', required: true },
          { name: 'duration', label: 'Duration', type: 'text' },
          { name: 'desc', label: 'Description', type: 'textarea' },
          { name: 'link', label: 'Link', type: 'url' },
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
        <h2>Internships List ({internships.length})</h2>
        <button
          className="add-btn"
          onClick={async () => {
            const orderedIds = internships.map(i => i._id);
            await reorderInternships(orderedIds);
            loadInternships();
          }}
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          <i className="fas fa-sort"></i> Save Current Order
        </button>
      </div>
      <AdminTable
        columns={['type', 'company', 'role', 'priority', 'archived']}
        data={internships}
        onEdit={handleEdit}
        onDelete={handleDelete}
        extraActions={(item, index) => (
          <div style={{ display: 'inline-flex', gap: '4px', marginLeft: '8px' }}>
            <button
              className="btn-sm"
              onClick={async (e) => {
                e.stopPropagation();
                if (index === 0) return;
                const arr = [...internships];
                [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
                setInternships(arr);
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
                if (index === internships.length - 1) return;
                const arr = [...internships];
                [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
                setInternships(arr);
              }}
              title="Move Down"
              style={{ padding: '2px 8px', fontSize: '0.75rem', opacity: index === internships.length - 1 ? 0.3 : 1 }}
              disabled={index === internships.length - 1}
            >
              ↓
            </button>
          </div>
        )}
      />
    </div>
  );
};

export default AdminInternships;
