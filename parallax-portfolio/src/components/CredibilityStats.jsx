import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/CredibilityStats.css';
import computeAutoStats from '../services/autoStats';

const defaultStatCards = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        key: 'projectsCompleted',
        suffix: '+',
        label: 'Projects Completed',
        description: 'AI/ML & backend systems delivered',
        color: '#00f2ff',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
        key: 'technologiesUsed',
        suffix: '+',
        label: 'Technologies Used',
        description: 'Across full-stack & ML projects',
        color: '#3b82f6',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        key: 'gitHubContributions',
        suffix: '+',
        label: 'GitHub Contributions',
        description: 'Consistent open source activity',
        color: '#10b981',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
        ),
        key: 'certifications',
        suffix: '+',
        label: 'Certifications',
        description: 'Industry-recognized credentials',
        color: '#8b5cf6',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        ),
        key: 'researchPapers',
        suffix: '+',
        label: 'Research Papers',
        description: 'Published research in AI/ML',
        color: '#ec4899',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
        ),
        key: 'openSourceContributions',
        suffix: '+',
        label: 'Open Source Contributions',
        description: 'Active contributor to OSS projects',
        color: '#06b6d4',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
        ),
        key: 'yearsOfExperience',
        suffix: '+',
        label: 'Years of Learning',
        description: 'Continuous skill development',
        color: '#f59e0b',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        key: 'domainsExplored',
        suffix: '',
        label: 'Domains Explored',
        description: 'From NLP to computer vision',
        color: '#a855f7',
    },
];

const CountUp = ({ value, suffix, isVisible }) => {
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isVisible && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [isVisible, value]);

    return (
        <span className="credibility-stat-number">
            {count}{suffix}
        </span>
    );
};

const CredibilityStats = () => {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const [stats, setStats] = useState(null);
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);

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
            { threshold: 0.15 }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    // Build statCards with dynamic values from computed stats
    const statCards = defaultStatCards.map(card => {
        if (stats && stats[card.key]) {
            return {
                ...card,
                value: stats[card.key].value,
                suffix: stats[card.key].suffix || card.suffix,
                description: stats[card.key].description || card.description,
            };
        }
        return {
            ...card,
            value: 0,
        };
    });

    return (
        <section className="credibility-section" ref={sectionRef}>
            {/* Background gradients */}
            <div className="credibility-bg-gradient" />
            <div className="credibility-bg-gradient-2" />

            <div className="credibility-container">
                {/* Section Header */}
                <div className="credibility-header">
                    <span className="credibility-badge">Trust & Credibility</span>
                    <h2 className="credibility-title">By the Numbers</h2>
                    <p className="credibility-subtitle">
                        Metrics that reflect dedication, expertise, and a commitment to excellence
                        in every project delivered
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="credibility-grid">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            className={`credibility-card ${visibleItems.has(index) ? 'credibility-card-visible' : ''}`}
                            data-index={index}
                            ref={(el) => (cardRefs.current[index] = el)}
                            style={{ '--card-color': stat.color }}
                        >
                            {/* Card Icon */}
                            <div className="credibility-card-icon">
                                {stat.icon}
                            </div>

                            {/* Card Content */}
                            <div className="credibility-card-content">
                                <CountUp
                                    value={stat.value}
                                    suffix={stat.suffix}
                                    isVisible={visibleItems.has(index)}
                                />
                                <span className="credibility-card-label">{stat.label}</span>
                                <p className="credibility-card-desc">{stat.description}</p>
                            </div>

                            {/* Card Glow */}
                            <div className="credibility-card-glow" />
                            
                            {/* Card Border Glow */}
                            <div className="credibility-card-border" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CredibilityStats;