import React, { useState, useEffect } from 'react';
import {
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../../services/api';
import AdminForm from '../../components/admin/AdminForm';
import AdminTable from '../../components/admin/AdminTable';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    issuer: '',
    issueDate: '',
    key: '',
    priority: false,
    archived: false,
    image: null,
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const data = await getAllCertificates();
      setCertificates(Array.isArray(data) ? data : []);
    } catch (error) {
      alert('Error loading certificates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('category', formData.category);
      formDataObj.append('description', formData.description);
      formDataObj.append('issuer', formData.issuer);
      formDataObj.append('issueDate', formData.issueDate);
      formDataObj.append('key', formData.key);
      formDataObj.append('priority', formData.priority);
      formDataObj.append('archived', formData.archived);

      if (formData.image instanceof File) {
        formDataObj.append('image', formData.image);
      }

      if (editingId) {
        await updateCertificate(editingId, formDataObj);
      } else {
        await createCertificate(formDataObj);
      }

      resetForm();
      loadCertificates();
    } catch (error) {
      alert('Error saving certificate: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this certificate?')) {
      try {
        await deleteCertificate(id);
        loadCertificates();
      } catch (error) {
        alert('Error deleting certificate: ' + error.message);
      }
    }
  };

  const handleEdit = (cert) => {
    setFormData({ ...cert, image: null });
    setEditingId(cert._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFieldChange = (name, value, type, checked, files) => {
    if (name === 'category') {
      handleCategoryChange(value);
      return true; // Prevent default handling
    }
    return false; // Allow default handling
  };

  const getFields = () => {
    const baseFields = [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'issuer', label: 'Issuer', type: 'text' },
      { name: 'issueDate', label: 'Issue Date', type: 'date' },
      { name: 'image', label: 'Image', type: 'file', accept: 'image/*' },
      { name: 'priority', label: 'Priority', type: 'checkbox' },
      { name: 'archived', label: 'Archived (hidden from public)', type: 'checkbox' },
    ];

    // Add license key field only for licensed certificates
    if (formData.category === 'licensed') {
      baseFields.splice(5, 0, {
        name: 'key',
        label: 'License Key/Certification Number',
        type: 'text',
        placeholder: 'Enter license key or certification number',
        required: true
      });
    }

    return baseFields;
  };

  return (
    <div className="admin-section">
      <h2>{editingId ? 'Edit' : 'Add'} Certificate</h2>
      
      <AdminForm
        title="Certificate Form"
        fields={getFields()}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={loading}
        onCancel={editingId ? resetForm : null}
        submitText={editingId ? 'Update' : 'Add'}
        onFieldChange={handleFieldChange}
      />

      <h2>Certificates List ({certificates.length})</h2>
      <AdminTable
        columns={['title', 'category', 'priority', 'archived']}
        data={certificates}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminCertificates;
