# 🚀 Portfolio System: Step-By-Step Render Deployment Guide

This guide ensures your **Frontend**, **Backend**, and **MongoDB** database are correctly connected and running in production.

---

## 🏗️ Phase 1: MongoDB Setup (The Database)
1.  **Sign up** at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create a New Cluster** (select the FREE tier).
3.  **Network Access**: Go to "Network Access" → "Add IP Address" → Select **"Allow Access From Anywhere"** (0.0.0.0/0). This allows Render to connect.
4.  **Database Access**: Create a database user (e.g., `admin_user`) and give them a strong password.
5.  **Get Connection String**: Go to "Database" → "Connect" → "Drivers" → Copy the string that looks like:  
    `mongodb+srv://admin_user:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    > [!IMPORTANT]
    > Replace `<db_password>` with your actual user's password in the string before using it!

---

## ⚙️ Phase 2: Deploy the Backend (The Motor)
On [Render.com](https://render.com/):
1.  **New** → **Web Service**.
2.  Connect your GitHub Repo: **LeelaprasadPaila/Portfolio**.
3.  **App Name**: `portfolio-backend` (or similar).
4.  **Root Directory**: `backend` (CRITICAL).
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start`
7.  **Environment Variables**:
    - `MONGODB_URI`: *Paste your connection string from Phase 1.*
    - `FRONTEND_URL`: *The URL Render is giving you for the Frontend (we will get this in the next phase, but you can update it later).*
    - `FRONTEND_PROD_URL`: *(Same as FRONTEND_URL).*
    - `JWT_SECRET`: *A long random string (e.g., `8d2f1gH5...`).*
    - `ADMIN_USERNAME`: `admin`
    - `ADMIN_PASSWORD`: *Your choice (used for Admin Dashboard login).*
8.  **Disk (Persistence)**:
    - Go to "Disks" → "Add Disk".
    - **Name**: `portfolio-uploads`.
    - **Mount Path**: `/opt/render/project/src/backend/uploads`.
    - **Size**: 1GB (Free tier friendly).

---

## 🌐 Phase 3: Deploy the Frontend (The Visuals)
The repository's `render.yaml` defines a combined static site named `portfolio-site`. Use it to create that service, or match its name when syncing an existing Blueprint-managed service. For a dashboard-managed service, apply the same build command, publish directory, environment variables, and rewrite rules in the Render dashboard.

The build compiles the existing Landing Page component in `landing` mode and the full Portfolio in `portfolio` mode, then assembles them into `render-dist/` at `/` and `/portfolio/`. The Landing Page does not yet have a separate source project; its current source component remains in the Portfolio Vite project. Do not configure the frontend service with `parallax-portfolio` as its Root Directory or `dist` as its Publish Directory: that would publish the wrong directory for the required root-plus-`/portfolio` URL layout.

Set the Blueprint's prompted environment variables:
- `VITE_API_URL`: `https://YOUR-BACKEND-URL.onrender.com/api`
- `VITE_STORAGE_URL`: `https://YOUR-BACKEND-URL.onrender.com/uploads`

The Blueprint includes rewrites for `/portfolio` and `/portfolio/*` to the Portfolio `index.html`, allowing React Router to handle direct navigation and refreshes without changing the browser URL. The backend remains a separate Render Web Service.

---

## ✅ Phase 4: Finalizing the Admin Login
Once both services are "Live":
1.  Visit `https://YOUR-FRONTEND-URL/portfolio/`.
2.  Navigate to the **Admin System** at `/portfolio/admin`.
3.  Log in using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set in Phase 2.
4.  **Important**: Click **"SYNC BIO DATA"** or **"SYNC PROJECT DATA"** once to ensure the MongoDB database is initialized with your initial data.

---

### 🔥 You Are Ready!
Your portfolio is now dynamic. You can add new projects, internships, and certificates directly from the Admin Panel, and they will persist forever in your MongoDB database on Render.
