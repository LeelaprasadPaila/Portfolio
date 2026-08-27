import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getInternships, getCertificates, getSkills } from '../services/api';
import { createFocusTrap } from '../utils/accessibility';
import './GlobalSearch.css';

const GlobalSearch = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState([]);
    const [results, setResults] = useState({ projects: [], internships: [], certificates: [], skills: [] });
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Load recent searches
    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem('portfolio_recent_searches');
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Search function
    const performSearch = useCallback(async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults({ projects: [], internships: [], certificates: [], skills: [] });
            return;
        }

        setIsSearching(true);
        try {
            const [projects, internships, certificates, skills] = await Promise.allSettled([
                getProjects(),
                getInternships(),
                getCertificates(),
                getSkills()
            ]);

            const q = searchQuery.toLowerCase();
            const searchResults = {
                projects: projects.status === 'fulfilled' ? projects.value.filter(p => 
                    p.title?.toLowerCase().includes(q) || 
                    p.desc?.toLowerCase().includes(q) ||
                    p.category?.toLowerCase().includes(q) ||
                    p.meta?.toLowerCase().includes(q)
                ) : [],
                internships: internships.status === 'fulfilled' ? internships.value.filter(i =>
                    i.role?.toLowerCase().includes(q) ||
                    i.company?.toLowerCase().includes(q) ||
                    i.desc?.toLowerCase().includes(q)
                ) : [],
                certificates: certificates.status === 'fulfilled' ? certificates.value.filter(c =>
                    c.title?.toLowerCase().includes(q) ||
                    c.issuer?.toLowerCase().includes(q)
                ) : [],
                skills: skills.status === 'fulfilled' ? skills.value.filter(s =>
                    s.name?.toLowerCase().includes(q) ||
                    s.title?.toLowerCase().includes(q) ||
                    s.skills?.some(skill => skill.toLowerCase().includes(q))
                ) : []
            };

            setResults(searchResults);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            performSearch(query);
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query, performSearch]);

    // Flatten results for navigation
    const allResults = [
        ...results.projects.map(p => ({ type: 'Project', data: p, path: `/project/${encodeURIComponent(p.title)}` })),
        ...results.internships.map(i => ({ type: 'Experience', data: i, path: '/experience' })),
        ...results.certificates.map(c => ({ type: 'Certificate', data: c, path: '/certificates' })),
        ...results.skills.map(s => ({ type: 'Skill', data: s, path: '/skills' }))
    ];

    const hasResults = allResults.length > 0;
    const totalResults = allResults.length;

    const saveRecentSearch = (searchQuery) => {
        if (!searchQuery.trim()) return;
        const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('portfolio_recent_searches', JSON.stringify(updated));
    };

    const handleResultClick = (result) => {
        saveRecentSearch(query);
        navigate(result.path);
        onClose();
    };

    const handleRecentSearchClick = (search) => {
        setQuery(search);
        performSearch(search);
    };

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev < (hasResults ? totalResults - 1 : recentSearches.length - 1) ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => 
                    prev > 0 ? prev - 1 : (hasResults ? totalResults - 1 : recentSearches.length - 1)
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (hasResults && allResults[selectedIndex]) {
                    handleResultClick(allResults[selectedIndex]);
                } else if (!hasResults && recentSearches[selectedIndex]) {
                    handleRecentSearchClick(recentSearches[selectedIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                break;
        }
    }, [isOpen, hasResults, totalResults, recentSearches.length, allResults, selectedIndex, onClose, navigate]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
            };
        }
    }, [isOpen, handleKeyDown]);

    useEffect(() => {
        if (isOpen && resultsRef.current) {
            createFocusTrap(resultsRef.current);
        }
    }, [isOpen, hasResults, recentSearches]);

    if (!isOpen) return null;

    const getResultIcon = (type) => {
        switch (type) {
            case 'Project': return '📦';
            case 'Experience': return '💼';
            case 'Certificate': return '🏆';
            case 'Skill': return '⚡';
            default: return '📄';
        }
    };

    const highlightText = (text, query) => {
        if (!query || !text) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, i) => 
            part.toLowerCase() === query.toLowerCase() 
                ? <mark key={i} className="search-highlight">{part}</mark> 
                : part
        );
    };

    return (
        <div className="global-search-overlay" onClick={onClose}>
            <div 
                className="global-search-modal" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Global search"
            >
                <div className="global-search-header">
                    <svg className="global-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        className="global-search-input"
                        placeholder="Search projects, experience, skills, certificates..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        aria-label="Search"
                    />
                    {isSearching && <div className="global-search-spinner" />}
                    <kbd className="global-search-shortcut">ESC</kbd>
                </div>

                <div className="global-search-results" ref={resultsRef}>
                    {!query && recentSearches.length > 0 && (
                        <div className="search-section">
                            <div className="search-section-header">Recent Searches</div>
                            {recentSearches.map((search, index) => (
                                <button
                                    key={index}
                                    className={`search-result-item ${index === selectedIndex ? 'search-result-selected' : ''}`}
                                    onClick={() => handleRecentSearchClick(search)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    <svg className="search-result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                    <span>{search}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {query && !hasResults && !isSearching && (
                        <div className="search-empty">
                            <svg className="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <p>No results found for "{query}"</p>
                            <span>Try searching for projects, skills, or experience</span>
                        </div>
                    )}

                    {hasResults && (
                        <div className="search-results-list">
                            {results.projects.length > 0 && (
                                <div className="search-section">
                                    <div className="search-section-header">
                                        Projects ({results.projects.length})
                                    </div>
                                    {results.projects.map((project, idx) => {
                                        const globalIndex = idx;
                                        return (
                                            <button
                                                key={project.id || idx}
                                                className={`search-result-item ${globalIndex === selectedIndex ? 'search-result-selected' : ''}`}
                                                onClick={() => handleResultClick({ 
                                                    type: 'Project', 
                                                    data: project, 
                                                    path: `/project/${encodeURIComponent(project.title)}` 
                                                })}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            >
                                                <span className="search-result-type">{getResultIcon('Project')}</span>
                                                <div className="search-result-content">
                                                    <div className="search-result-title">
                                                        {highlightText(project.title, query)}
                                                    </div>
                                                    <div className="search-result-meta">
                                                        {project.category} • {project.meta}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {results.internships.length > 0 && (
                                <div className="search-section">
                                    <div className="search-section-header">
                                        Experience ({results.internships.length})
                                    </div>
                                    {results.internships.map((internship, idx) => {
                                        const globalIndex = results.projects.length + idx;
                                        return (
                                            <button
                                                key={internship.id || idx}
                                                className={`search-result-item ${globalIndex === selectedIndex ? 'search-result-selected' : ''}`}
                                                onClick={() => handleResultClick({ 
                                                    type: 'Experience', 
                                                    data: internship, 
                                                    path: '/experience' 
                                                })}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            >
                                                <span className="search-result-type">{getResultIcon('Experience')}</span>
                                                <div className="search-result-content">
                                                    <div className="search-result-title">
                                                        {highlightText(internship.role, query)}
                                                    </div>
                                                    <div className="search-result-meta">
                                                        {internship.company} • {internship.duration}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {results.certificates.length > 0 && (
                                <div className="search-section">
                                    <div className="search-section-header">
                                        Certificates ({results.certificates.length})
                                    </div>
                                    {results.certificates.map((cert, idx) => {
                                        const globalIndex = results.projects.length + results.internships.length + idx;
                                        return (
                                            <button
                                                key={cert.id || idx}
                                                className={`search-result-item ${globalIndex === selectedIndex ? 'search-result-selected' : ''}`}
                                                onClick={() => handleResultClick({ 
                                                    type: 'Certificate', 
                                                    data: cert, 
                                                    path: '/certificates' 
                                                })}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            >
                                                <span className="search-result-type">{getResultIcon('Certificate')}</span>
                                                <div className="search-result-content">
                                                    <div className="search-result-title">
                                                        {highlightText(cert.title, query)}
                                                    </div>
                                                    <div className="search-result-meta">
                                                        {cert.issuer} • {cert.date}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {results.skills.length > 0 && (
                                <div className="search-section">
                                    <div className="search-section-header">
                                        Skills ({results.skills.length})
                                    </div>
                                    {results.skills.map((skill, idx) => {
                                        const globalIndex = results.projects.length + results.internships.length + 
                                                           results.certificates.length + idx;
                                        return (
                                            <button
                                                key={skill.id || idx}
                                                className={`search-result-item ${globalIndex === selectedIndex ? 'search-result-selected' : ''}`}
                                                onClick={() => handleResultClick({ 
                                                    type: 'Skill', 
                                                    data: skill, 
                                                    path: '/skills' 
                                                })}
                                                onMouseEnter={() => setSelectedIndex(globalIndex)}
                                            >
                                                <span className="search-result-type">{getResultIcon('Skill')}</span>
                                                <div className="search-result-content">
                                                    <div className="search-result-title">
                                                        {highlightText(skill.name || skill.title, query)}
                                                    </div>
                                                    <div className="search-result-meta">
                                                        {skill.title || skill.category}
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {query && hasResults && (
                        <div className="global-search-footer">
                            <span className="global-search-hint">
                                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
                            </span>
                            <span className="global-search-hint">
                                <kbd>↑↓</kbd> to navigate
                            </span>
                            <span className="global-search-hint">
                                <kbd>↵</kbd> to select
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;