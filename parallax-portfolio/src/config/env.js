/**
 * Environment Configuration Engine
 * Centralized settings for Local, Test, and Production
 */

const ENV = {
  // Master Switch: Set to 'LOCAL' to bypass MongoDB, or 'REMOTE' to use Atlas
  DATA_SOURCE_OVERRIDE: 'REMOTE', 
  
  // Base URLs
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  STORAGE_URL: import.meta.env.VITE_STORAGE_URL || 'http://localhost:5000/uploads',
  
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
