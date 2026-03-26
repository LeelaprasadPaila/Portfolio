# AI Native Portfolio - Parallax Experience

A premium, high-performance portfolio application built with **React**, **Node.js**, **Express**, and **GSAP**. This portfolio features a cinematic parallax experience, neural backgrounds, and dynamic data management via a built-in Admin Panel.

## 🚀 Key Features

-   **Cinematic Parallax Navigation**: Smooth scrolling and layered depth effects for an immersive experience.
-   **Dynamic Data Strategy**: Data is fetched from a local JSON store with real-time synchronization from an optional API backend.
-   **Admin Panel**: A secure and elegant interface to manage Projects, Certificates, Internships, and Bio details.
-   **Neural Backgrounds**: Animated particle systems that respond to user interaction.
-   **Media Resolution Utility**: Centralized asset management ensuring all images load correctly from domestic and remote sources.
-   **Responsive Design**: Optimized for all devices, from mobile to ultra-wide displays.

## 🛠️ Technology Stack

-   **Frontend**: React.js, GSAP (for animations), CSS3 (Flexbox/Grid), Vite.
-   **Backend**: Node.js, Express.js (for file uploads and data storage).
-   **Database**: Local JSON storage (with future MongoDB compatibility).
-   **Styling**: Custom Vanilla CSS for maximum flexibility.

## 📁 Project Structure

```bash
├── backend/                # Express API and file upload logic
├── parallax-portfolio/     # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Projects, Admin, etc.)
│   │   ├── services/       # API integration and asset resolution
│   │   ├── styles/         # Premium CSS modules
│   │   └── data/           # Local storage and initial data
│   └── public/             # Static assets (images/projects/certificates)
└── temp/                   # Temporary project documentation
```

## 🏗️ Getting Started

### 1. Prerequisites
-   Node.js (v18+)
-   npm or yarn

### 2. Setup (Frontend)
```bash
cd parallax-portfolio
npm install
npm run dev
```

### 3. Setup (Backend)
```bash
cd backend
npm install
npm run dev
```

## 🔐 Admin Access

The Admin Panel can be accessed via the `/admin` route. It provides a secure environment to manage all content dynamically without manual code updates.

## 🛡️ License

Created by **Paila Leelaprasad** - All Rights Reserved.
