const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Token management
export const getAuthToken = () => localStorage.getItem('portfolio_auth_token');
export const setAuthToken = (token) => localStorage.setItem('portfolio_auth_token', token);
export const clearAuthToken = () => localStorage.removeItem('portfolio_auth_token');

// Base API call
const apiCall = async (endpoint, options = {}) => {
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

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API error: ${response.status}`);
  }

  return data;
};

// File URL helper
export const getFileUrl = (path) => {
  if (!path) return null;
  // External URLs or data URIs
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // Static assets in public folder (e.g., images/...)
  if (path.startsWith('images/')) return `/${path}`;
  // Uploaded files served from backend uploads directory
  const baseUrl = API_URL.replace('/api', '');
  return `${baseUrl}/uploads/${path.split('/').pop()}`;
};

// Auth API
export const loginAdmin = (username, password) =>
  apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const verifyAuth = () => apiCall('/auth/verify');

// Bio API
export const getBio = () => apiCall('/bio');
export const updateBio = (bioData) =>
  apiCall('/bio', {
    method: 'PUT',
    body: JSON.stringify(bioData),
  });

// Projects API
export const getProjects = () => apiCall('/projects');

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

// Certificates API
export const getCertificates = () => apiCall('/certificates');

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

// Internships API
export const getInternships = () => apiCall('/internships');

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
export const getSkills = () => apiCall('/skills');

export const createSkill = (skillData) =>
  apiCall('/skills', {
    method: 'POST',
    body: JSON.stringify(skillData),
  });

export const updateSkill = (id, skillData) =>
  apiCall(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(skillData),
  });

export const deleteSkill = (id) =>
  apiCall(`/skills/${id}`, {
    method: 'DELETE',
  });

// Contacts API
export const submitContactForm = (contactData) =>
  apiCall('/contacts/submit', {
    method: 'POST',
    body: JSON.stringify(contactData),
  });

export const getContacts = () => apiCall('/contacts');

export const updateContactStatus = (id, statusData) =>
  apiCall(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(statusData),
  });

export const deleteContact = (id) =>
  apiCall(`/contacts/${id}`, {
    method: 'DELETE',
  });

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
};
