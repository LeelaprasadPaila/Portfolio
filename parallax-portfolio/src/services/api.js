/**
 * Specialized Portfolio API Layer
 * Centralized interface for backend communication with dynamic caching and environment awareness.
 */

import ENV from '../config/env';
import { STORAGE_KEYS } from '../data/dataStore';

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

  try {
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
  }
};


// File URL helper
export const getFileUrl = (path) => {
  if (!path) return null;
  // External URLs or data URIs
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // Static assets in public folder (e.g., images/...)
  if (path.startsWith('images/')) return `/${path}`;
  
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
  apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getContacts = () => apiCall('/contact');

export const updateContactStatus = (id, data) =>
  apiCall(`/contact/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteContact = (id) =>
  apiCall(`/contact/${id}`, {
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

// Projects API
export const getProjects = async () => normalizeListResponse(await apiCall('/projects'));

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

// Internships API
export const getInternships = async () => normalizeListResponse(await apiCall('/internships'));

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
export const getCertificates = async () => normalizeListResponse(await apiCall('/certificates?limit=1000'));

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

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};
