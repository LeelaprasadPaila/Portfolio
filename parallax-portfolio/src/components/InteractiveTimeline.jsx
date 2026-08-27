import React, { useState, useEffect, useRef } from 'react';
import { getInternships, getCertificates } from '../services/api';
import './InteractiveTimeline.css';

const InteractiveTimeline = ({ items = [], onItemClick }) => {
    const [filter, setFilter] = useState('all');
    const [visibleItems, setVisibleItems] = useState([]);
    const [activeItem, setActiveItem] = useState(null);
    const timelineRef = useRef(null);

    const categories = [
        { id: 'all', label: 'All', icon: '📋' },
        { id: 'Internship', label: 'Internships', icon: '💼' },
        { id: 'Experience', label: 'Experience', icon: '🚀' },
        { id: 'Education', label: 'Education', icon: '🎓' },
        { id: 'Certificate', label: 'Certificates', icon: '🏆' },
        { id: 'Project', label: 'Projects', icon: '⚡' }
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('timeline-item-visible');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        const items = document.querySelectorAll('.timeline-item');
        items.forEach(item => observer.observe(item));

        return () => observer.disconnect();
    }, [filter, items]);

    const filteredItems = filter === 'all' 
        ? items 
        : items.filter(item => item.type === filter || item.category === filter);

    const getItemIcon = (type) => {
        switch (type) {
            case 'Internship': return '💼';
            case 'Experience': return '🚀';
            case 'Education': return '🎓';
            case 'Certificate': return '🏆';
            case 'Project': return '⚡';
            default: return '📌';
        }
    };

    const getItemColor = (type) => {
        switch (type) {
            case 'Internship': return '#3b82f6';
            case 'Experience': return '#8b5cf6';
            case 'Education': return '#10b981';
            case 'Certificate': return '#f59e0b';
            case 'Project': return '#ec4899';
            default: return '#00f2ff';
        }
    };

    return (
        <div className="interactive-timeline" ref={timelineRef}>
            <div className="timeline-header">
                <h2 className="timeline-title">My Journey</h2>
                <p className="timeline-subtitle">Education, Experience & Achievements</p>
            </div>

            <div className="timeline-filters">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`timeline-filter-btn ${filter === cat.id ? 'timeline-filter-active' : ''}`}
                        onClick={() => setFilter(cat.id)}
                    >
                        <span className="timeline-filter-icon">{cat.icon}</span>
                        <span className="timeline-filter-label">{cat.label}</span>
                    </button>
                ))}
            </div>

            <div className="timeline-container">
                <div className="timeline-line" />
                
                {filteredItems.length === 0 ? (
                    <div className="timeline-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <p>No items found for this category</p>
                    </div>
                ) : (
                    <div className="timeline-items">
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id || index}
                                className={`timeline-item ${index % 2 === 0 ? 'timeline-item-left' : 'timeline-item-right'} ${activeItem === index ? 'timeline-item-active' : ''}`}
                                style={{ '--item-color': getItemColor(item.type || item.category) }}
                                onClick={() => {
                                    setActiveItem(index);
                                    onItemClick?.(item);
                                }}
                            >
                                <div className="timeline-dot">
                                    <span className="timeline-dot-icon">{getItemIcon(item.type || item.category)}</span>
                                </div>
                                
                                <div className="timeline-content">
                                    <div className="timeline-date">
                                        {item.duration || item.date || 'Ongoing'}
                                    </div>
                                    <h3 className="timeline-title-item">
                                        {item.role || item.title}
                                    </h3>
                                    <h4 className="timeline-subtitle-item">
                                        {item.company || item.issuer || item.institution}
                                    </h4>
                                    <p className="timeline-description">
                                        {item.desc}
                                    </p>
                                    {item.skills && (
                                        <div className="timeline-skills">
                                            {item.skills.slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="timeline-skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveTimeline;