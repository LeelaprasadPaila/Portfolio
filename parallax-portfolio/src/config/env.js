/**
 * Environment Configuration Engine
 * Centralized settings for Local, Test, and Production
 */

const isLocalhost = typeof window !== 'undefined' && /localhost|127\.0\.0\.1/.test(window.location.hostname);

// Keeps public-folder assets working both locally and when GitHub Pages serves
// the app from /portfolio/ instead of the domain root.
export const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

const ENV = {
  // Master Switch: Set to 'LOCAL' to bypass MongoDB, or 'REMOTE' to use Atlas
  DATA_SOURCE_OVERRIDE: 'REMOTE',

  // Base URLs
  API_URL: import.meta.env.VITE_API_URL || (isLocalhost ? 'http://localhost:5000/api' : '/api'),
  STORAGE_URL: import.meta.env.VITE_STORAGE_URL || (isLocalhost ? 'http://localhost:5000/uploads' : '/uploads'),

  // Environment Flags
  IS_DEV: import.meta.env.MODE === 'development',
  IS_PROD: import.meta.env.MODE === 'production',

  // App Metadata
  APP_NAME: 'AI Architect Portfolio',
  VERSION: '2.0.0',

  // Feature Toggles
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // API Endpoints Mapping
  ENDPOINTS: {
    AUTH: '/auth',
    BIO: '/bio',
    PROJECTS: '/projects',
    CERTIFICATES: '/certificates',
    INTERNSHIPS: '/internships',
    SKILLS: '/skills',
    CONTACT: '/contacts'
  }
};

export default ENV;
