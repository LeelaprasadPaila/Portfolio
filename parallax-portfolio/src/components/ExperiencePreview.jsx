import React, { useEffect, useRef, useState, useMemo } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import '../styles/ExperiencePreview.css';

const TYPE_ACCENTS = {
    Internship: '#00f2ff',
    Experience: '#8b5cf6',
    Research: '#10b981',
    Leadership: '#f59e0b',
    Education: '#ec4899',
};

const TYPE_ICONS = {
    Internship: 'fas fa-briefcase',
    Experience: 'fas fa-flask',
    Research: 'fas fa-microscope',
    Leadership: 'fas fa-crown',
    Education: 'fas fa-graduation-cap',
};

const parseStartDate = (duration) => {
    if (!duration) return new Date(0);
    const lower = duration.toLowerCase();
    if (lower === 'ongoing' || lower === 'present') return new Date(9999, 11, 31);
    const parts = duration.split(/[-–—to]+/).map(s => s.trim());
    const startStr = parts[0];
    if (!startStr) return new Date(0);
    const months = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    };
    const match = startStr.match(/([a-zA-Z]+)\s+(\d{4})/);
    if (match) {
        const month = months[match[1].toLowerCase().slice(0, 3)];
        const year = parseInt(match[2]);
        if (month !== undefined && !isNaN(year)) return new Date(year, month, 1);
    }
    const yearMatch = startStr.match(/(\d{4})/);
    if (yearMatch) return new Date(parseInt(yearMatch[1]), 0, 1);
    return new Date(0);
};

const sortExperiences = (items) => {
    const typeRank = {
        Experience: 0,
        Internship: 1,
        Research: 2,
        Leadership: 3,
        Education: 4,
        Other: 5,
    };

    return [...items].sort((a, b) => {
        const companyA = (a.company || '').toLowerCase();
        const companyB = (b.company || '').toLowerCase();
        const aIsTopCompany = companyA.includes('a2z');
        const bIsTopCompany = companyB.includes('a2z');

        if (aIsTopCompany !== bIsTopCompany) return aIsTopCompany ? -1 : 1;

        const rankA = typeRank[a.type] ?? 99;
        const rankB = typeRank[b.type] ?? 99;
        if (rankA !== rankB) return rankA - rankB;

        const dateA = parseStartDate(a.duration);
        const dateB = parseStartDate(b.duration);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB - dateA;
    });
};

const ExperienceCard = ({ exp, index, visibleItems }) => {
    const isVisible = visibleItems.has(index);
    const accent = TYPE_ACCENTS[exp.type] || '#6366f1';
    const icon = TYPE_ICONS[exp.type] || 'fas fa-star';

    return (
        <div
            className={`experience-card ${isVisible ? 'experience-card-visible' : ''}`}
            data-index={index}
            style={{ '--card-color': accent }}
        >
            {/* Timeline Dot */}
            <div className="experience-timeline-dot">
                <div className="experience-timeline-dot-inner" />
            </div>

            {/* Card Content */}
            <div className="experience-card-content">
                {/* Header with Type Badge */}
                <div className="experience-card-header">
                    <div className="experience-card-company-info">
                        <h3 className="experience-card-company">{exp.company}</h3>
                        <div className="experience-card-type-line">
                            <span className="experience-card-role">{exp.role}</span>
                            <span
                                className="experience-card-type-badge"
                                style={{
                                    background: `${accent}20`,
                                    color: accent,
                                    borderColor: `${accent}40`
                                }}
                            >
                                <i className={icon}></i>
                                {exp.type}
                            </span>
                        </div>
                    </div>
                    <span className="experience-card-duration">{exp.duration}</span>
                </div>

                {/* Description */}
                <div className="experience-card-section">
                    <h4 className="experience-card-section-title">Overview</h4>
                    <p className="experience-card-desc">{exp.desc}</p>
                </div>

                {/* Achievements */}
                {exp.achievements && exp.achievements.length > 0 && (
                    <div className="experience-card-section">
                        <h4 className="experience-card-section-title">Achievements</h4>
                        <div className="experience-card-achievements">
                            {exp.achievements.map((item, i) => (
                                <span key={i} className="experience-card-achievement-tag">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="8" r="7" />
                                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                                    </svg>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Technologies */}
                {exp.technologies && exp.technologies.length > 0 && (
                    <div className="experience-card-section">
                        <h4 className="experience-card-section-title">Technologies</h4>
                        <div className="experience-card-tech">
                            {exp.technologies.map((tech, i) => (
                                <span key={i} className="experience-card-tech-tag">{tech}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Card Glow */}
            <div className="experience-card-glow" />
        </div>
    );
};

const ExperiencePreview = ({ onExploreClick }) => {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const [experiences, setExperiences] = useState([]);
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const data = getData(STORAGE_KEYS.INTERNSHIPS);
        const items = Array.isArray(data) ? data : [];
        setExperiences(sortExperiences(items));
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
    }, [experiences]);

    // Reset card refs when experiences change
    cardRefs.current = cardRefs.current.slice(0, experiences.length);

    // Group experiences by type for subsections
    const groupedByType = useMemo(() => {
        const groups = {};
        experiences.forEach(exp => {
            const type = exp.type || 'Other';
            if (!groups[type]) groups[type] = [];
            groups[type].push(exp);
        });
        return groups;
    }, [experiences]);

    const typeOrder = ['Experience', 'Internship', 'Research', 'Leadership', 'Education', 'Other'];

    return (
        <section className="experience-preview-section" ref={sectionRef}>
            {/* Background */}
            <div className="experience-preview-bg" />
            <div className="experience-preview-bg-2" />

            <div className="experience-preview-container">
                {/* Section Header */}
                <div className="experience-preview-header">
                    <span className="experience-preview-badge">Experience</span>
                    <h2 className="experience-preview-title">Professional Journey</h2>
                    <p className="experience-preview-subtitle">
                        A track record of delivering impactful solutions across AI, ML, and backend engineering
                    </p>
                </div>

                {/* Timeline */}
                <div className="experience-timeline">
                    {typeOrder.filter(t => groupedByType[t]).map((type) => (
                        <React.Fragment key={type}>
                            {/* Subsection Header */}
                            <div className="experience-subsection-header">
                                <div
                                    className="experience-subsection-icon"
                                    style={{ color: TYPE_ACCENTS[type] || '#6366f1' }}
                                >
                                    <i className={TYPE_ICONS[type] || 'fas fa-star'}></i>
                                </div>
                                <h3
                                    className="experience-subsection-title"
                                    style={{ color: TYPE_ACCENTS[type] || '#6366f1' }}
                                >
                                    {type}s
                                </h3>
                                <span className="experience-subsection-count">
                                    {groupedByType[type].length}
                                </span>
                            </div>

                            {/* Cards for this type */}
                            {groupedByType[type].map((exp, idx) => {
                                // Compute a stable index across all experiences for intersection observer
                                const globalIdx = experiences.indexOf(exp);
                                return (
                                    <div
                                        key={`${type}-${idx}`}
                                        data-index={globalIdx}
                                        ref={(el) => (cardRefs.current[globalIdx] = el)}
                                    >
                                        <ExperienceCard
                                            exp={exp}
                                            index={globalIdx}
                                            visibleItems={visibleItems}
                                        />
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>

                {/* View Full Experience CTA */}
                <div className="experience-preview-footer">
                    <button
                        className="experience-preview-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('experience');
                        }}
                    >
                        <span>View Full Experience</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ExperiencePreview;
