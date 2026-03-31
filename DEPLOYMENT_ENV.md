ī# Render Deployment Guide - Environment Variables

To successfully deploy your portfolio and ensure it works dynamically, please set the following environment variables in the Render dashboard for each service.

---

## 🏗️ 1. Backend Deployment (Web Service)

### A. Environment Variables
In the **Render Dashboard → Your Backend Service → Environment**, add these keys:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode. |
| `PORT` | `10000` | Port for the backend (Render usually sets this automatically). |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | Your MongoDB connection string. |
| `JWT_SECRET` | `your_long_random_secret_string` | Secret key for admin login. |
| `FRONTEND_URL` | `https://your-portfolio.onrender.com` | URL of your deployed frontend (Static Site). |
| `FRONTEND_PROD_URL`| `https://your-portfolio.onrender.com` | Duplicate of FRONTEND_URL. |

### ⚠️ Note on Persistent Uploads
Files uploaded via the Admin panel (images, certificates) are saved to the `backend/uploads/` folder. **On Render, these files will be DELETED every time the service restarts** unless you:
1.  **Add a Disk**: In Render Dashboard → Disks, create a disk and mount it to `/opt/render/project/src/backend/uploads` (or the equivalent path where your app is running).
2.  **Use Cloudinary**: Alternatively, you can modify the code to use Cloudinary for persistent image hosting.

---

## 🌐 2. Frontend Deployment (Static Site)

### A. Environment Variables
In the **Render Dashboard → Your Frontend Service → Environment**, add these keys:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | The API endpoint of your deployed backend. |
| `VITE_API_BASE_URL`| `https://your-backend.onrender.com` | The base URL of your backend (no `/api`). |

### B. Build Settings
-   **Build Command**: `npm run build`
-   **Publish Directory**: `dist`

---

## 🧪 Testing Locally vs Production
The code is already configured to be dynamic:
-   **Frontend**: `src/services/api.js` uses `import.meta.env.VITE_API_URL` with a fallback to `localhost:5000`.
-   **Backend**: `src/server.js` uses `process.env.FRONTEND_URL` for CORS and dynamically serves the `/uploads` folder.

**Summary of Image Loading Logic**:
-   Paths starting with `images/` are loaded from the frontend's `public` folder.
-   All other paths are resolved by the backend URL: `VITE_API_URL` (stripped of `/api`) + `/uploads/` + filename.

### 🚀 Implementation Status
✅ Frontend code is fully dynamic.
✅ Backend code is fully dynamic.
✅ `.gitignore` updated to exclude development `.env` files.
