export const COLLECTION_NAMES = {
  USERS: 'users',
  BIO: 'bio',
  PROJECTS: 'projects',
  CERTIFICATES: 'certificates',
  INTERNSHIPS: 'internships',
  SKILLS: 'skills',
  CONTACTS: 'contacts',
};

export const FILE_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
};

export const ERROR_MESSAGES = {
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  FILE_TOO_LARGE: 'File size exceeds limit',
  INVALID_FILE_TYPE: 'Invalid file type',
};
