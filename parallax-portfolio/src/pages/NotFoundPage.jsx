import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <SEO customMeta={{
                title: '404 - Page Not Found | Paila Leela Prasad',
                description: 'The page you are looking for does not exist or has been moved.',
            }} />
            <main className="error-page" role="main">
                <div className="error-page-content">
                    <div className="error-page-code" aria-hidden="true">404</div>
                    <h1 className="error-page-title">Page Not Found</h1>
                    <p className="error-page-message">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="error-page-actions">
                        <button 
                            onClick={() => navigate('/')}
                            className="error-page-btn error-page-btn-primary"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            Back to Home
                        </button>
                        <button 
                            onClick={() => navigate(-1)}
                            className="error-page-btn error-page-btn-secondary"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Go Back
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
};

export default NotFoundPage;