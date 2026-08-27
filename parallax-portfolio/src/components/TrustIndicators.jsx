import React, { useEffect, useRef, useState } from 'react';
import '../styles/TrustIndicators.css';
import computeAutoStats from '../services/autoStats';

const trustItems = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        label: 'AI/ML',
        description: 'Projects',
        color: '#00f2ff',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
        label: 'Backend',
        description: 'Systems',
        color: '#3b82f6',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </svg>
        ),
        label: 'Python',
        description: 'FastAPI',
        color: '#10b981',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
        ),
        label: 'Machine',
        description: 'Learning',
        color: '#8b5cf6',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
        ),
        label: 'Full stack',
        description: 'Development',
        color: '#06b6d4',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
            </svg>
        ),
        label: 'React',
        description: 'Frontend',
        color: '#ec4899',
    },
];

const TrustIndicators = () => {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const [stats, setStats] = useState(null);
    const sectionRef = useRef(null);
    const itemRefs = useRef([]);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const computedStats = await computeAutoStats();
                setStats(computedStats);
            } catch (e) {
                console.warn('Failed to compute auto stats:', e);
            }
        };
        loadStats();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        setVisibleItems((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.2 }
        );

        itemRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    // Build dynamic highlights from computed stats
    const highlights = stats ? [
        { number: `${stats.projectsCompleted.value >= 10 ? stats.projectsCompleted.value : 15}+`, label: 'Projects' },
        { number: `${stats.certifications.value}+`, label: 'Certifications' },
        { number: `${stats.yearsOfExperience.value}+`, label: 'Years Experience' },
        { number: `${stats.openSourceContributions.value}+`, label: 'Open Source' },
    ] : [
        { number: '0', label: 'Projects' },
        { number: '0', label: 'Certifications' },
        { number: '0', label: 'Years Experience' },
        { number: '0', label: 'Open Source' },
    ];

    return (
        <section className="trust-section" ref={sectionRef}>
            {/* Background gradient */}
            <div className="trust-bg-gradient" />

            <div className="trust-container">
                {/* Section header */}
                <div className="trust-header">
                    <span className="trust-badge">Technologies & Expertise</span>
                    <h2 className="trust-title">Built With Modern Tech Stack</h2>
                    <p className="trust-subtitle">
                        End-to-end expertise from machine learning models to production-scale backend systems
                    </p>
                </div>

                {/* Tech Stack Grid */}
                <div className="trust-grid">
                    {trustItems.map((item, index) => (
                        <div
                            key={index}
                            className={`trust-card ${visibleItems.has(index) ? 'trust-card-visible' : ''}`}
                            data-index={index}
                            ref={(el) => (itemRefs.current[index] = el)}
                            style={{ '--card-color': item.color }}
                        >
                            <div className="trust-card-icon">
                                {item.icon}
                            </div>
                            <div className="trust-card-info">
                                <span className="trust-card-label">{item.label}</span>
                                <span className="trust-card-desc">{item.description}</span>
                            </div>
                            <div className="trust-card-glow" />
                        </div>
                    ))}
                </div>

                {/* Stats Row */}
                <div className="trust-stats">
                    {highlights.map((stat, index) => (
                        <div
                            key={index}
                            className={`trust-stat-item ${visibleItems.has(index + trustItems.length) ? 'trust-stat-visible' : ''}`}
                            data-index={index + trustItems.length}
                            ref={(el) => (itemRefs.current[index + trustItems.length] = el)}
                        >
                            <span className="trust-stat-number">{stat.number}</span>
                            <span className="trust-stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustIndicators;