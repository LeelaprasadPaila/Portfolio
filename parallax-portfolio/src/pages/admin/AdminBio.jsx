import React, { useState, useEffect } from 'react';
import {
  getBio,
  updateBio,
} from '../../services/api';
import AdminForm from '../../components/admin/AdminForm';

const AdminBio = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    intro: '',
    birthday: '',
    phone: '',
    city: '',
    degree: '',
    email: '',
    freelance: '',
    quote: '',
  });

  useEffect(() => {
    loadBio();
  }, []);

  const loadBio = async () => {
    try {
      setLoading(true);
      const data = await getBio();
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      alert('Error loading bio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateBio(formData);
      alert('Bio updated successfully!');
      loadBio();
    } catch (error) {
      alert('Error saving bio: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section">
      <h2>Edit Bio Information</h2>
      
      <AdminForm
        title="Bio Form"
        fields={[
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'intro', label: 'Introduction', type: 'textarea' },
          { name: 'birthday', label: 'Birthday', type: 'text', placeholder: 'DD MMM YYYY' },
          { name: 'phone', label: 'Phone', type: 'text' },
          { name: 'city', label: 'City', type: 'text' },
          { name: 'degree', label: 'Degree', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'freelance', label: 'Freelance Status', type: 'text' },
          { name: 'quote', label: 'Quote', type: 'textarea' },
        ]}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText="Update Bio"
      />
    </div>
  );
};

export default AdminBio;
