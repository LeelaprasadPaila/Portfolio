/**
 * Specialized Portfolio API Layer
 * Centralized interface for backend communication with dynamic caching and environment awareness.
 */

import ENV, { assetUrl } from '../config/env';
import { STORAGE_KEYS, getData } from '../data/dataStore';

const API_URL = ENV.API_URL;
const CACHE_ENABLED = !ENV.IS_DEV;
const cache = new Map();

// Token management
export const getAuthToken = () => localStorage.getItem('portfolio_auth_token');
export const setAuthToken = (token) => localStorage.setItem('portfolio_auth_token', token);
export const clearAuthToken = () => localStorage.removeItem('portfolio_auth_token');

/**
 * Unified API Caller
 * handles headers, auth tokens, caching and response parsing.
 */
const apiCall = async (endpoint, options = {}) => {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  
  // Return cached data if available (simple cache-first strategy)
  if (isGet && CACHE_ENABLED && cache.has(endpoint)) {
    return cache.get(endpoint);
  }

  const token = getAuthToken();
  const headers = {
    'Content-Type': options.headers?.['Content-Type'] || 'application/json',
    ...options.headers,
  };

  if (token && !headers['Authorization']) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // Emit loading start event (delta +1)
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('api:loading', { detail: { delta: 1 } }));
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Portfolio-API Exception: ${response.status}`);
    }

    // Cache successful GET results
    if (isGet && CACHE_ENABLED) {
      cache.set(endpoint, data);
    }

    return data;
  } catch (error) {
    console.error(`[API-ERROR] ${endpoint}:`, error.message);
    throw error;
  } finally {
    // Emit loading end event (delta -1)
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('api:loading', { detail: { delta: -1 } }));
      }
    } catch (_) {
      // noop
    }
  }
};


// File URL helper
export const getFileUrl = (path) => {
  if (!path) return null;
  // External URLs or data URIs
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // Static assets in public folder (e.g., images/...)
  if (path.startsWith('images/')) return assetUrl(path);
  
  // Uploaded files served from backend uploads directory
  return `${ENV.STORAGE_URL}/${path.split('/').pop()}`;
};

// Auth API
export const loginAdmin = (username, password) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const verifyAuth = () => apiCall('/auth/verify');

// Contact API
export const submitContactForm = (payload) =>
  apiCall('/contacts/submit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getContacts = () => apiCall('/contacts');

export const updateContactStatus = (id, data) =>
  apiCall(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteContact = (id) =>
  apiCall(`/contacts/${id}`, {
    method: 'DELETE',
  });

// Bio API
export const getBio = () => apiCall('/bio');
export const updateBio = (bioData) =>
  apiCall('/bio', {
    method: 'PUT',
    body: JSON.stringify(bioData),
  });

const normalizeListResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.projects)) return data.projects;
  if (data && Array.isArray(data.internships)) return data.internships;
  if (data && Array.isArray(data.certificates)) return data.certificates;
  if (data && Array.isArray(data.skills)) return data.skills;
  return [];
};

const getLocalFallbackList = (key, archivedFilter = false) => {
  const fallback = getData(key);
  if (!Array.isArray(fallback)) return [];
  return archivedFilter ? fallback.filter(item => !item.archived) : fallback;
};

// Projects API
// Public: backend already filters archived projects, but filter defensively too
export const getProjects = async () => {
  try {
    const projects = normalizeListResponse(await apiCall('/projects'));
    const visibleProjects = Array.isArray(projects) ? projects.filter(p => !p.archived) : [];
    if (visibleProjects.length > 0) return visibleProjects;
  } catch (error) {
    console.warn('[API] /projects failed, using local fallback.', error.message);
  }
  return getLocalFallbackList(STORAGE_KEYS.PROJECTS, true);
};

// Admin-only: Get ALL projects including archived ones
export const getAllProjects = async () => normalizeListResponse(await apiCall('/projects/all'));

export const createProject = (formData) =>
  apiCall('/projects', {
    method: 'POST',
    body: formData,
  });


export const updateProject = (id, formData) =>
  apiCall(`/projects/${id}`, {
    method: 'PUT',
    body: formData,
  });

export const deleteProject = (id) =>
  apiCall(`/projects/${id}`, {
    method: 'DELETE',
  });

export const reorderProjects = (orderedIds) =>
  apiCall('/projects/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  });

// Internships API
export const getInternships = async () => {
  try {
    const internships = normalizeListResponse(await apiCall('/internships'));
    const visibleInternships = Array.isArray(internships) ? internships.filter(i => !i.archived) : [];
    if (visibleInternships.length > 0) return visibleInternships;
  } catch (error) {
    console.warn('[API] /internships failed, using local fallback.', error.message);
  }
  return getLocalFallbackList(STORAGE_KEYS.INTERNSHIPS, true);
};

export const getAllInternships = async () => normalizeListResponse(await apiCall('/internships/all'));

export const createInternship = (formData) =>
  apiCall('/internships', {
    method: 'POST',
    body: formData,
  });

export const updateInternship = (id, formData) =>
  apiCall(`/internships/${id}`, {
    method: 'PUT',
    body: formData,
  });

export const deleteInternship = (id) =>
  apiCall(`/internships/${id}`, {
    method: 'DELETE',
  });

export const reorderInternships = (orderedIds) =>
  apiCall('/internships/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderedIds }),
  });

// Skills API
export const getSkills = async () => normalizeListResponse(await apiCall('/skills'));


export const createSkill = (formData) =>
  apiCall('/skills', {
    method: 'POST',
    body: formData,
  });

export const updateSkill = (id, formData) =>
  apiCall(`/skills/${id}`, {
    method: 'PUT',
    body: formData,
  });

export const deleteSkill = (id) =>
  apiCall(`/skills/${id}`, {
    method: 'DELETE',
  });

// Certificates API
export const getCertificates = async () => {
  try {
    const certificates = normalizeListResponse(await apiCall('/certificates?limit=1000'));
    const visibleCertificates = Array.isArray(certificates) ? certificates.filter(c => !c.archived) : [];
    if (visibleCertificates.length > 0) return visibleCertificates;
  } catch (error) {
    console.warn('[API] /certificates failed, using local fallback.', error.message);
  }
  return getLocalFallbackList(STORAGE_KEYS.CERTS, true);
};

export const getAllCertificates = async () => normalizeListResponse(await apiCall('/certificates/all'));

export const createCertificate = (formData) =>
  apiCall('/certificates', {
    method: 'POST',
    body: formData,
  });

export const updateCertificate = (id, formData) =>
  apiCall(`/certificates/${id}`, {
    method: 'PUT',
    body: formData,
  });

export const deleteCertificate = (id) =>
  apiCall(`/certificates/${id}`, {
    method: 'DELETE',
  });

// ... and other endpoints follow the same pattern

// Generic sync helpers for the Admin panel
export const createOne = async (key, item) => {
  const map = {
    [STORAGE_KEYS.PROJECTS]: '/projects',
    [STORAGE_KEYS.CERTS]: '/certificates',
    [STORAGE_KEYS.INTERNSHIPS]: '/internships',
    [STORAGE_KEYS.TECH_SKILLS]: '/skills',
    [STORAGE_KEYS.BIO]: '/bio',
  };
  return apiCall(map[key], { method: 'POST', body: JSON.stringify(item) });
};

export const updateById = async (key, id, item) => {
  const map = {
    [STORAGE_KEYS.PROJECTS]: `/projects/${id}`,
    [STORAGE_KEYS.CERTS]: `/certificates/${id}`,
    [STORAGE_KEYS.INTERNSHIPS]: `/internships/${id}`,
    [STORAGE_KEYS.TECH_SKILLS]: `/skills/${id}`,
    [STORAGE_KEYS.BIO]: `/bio`,
  };
  return apiCall(map[key], { method: 'PUT', body: JSON.stringify(item) });
};

export { STORAGE_KEYS };

// ====== AI Knowledge Base API ======

/**
 * Get AI knowledge base training status
 */
export const getAIStatus = () => apiCall('/ai/status');

/**
 * Get full AI knowledge base for client-side initialization
 */
export const getAIKnowledge = () => apiCall('/ai/knowledge');

/**
 * Trigger immediate AI training (admin only - requires auth)
 */
export const trainAI = () =>
  apiCall('/ai/train/sync', {
    method: 'POST',
  });

/**
 * Start async AI training (admin only - returns immediately)
 */
export const trainAIAsync = () =>
  apiCall('/ai/train', {
    method: 'POST',
  });

/**
 * Query the AI knowledge base with a question
 */
export const queryAI = (question) =>
  apiCall('/ai/query', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};
