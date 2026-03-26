import React from 'react';
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

function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/internships" element={<InternshipsPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
        </Routes>
    );
}

export default App;
