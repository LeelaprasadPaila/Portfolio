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
On [Render.com](https://render.com/):
1.  **New** → **Static Site**.
2.  Connect your GitHub Repo: **LeelaprasadPaila/Portfolio**.
3.  **Root Directory**: `parallax-portfolio` (CRITICAL).
4.  **Build Command**: `npm install && npm run build`
5.  **Publish Directory**: `dist`
6.  **Environment Variables**:
    - **VITE_API_URL**: `https://YOUR-BACKEND-URL.onrender.com/api`
    - **VITE_API_BASE_URL**: `https://YOUR-BACKEND-URL.onrender.com`
    > [!TIP]
    > Get the backend URL from your backend service dashboard on Render!

---

## ✅ Phase 4: Finalizing the Admin Login
Once both services are "Live":
1.  Visit your Frontend URL.
2.  Navigate to the **Admin System**.
3.  Log in using the `ADMIN_USERNAME` and `ADMIN_PASSWORD` you set in Phase 2.
4.  **Important**: Click **"SYNC BIO DATA"** or **"SYNC PROJECT DATA"** once to ensure the MongoDB database is initialized with your initial data.

---

### 🔥 You Are Ready!
Your portfolio is now dynamic. You can add new projects, internships, and certificates directly from the Admin Panel, and they will persist forever in your MongoDB database on Render.
