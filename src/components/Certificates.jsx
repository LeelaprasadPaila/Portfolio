import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getCertificates, getFileUrl } from '../services/api';
import NeuralBackground from './NeuralBackground';
import gsap from 'gsap';
import '../styles/Certificates.css';

const Certificates = ({ isActive, onClose }) => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allCerts, setAllCerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);

    const sortCerts = useCallback((certs) => {
        return [...certs].sort((a, b) => {
            const pA = (a.priority === true || a.priority === 'true') ? 1 : 0;
            const pB = (b.priority === true || b.priority === 'true') ? 1 : 0;
            if (pB !== pA) return pB - pA;
            return (a.title || "").localeCompare(b.title || "");
        });
    }, []);

    const loadCertificates = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getCertificates();
            if (Array.isArray(data) && data.length > 0) {
                setAllCerts(sortCerts(data));
            } else {
                throw new Error('No certificates found');
            }
        } catch (err) {
            console.warn('Certificates API load failed, falling back to local data.', err);
            setError('Unable to fetch updated certificates. Showing local data.');
            setAllCerts(sortCerts(certificatesData));
        } finally {
            setLoading(false);
        }
    }, [sortCerts]);

    useEffect(() => {
        if (isActive) {
            loadCertificates();
        }
    }, [isActive, loadCertificates]);

    const categories = useMemo(() => {
        const certCats = allCerts.map(c => c.category).filter(Boolean);
        return ["All", ...new Set(certCats)];
    }, [allCerts]);

    const filteredCerts = useMemo(() => {
        const filtered = activeCategory === "All" 
            ? allCerts 
            : allCerts.filter(c => c.category === activeCategory);
        return sortCerts(filtered);
    }, [allCerts, activeCategory, sortCerts]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory]);

    // Auto-advance slider when active
    useEffect(() => {
        if (filteredCerts.length === 0) return;

        if (isActive) {
            const timer = setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % filteredCerts.length);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [isActive, currentIndex, filteredCerts.length]);

    // Animate container
    useEffect(() => {
        if (isActive && containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.8, ease: 'power2.out' }
            );
        }
    }, [isActive]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredCerts.length) % filteredCerts.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredCerts.length);
    };

    if (allCerts.length === 0) {
        return (
            <section className="cert-section" ref={containerRef}>
                <div className="cert-header">
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Professional Achievements & Credentials</p>
                </div>
                <div className="cert-empty">Loading certificates...</div>
            </section>
        );
    }

    const currentCert = filteredCerts.length > 0 ? filteredCerts[currentIndex] : null;

    return (
        <section className="cert-section" ref={containerRef}>
            <NeuralBackground />
            
            {/* Header */}
            <div className="cert-header">
                <div>
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Professional Achievements & Credentials</p>
                    {error && <p className="cert-error">{error}</p>}
                </div>
            </div>

            {/* Category Filter */}
            <div className="cert-category-filter">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`cert-tab ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                        <span className="tab-count">
                            {cat === "All" ? allCerts.length : allCerts.filter(c => c.category === cat).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Main Showcase */}
            {currentCert && (
                <div className="cert-showcase-wrapper">
                    <div className="cert-showcase">
                        {/* Certificate Image */}
                        <div className="cert-image-container">
                            {currentCert.image ? (
                                <img 
                                    src={getFileUrl(currentCert.image)} 
                                    alt={currentCert.title} 
                                    className="cert-image-main"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextElementSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="cert-image-fallback" style={{ display: currentCert.image ? 'none' : 'flex' }}>
                                <i className="fas fa-certificate"></i>
                                <span>Certificate</span>
                            </div>
                        </div>

                        {/* Certificate Content */}
                        <div className="cert-content">
                            <div className="cert-meta-badges">
                                <span className="badge badge-category">{currentCert.category}</span>
                                <span className="badge badge-year">{currentCert.date}</span>
                            </div>

                            <h3 className="cert-title-main">{currentCert.title}</h3>
                            <p className="cert-issuer">
                                <i className="fas fa-building"></i>
                                <strong>{currentCert.provider}</strong>
                            </p>
                            <p className="cert-desc">{currentCert.details}</p>

                            {currentCert.verifyUrl && currentCert.verifyUrl !== '#' && (
                                <a
                                    className="cert-action-btn"
                                    href={currentCert.verifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Certificate
                                </a>
                            )}

                            {/* Navigation and Counter */}
                            <div className="cert-nav-bar">
                                <div className="cert-counter">
                                    <span className="counter-text">
                                        {currentIndex + 1} / {filteredCerts.length}
                                    </span>
                                </div>
                                <div className="nav-buttons">
                                    <button className="nav-btn-control prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }} aria-label="Previous">
                                        <i className="fas fa-chevron-left"></i>
                                    </button>
                                    <button className="nav-btn-control next" onClick={(e) => { e.stopPropagation(); handleNext(); }} aria-label="Next">
                                        <i className="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="cert-progress-container">
                        <div className="progress-bar">
                            <div 
                                className="progress-fill" 
                                style={{ width: `${filteredCerts.length > 0 ? ((currentIndex + 1) / filteredCerts.length) * 100 : 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Certificate Grid */}
            <div className="cert-grid-container">
                <h3 className="grid-heading">All Certifications</h3>
                <div className="certificate-grid">
                    {filteredCerts.map((cert, idx) => (
                        <div
                            key={cert._id || cert.id || idx}
                            className={`cert-card-thumbnail ${idx === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setCurrentIndex(idx)}
                        >
                            <div className="thumbnail-image-wrapper">
                                {cert.image ? (
                                    <img 
                                        src={getFileUrl(cert.image)} 
                                        alt={cert.title}
                                        className="thumbnail-image"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className="thumbnail-fallback" style={{ display: cert.image ? 'none' : 'flex' }}>
                                    <i className="fas fa-certificate"></i>
                                </div>
                            </div>
                            <div className="thumbnail-overlay">
                                <h4 className="thumbnail-title">{cert.title}</h4>
                                <p className="thumbnail-provider">{cert.provider}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
