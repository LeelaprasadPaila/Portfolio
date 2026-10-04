import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import SEO from '../components/SEO';
import GlobalSearch from '../components/GlobalSearch';
import AIAssistant from '../components/AIAssistant';
import Microinteractions from '../components/Microinteractions';
import { ToastContainer, useToast } from '../components/Toast';
import { getProjects, getCertificates, getSkills, getBio, getInternships } from '../services/api';
import { analytics } from '../services/analytics';
import PortfolioRoutes from './PortfolioRoutes';

function App() {
    const isPortfolioBuild = import.meta.env.MODE === 'portfolio';
    const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
    const toast = useToast();
    const location = useLocation();

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
                await Promise.allSettled([
                    getProjects(),
                    getCertificates(),
                    getSkills(),
                    getBio(),
                    getInternships()
                ]);

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
            <PortfolioRoutes isPortfolioBuild={isPortfolioBuild} />

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
