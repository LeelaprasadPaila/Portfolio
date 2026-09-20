import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Layout from './pages/Layout';
import PortfolioLandingPage from './pages/PortfolioLandingPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetail from './pages/ProjectDetail';
import ExperiencePage from './pages/ExperiencePage';
import ResumePage from './pages/ResumePage';
import CertificationsPage from './pages/CertificationsPage';
import SkillsPage from './pages/SkillsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import InternshipsPage from './pages/InternshipsPage';
import ResearchPapersPage from './pages/ResearchPapersPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';
import SEO from './components/SEO';
import GlobalSearch from './components/GlobalSearch';
import AIAssistant from './components/AIAssistant';
import InteractiveTimeline from './components/InteractiveTimeline';
import GitHubDashboard from './components/GitHubDashboard';
import Dashboards from './components/Dashboards';
import Microinteractions from './components/Microinteractions';
import { ToastContainer, useToast } from './components/Toast';
import { getProjects, getCertificates, getSkills, getBio, getInternships } from './services/api';
import { analytics } from './services/analytics';
import { prefersReducedMotion } from './utils/accessibility';
import './index.css';

function App() {
    const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize analytics
    useEffect(() => {
        analytics.init();
    }, []);

    // Track page views
    useEffect(() => {
        analytics.pageView(location.pathname, document.title);
    }, [location.pathname]);

    // Prefetch data (idempotent — avoid running twice in StrictMode)
    const hasPrefetched = useRef(false);
    useEffect(() => {
        if (hasPrefetched.current) return;
        hasPrefetched.current = true;

        const prefetch = async () => {
            try {
                const [projectsData, certificates, skills, bio, internships] = await Promise.allSettled([
                    getProjects(),
                    getCertificates(),
                    getSkills(),
                    getBio(),
                    getInternships()
                ]);

                if (projectsData.status === 'fulfilled' && projectsData.value) {
                    setProjects(projectsData.value);
                }

                console.log('✓ Success: All portfolio data pre-fetched and cached.');
            } catch (err) {
                console.warn('Pre-fetch partially failed:', err.message);
                toast.warning('Some content may load slower than expected', 3000);
            }
        };
        prefetch();
    }, [toast]);

    // Global keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Cmd/Ctrl + K to open global search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setGlobalSearchOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleGlobalSearchClose = useCallback(() => {
        setGlobalSearchOpen(false);
    }, []);

    // Listen for custom events from navbar
    useEffect(() => {
        const handleOpenSearch = () => setGlobalSearchOpen(true);

        window.addEventListener('openGlobalSearch', handleOpenSearch);

        return () => {
            window.removeEventListener('openGlobalSearch', handleOpenSearch);
        };
    }, []);

    return (
        <ErrorBoundary>
            <SEO />
            <Routes>
                <Route path="/" element={<PortfolioLandingPage />} />
                <Route element={<Layout />}>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/project/:projectTitle" element={<ProjectDetail />} />
                    <Route path="/experience" element={<ExperiencePage />} />
                    <Route path="/resume" element={<ResumePage />} />
                    <Route path="/certificates" element={<CertificationsPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/research" element={<ResearchPapersPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            <GlobalSearch
                isOpen={globalSearchOpen}
                onClose={handleGlobalSearchClose}
            />

            <AIAssistant />

            <Microinteractions />

            <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
        </ErrorBoundary>
    );
}

export default App;