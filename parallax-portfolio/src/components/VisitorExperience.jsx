import React, { useState, useEffect } from 'react';
import './VisitorExperience.css';

const VisitorExperience = () => {
    const [showWelcome, setShowWelcome] = useState(false);
    const [visitorType, setVisitorType] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Check if first visit
        const hasVisited = localStorage.getItem('portfolio_has_visited');
        if (!hasVisited) {
            setShowWelcome(true);
            localStorage.setItem('portfolio_has_visited', 'true');
        }

        // Load bookmarks and favorites
        const savedBookmarks = localStorage.getItem('portfolio_bookmarks');
        const savedFavorites = localStorage.getItem('portfolio_favorites');
        if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

        // Detect visitor type based on behavior
        detectVisitorType();
    }, []);

    const detectVisitorType = () => {
        const timeOnPage = parseInt(localStorage.getItem('portfolio_time_on_page') || '0');
        const pagesVisited = JSON.parse(localStorage.getItem('portfolio_pages_visited') || '[]');
        
        if (pagesVisited.includes('/resume') || pagesVisited.includes('/experience')) {
            setVisitorType('recruiter');
        } else if (pagesVisited.includes('/projects')) {
            setVisitorType('client');
        } else if (pagesVisited.includes('/skills') || pagesVisited.includes('/admin')) {
            setVisitorType('developer');
        } else {
            setVisitorType('explorer');
        }
    };

    const getRecommendations = () => {
        switch (visitorType) {
            case 'recruiter':
                return [
                    { title: 'Featured Projects', path: '/projects', icon: '⭐' },
                    { title: 'Experience & Internships', path: '/experience', icon: '💼' },
                    { title: 'Download Resume', path: '/resume', icon: '📄' },
                    { title: 'Certifications', path: '/certificates', icon: '🏆' }
                ];
            case 'client':
                return [
                    { title: 'Services & Skills', path: '/skills', icon: '⚡' },
                    { title: 'Case Studies', path: '/projects', icon: '📊' },
                    { title: 'Contact Form', path: '/contact', icon: '✉️' },
                    { title: 'About Me', path: '/about', icon: '👤' }
                ];
            case 'developer':
                return [
                    { title: 'GitHub Dashboard', path: '#github', icon: '💻' },
                    { title: 'Technical Architecture', path: '/projects', icon: '🏗️' },
                    { title: 'Tech Stack', path: '/skills', icon: '🛠️' },
                    { title: 'Code Examples', path: '/projects', icon: '📝' }
                ];
            default:
                return [
                    { title: 'Explore Projects', path: '/projects', icon: '🚀' },
                    { title: 'View Skills', path: '/skills', icon: '⚡' },
                    { title: 'Get In Touch', path: '/contact', icon: '💬' }
                ];
        }
    };

    const recommendations = getRecommendations();

    const handleBookmark = (item) => {
        const updated = bookmarks.includes(item) 
            ? bookmarks.filter(b => b !== item)
            : [...bookmarks, item];
        setBookmarks(updated);
        localStorage.setItem('portfolio_bookmarks', JSON.stringify(updated));
    };

    const handleFavorite = (item) => {
        const updated = favorites.includes(item)
            ? favorites.filter(f => f !== item)
            : [...favorites, item];
        setFavorites(updated);
        localStorage.setItem('portfolio_favorites', JSON.stringify(updated));
    };

    const closeWelcome = () => {
        setShowWelcome(false);
    };

    if (!showWelcome) return null;

    return (
        <div className="visitor-welcome-overlay" onClick={closeWelcome}>
            <div className="visitor-welcome-modal" onClick={(e) => e.stopPropagation()}>
                <div className="welcome-animation">
                    <div className="welcome-orb welcome-orb-1" />
                    <div className="welcome-orb welcome-orb-2" />
                    <div className="welcome-orb welcome-orb-3" />
                </div>

                <div className="welcome-content">
                    <h1 className="welcome-title">
                        Welcome to My Portfolio
                    </h1>
                    <p className="welcome-subtitle">
                        Discover projects, skills, and experiences that showcase my journey as an AI/ML Engineer
                    </p>

                    <div className="welcome-recommendations">
                        <h3>Recommended for you:</h3>
                        <div className="recommendation-grid">
                            {recommendations.map((rec, idx) => (
                                <a
                                    key={idx}
                                    href={rec.path}
                                    className="recommendation-card"
                                    onClick={closeWelcome}
                                >
                                    <span className="recommendation-icon">{rec.icon}</span>
                                    <span className="recommendation-title">{rec.title}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <button className="welcome-close" onClick={closeWelcome}>
                        Start Exploring
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisitorExperience;