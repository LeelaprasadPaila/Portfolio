import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getCertificates, getFileUrl } from '../services/api';
import { certificatesData } from '../data/certificatesData';
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
            setError('Showing verified credentials and technical certifications.');
            // Combine API and local data if needed, but here we just fallback
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
        // We want specific order: All, Licensed, Normal, then others
        const types = ["Licensed", "Normal"];
        const certCats = allCerts
            .map(c => c.category)
            .filter(c => c && c !== "Licensed" && c !== "Normal");
        return ["All", ...types, ...new Set(certCats)];
    }, [allCerts]);

    const filteredCerts = useMemo(() => {
        let filtered = allCerts;
        
        if (activeCategory === "Licensed") {
            filtered = allCerts.filter(c => c.category?.toLowerCase() === "licensed");
        } else if (activeCategory === "Normal") {
            filtered = allCerts.filter(c => c.category?.toLowerCase() === "normal");
        } else if (activeCategory !== "All") {
            filtered = allCerts.filter(c => c.category === activeCategory);
        }
        
        return sortCerts(filtered);
    }, [allCerts, activeCategory, sortCerts]);

    useEffect(() => {
        setCurrentIndex(0);
    }, [activeCategory]);

    // Auto-advance slider when active
    useEffect(() => {
        if (filteredCerts.length <= 1) return;

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
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
            );
        }
    }, [isActive]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredCerts.length) % filteredCerts.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredCerts.length);
    };

    if (allCerts.length === 0 && loading) {
        return (
            <section className="cert-section" ref={containerRef}>
                <div className="cert-header">
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Professional Achievements & Credentials</p>
                </div>
                <div className="cert-empty">Initializing secure credentials...</div>
            </section>
        );
    }

    const currentCert = filteredCerts.length > 0 ? filteredCerts[currentIndex] : null;

    return (
        <section className="cert-section" ref={containerRef}>
            <NeuralBackground />
            
            {/* Header */}
            <div className="cert-header">
                <div className="header-info">
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Verified Professional Achievements</p>
                    {error && <p className="cert-status-msg">{error}</p>}
                </div>
            </div>

            {/* Sub-Header / Info */}
            <div className="cert-stats-overview">
                <div className="stat-item">
                    <span className="stat-value">{allCerts.filter(c => c.category?.toLowerCase() === 'licensed').length}</span>
                    <span className="stat-label">Licensed Credentials</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <span className="stat-value">{allCerts.filter(c => c.category?.toLowerCase() === 'normal').length}</span>
                    <span className="stat-label">Course Certificates</span>
                </div>
            </div>

            {/* Category Filter */}
            <div className="cert-category-filter">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`cert-tab ${activeCategory === cat ? 'active' : ''} ${cat === 'Licensed' ? 'licensed-pill' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {cat}
                        <span className="tab-count">
                            {cat === "All" ? allCerts.length : 
                             cat === "Licensed" ? allCerts.filter(c => c.category?.toLowerCase() === "licensed").length :
                             cat === "Normal" ? allCerts.filter(c => c.category?.toLowerCase() === "normal").length :
                             allCerts.filter(c => c.category === cat).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Main Showcase */}
            {currentCert && (
                <div className="cert-showcase-wrapper">
                    <div className={`cert-showcase ${currentCert.category?.toLowerCase() === 'licensed' ? 'is-licensed' : ''}`}>
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
                                <span>Certificate View</span>
                            </div>
                            
                            {currentCert.category?.toLowerCase() === 'licensed' && (
                                <div className="licensed-ribbon">
                                    <i className="fas fa-crown"></i> Licensed Professional
                                </div>
                            )}
                        </div>

                        {/* Certificate Content */}
                        <div className="cert-content">
                            <div className="cert-meta-badges">
                                <span className={`badge badge-category ${currentCert.category?.toLowerCase() === 'licensed' ? 'licensed' : ''}`}>
                                    {currentCert.category}
                                </span>
                                {currentCert.issueDate && <span className="badge badge-date">Issued: {currentCert.issueDate}</span>}
                                {currentCert.expiryDate && <span className="badge badge-expiry">Expires: {currentCert.expiryDate}</span>}
                                {currentCert.priority && <span className="badge badge-priority">PRIME</span>}
                            </div>

                            <h3 className="cert-title-main">{currentCert.title}</h3>

                            {currentCert.description && (
                                <p className="cert-description-line">{currentCert.description}</p>
                            )}

                            <div className="cert-issuer-box">
                                <span className="issuer-icon">
                                    <i className="fas fa-university"></i>
                                </span>
                                <div className="issuer-details">
                                    <span className="label">Issued By</span>
                                    <strong className="provider-name">{currentCert.issuer}</strong>
                                </div>
                            </div>

                            {currentCert.category?.toLowerCase() === 'licensed' && currentCert.key && (
                                <div className="cert-key-box">
                                    <span className="key-icon">
                                        <i className="fas fa-key"></i>
                                    </span>
                                    <div className="key-details">
                                        <span className="label">License Key</span>
                                        <strong className="license-key">{currentCert.key}</strong>
                                    </div>
                                </div>
                            )}

                            <div className="cert-footer-actions">
                                {currentCert.certLink && currentCert.certLink !== '#' && (
                                    <a
                                        className="cert-view-btn"
                                        href={currentCert.certLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <i className="fas fa-external-link-alt"></i> View Certificate
                                    </a>
                                )}

                                <div className="cert-page-info">
                                    <span className="current">{currentIndex + 1}</span>
                                    <span className="total">/ {filteredCerts.length}</span>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="cert-slider-controls">
                                <button className="ctrl-btn prev" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                                    <i className="fas fa-arrow-left"></i>
                                </button>
                                <button className="ctrl-btn next" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                                    <i className="fas fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Multi-step progress dots */}
                    <div className="cert-progress-dots">
                        {filteredCerts.slice(0, 10).map((_, i) => (
                            <div 
                                key={i} 
                                className={`progress-dot ${i === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(i)}
                            ></div>
                        ))}
                        {filteredCerts.length > 10 && <span className="more-dots">...</span>}
                    </div>
                </div>
            )}

            {/* Grid Preview */}
            <div className="cert-grid-preview">
                <div className="grid-header-wrap">
                    <h3 className="grid-label">Credential Library</h3>
                    <div className="label-line"></div>
                </div>
                <div className="cert-auto-grid">
                    {filteredCerts.map((cert, idx) => (
                        <div
                            key={cert._id || cert.id || idx}
                            className={`cert-mini-card ${idx === currentIndex ? 'active' : ''} ${cert.type === 'Licensed' ? 'licensed-card' : ''}`}
                            onClick={() => setCurrentIndex(idx)}
                        >
                            <div className="mini-thumb">
                                {cert.image ? (
                                    <img src={getFileUrl(cert.image)} alt="" onError={(e) => e.target.style.display = 'none'} />
                                ) : (
                                    <i className="fas fa-certificate"></i>
                                )}
                            </div>
                            <div className="mini-info">
                                <span className="mini-title text-truncate">{cert.title}</span>
                                <span className="mini-prov">{cert.provider}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Certificates;
