# Render Deployment Guide - Environment Variables (MongoDB & Dynamic)

To successfully deploy your portfolio to **Render** and ensure it works dynamically with **MongoDB**, follow these steps to add the environment variables in the Render dashboard.

---

## 🏗️ 1. Backend Service (Render Web Service)
Add these variables in **Render Dashboard → Your Backend → Environment**:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production mode. |
| `PORT` | `10000` | Port for the backend (usually set automatically by Render). |
| `FRONTEND_URL` | `https://your-portfolio.onrender.com` | The URL of your deployed frontend (Vercel, Render, etc.). |
| `FRONTEND_PROD_URL`| `https://your-portfolio.onrender.com` | Duplicate of FRONTEND_URL. |
| **`MONGODB_URI`** | `mongodb+srv://admin:pass@cluster.mongodb.net/portfolio` | **CRITICAL**: Your MongoDB connection string. |
| `JWT_SECRET` | `your_long_random_secret_string` | Secret key for secure admin login. |
| `ADMIN_USERNAME` | `admin` | Username for your admin dashboard. |
| `ADMIN_PASSWORD` | `your_secure_password` | Password for your admin dashboard. |

---

## 🌐 2. Frontend Service (Render Static Site)
Add these variables in **Render Dashboard → Your Frontend → Environment**:

| Key | Value (Example) | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://your-backend.onrender.com/api` | The API endpoint of your deployed backend. |
| `VITE_API_BASE_URL`| `https://your-backend.onrender.com` | The root URL of your backend (required for image resolution). |

---

## 🛠️ Dynamic Data & Image Support
The project is now fully dynamic:
1.  **MongoDB Sync**: The backend automatically looks for the `MONGODB_URI`. If set, it will persist all your Projects, Certificates, and Bio details to the database.
2.  **Persistent Uploads**: On the Render Backend service, you **MUST** go to **Disks** and create a persistent disk mounted at `/opt/render/project/src/backend/uploads` (or equivalent) to ensure your uploaded images don't get deleted on every restart.
3.  **Real-time Admin**: The Admin Panel (once refactored) will push updates directly to the MongoDB backend, allowing you to manage your portfolio from any browser.

---

## 🚀 How to set up MongoDB Atlas (if you haven't)
1.  Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) or just Render's IP addresses.
3.  Under **Database Access**, create a user with "Read and Write to any database" permissions.
4.  Copy the connection string (e.g., `mongodb+srv://...`) and paste it into Render’s `MONGODB_URI` variable.
