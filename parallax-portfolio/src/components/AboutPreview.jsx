import React, { useEffect, useRef, useState } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { assetUrl } from '../config/env';
import '../styles/AboutPreview.css';

const AboutPreview = ({ onExploreClick }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [bioData, setBioData] = useState(null);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.15 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Load bio data from dataStore
        const bio = getData(STORAGE_KEYS.BIO);
        setBioData(bio);
    }, []);

    // Get interests as tags
    const [interests, setInterests] = useState([]);
    useEffect(() => {
        const savedInterests = getData(STORAGE_KEYS.INTERESTS);
        setInterests(Array.isArray(savedInterests) ? savedInterests : []);
    }, []);

    const profileImage = assetUrl(bioData?.profileImage || 'images/Portfolio_image.png');
    const introText = bioData?.intro || "I'm an AI Engineer and Machine Learning specialist passionate about building intelligent systems that solve real-world problems. With expertise spanning backend engineering, deep learning, and cloud infrastructure, I architect end-to-end solutions that are both innovative and production-ready.";

    return (
        <section className="about-preview-section" ref={sectionRef}>
            {/* Background */}
            <div className="about-preview-bg" />
            <div className="about-preview-bg-2" />

            <div className="about-preview-container">
                {/* Section Header */}
                <div className="about-preview-header">
                    <span className="about-preview-badge">About Me</span>
                    <h2 className="about-preview-title">Who I Am</h2>
                </div>

                {/* Split Layout */}
                <div className={`about-preview-layout ${isVisible ? 'about-preview-layout-visible' : ''}`}>
                    {/* Left: Real Photo from Bio Data */}
                    <div className="about-preview-photo">
                        <div className="about-preview-photo-frame">
                            <img
                                src={profileImage}
                                alt={bioData?.title || 'Leelaprasad Paila'}
                                className="about-preview-photo-img"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%'
                                }}
                                onError={(e) => {
                                    // Fallback to icon if image fails
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="about-preview-photo-placeholder" style={{ display: 'none' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <div className="about-preview-photo-glow" />
                            <div className="about-preview-photo-border" />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="about-preview-content">
                        {/* Professional Introduction */}
                        <div className="about-preview-block">
                            <h3 className="about-preview-block-title">
                                {bioData?.title || 'Brief Biography'}
                            </h3>
                            <p className="about-preview-text">
                                {introText}
                            </p>
                        </div>

                        {/* Personal Mission coming from bio */}
                        <div className="about-preview-block">
                            <h3 className="about-preview-block-title">My Mission</h3>
                            <p className="about-preview-text">
                                To democratize AI by building accessible, scalable, and ethical machine 
                                learning systems that empower businesses and individuals to make better 
                                decisions through data-driven intelligence.
                            </p>
                        </div>

                        {/* Technical Interests & Career Goals */}
                        <div className="about-preview-grid">
                            <div className="about-preview-block">
                                <h3 className="about-preview-block-title">Technical Interests</h3>
                                <div className="about-preview-tags">
                                    {(interests.length > 0 ? interests : ['LLMs', 'Computer Vision', 'MLOps', 'Distributed Systems', 'NLP', 'Edge AI']).map((tag, i) => (
                                        <span key={i} className="about-preview-tag">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="about-preview-block">
                                <h3 className="about-preview-block-title">Contact Info</h3>
                                <p className="about-preview-text">
                                    {bioData?.email && <><strong>Email:</strong> {bioData.email}<br /></>}
                                    {bioData?.phone && <><strong>Phone:</strong> {bioData.phone}<br /></>}
                                    {bioData?.city && <><strong>Location:</strong> {bioData.city}<br /></>}
                                    {bioData?.degree && <><strong>Degree:</strong> {bioData.degree}</>}
                                </p>
                            </div>
                        </div>

                        {/* Core Values */}
                        <div className="about-preview-block">
                            <h3 className="about-preview-block-title">Core Values</h3>
                            <div className="about-preview-values">
                                {[
                                    { icon: '🔬', label: 'Innovation' },
                                    { icon: '🤝', label: 'Collaboration' },
                                    { icon: '📚', label: 'Continuous Learning' },
                                    { icon: '🎯', label: 'Impact-Driven' },
                                    { icon: '🔍', label: 'Attention to Detail' },
                                    { icon: '🌱', label: 'Growth Mindset' },
                                ].map((value, i) => (
                                    <div key={i} className="about-preview-value-item">
                                        <span className="about-preview-value-icon">{value.icon}</span>
                                        <span className="about-preview-value-label">{value.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What Drives Me */}
                        <div className="about-preview-block">
                            <h3 className="about-preview-block-title">What Drives Me</h3>
                            <p className="about-preview-text">
                                The intersection of mathematics, code, and creativity is where I thrive. 
                                Every line of code I write is driven by curiosity and the desire to create 
                                systems that make a meaningful difference. I believe in the power of 
                                technology to solve humanity's greatest challenges.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="about-preview-actions">
                            <button
                                className="about-preview-btn about-preview-btn-primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onExploreClick('about');
                                }}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                                Read More
                            </button>
                            <a
                                href={assetUrl('resume.pdf')}
                                download
                                className="about-preview-btn about-preview-btn-secondary"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Download Resume
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutPreview;
