# Portfolio Backend API

Complete backend API for portfolio with CRUD operations, file uploads, and email notifications.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`

3. Run development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with password
- `GET /api/auth/verify` - Verify token (protected)

### Bio
- `GET /api/bio` - Get bio info
- `PUT /api/bio` - Update bio (protected)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (protected, with file upload)
- `PUT /api/projects/:id` - Update project (protected, with file upload)
- `DELETE /api/projects/:id` - Delete project (protected)

### Certificates
- `GET /api/certificates` - Get all certificates
- `POST /api/certificates` - Create certificate (protected, with file upload)
- `PUT /api/certificates/:id` - Update certificate (protected, with file upload)
- `DELETE /api/certificates/:id` - Delete certificate (protected)

### Internships
- `GET /api/internships` - Get all internships
- `POST /api/internships` - Create internship (protected, with file upload)
- `PUT /api/internships/:id` - Update internship (protected, with file upload)
- `DELETE /api/internships/:id` - Delete internship (protected)

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (protected)
- `PUT /api/skills/:id` - Update skill (protected)
- `DELETE /api/skills/:id` - Delete skill (protected)

### Contacts
- `GET /api/contacts` - Get all contacts (protected)
- `POST /api/contacts/submit` - Submit contact form
- `PUT /api/contacts/:id` - Update contact status (protected)
- `DELETE /api/contacts/:id` - Delete contact (protected)

## Deployment

See main README.md for deployment instructions.
