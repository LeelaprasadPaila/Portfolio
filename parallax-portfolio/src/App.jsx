import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import CertificatesPage from './pages/CertificatesPage';
import InternshipsPage from './pages/InternshipsPage';
import SkillsPage from './pages/SkillsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { getProjects, getCertificates, getSkills, getBio, getInternships } from './services/api';

function App() {
    useEffect(() => {
        // Pre-fetch data immediately on mount for performance
        // This warms up the backend and populates our new api.js cache
        const prefetch = async () => {
            try {
                // Run in parallel to wake up the backend cluster fast
                await Promise.allSettled([
                    getProjects(),
                    getCertificates(),
                    getSkills(),
                    getBio(),
                    getInternships()
                ]);
                console.log('✓ Success: All portfolio data pre-fetched and cached.');
            } catch (err) {
                console.warn('Pre-fetch partially failed (Backend may still be waking up):', err.message);
            }
        };
        prefetch();
    }, []);

    return (

        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/internships" element={<InternshipsPage />} />
                <Route path="/experience" element={<InternshipsPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Route>
        </Routes>
    );
}

export default App;
