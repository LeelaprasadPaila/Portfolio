import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { getData, STORAGE_KEYS } from '../data/dataStore';

/**
 * useAdminData Hook
 * Centralized logic for managing administrator state and backend synchronization.
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
    stats: []
  });

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [bio, projects, certs, internships, skills] = await Promise.all([
        api.getBio().catch(() => getData(STORAGE_KEYS.BIO)),
        api.getProjects().catch(() => getData(STORAGE_KEYS.PROJECTS)),
        api.getCertificates().catch(() => getData(STORAGE_KEYS.CERTS)),
        api.getInternships().catch(() => getData(STORAGE_KEYS.INTERNSHIPS)),
        api.getSkills().catch(() => getData(STORAGE_KEYS.SKILLS))
      ]);

      setData({
        bio,
        projects,
        certs,
        internships,
        skills,
        techSkills: getData(STORAGE_KEYS.TECH_SKILLS),
        testimonials: getData(STORAGE_KEYS.TESTIMONIALS),
        stats: getData(STORAGE_KEYS.STATS)
      });
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
        if (key === STORAGE_KEYS.BIO) {
          await apiHandler(updatedValue);
        } else if (Array.isArray(updatedValue)) {
          // Sync logic for lists
          for (const item of updatedValue) {
            if (item._id) {
              await api.updateById(key, item._id, item);
            } else {
              await api.createOne(key, item);
            }
          }
        }
      }
      
      // Update local state
      setData(prev => ({ ...prev, [key]: updatedValue }));
      showNotification(message || 'Synchronized with mainframe.');
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
