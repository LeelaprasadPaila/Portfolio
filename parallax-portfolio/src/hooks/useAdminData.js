import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

/**
 * useAdminData Hook - MongoDB ONLY (no localStorage fallback)
 * Centralized state management for admin panel with full backend sync.
 */
export const useAdminData = (isAuthenticated) => {
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Data States
  const [data, setData] = useState({
    bio: {},
    certs: [],
    projects: [],
    skills: [],
    techSkills: [],
    internships: [],
    testimonials: [],
    stats: [],
    contacts: []
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [bio, projects, certs, internships, skills, contacts] = await Promise.all([
        api.getBio(),
        api.getAllProjects(),
        api.getCertificates(),
        api.getInternships(),
        api.getSkills(),
        api.getContacts()
      ]);

      // Compute stats from actual data
      const stats = [
        { label: 'Certificates', value: Array.isArray(certs) ? certs.length : 0 },
        { label: 'Projects', value: Array.isArray(projects) ? projects.length : 0 },
        { label: 'Internships', value: Array.isArray(internships) ? internships.filter(i => i.type === 'Internship').length : 0 },
        { label: 'Experience', value: Array.isArray(internships) ? internships.filter(i => i.type === 'Experience').length : 0 }
      ];

      setData({
        bio: bio || {},
        projects: Array.isArray(projects) ? projects : [],
        certs: Array.isArray(certs) ? certs : [],
        internships: Array.isArray(internships) ? internships : [],
        skills: Array.isArray(skills) ? skills : [],
        techSkills: [],
        testimonials: [],
        stats,
        contacts: Array.isArray(contacts) ? contacts : []
      });
    } catch (error) {
      console.error('[Admin Data] Fetch error:', error);
      showNotification('Failed to load data from database: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = async (key, updatedValue, message, apiHandler) => {
    setLoading(true);
    try {
      if (apiHandler) {
        await apiHandler(updatedValue);
      }
      
      // Update local state
      setData(prev => ({ ...prev, [key]: updatedValue }));
      showNotification(message || 'Data synchronized with database.');
    } catch (err) {
      showNotification(`Sync Error: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    ...data,
    loading,
    notification,
    setData,
    handleUpdate,
    showNotification,
    refresh: fetchData
  };
};