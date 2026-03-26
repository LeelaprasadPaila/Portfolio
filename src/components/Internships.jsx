import React, { useState, useEffect, useCallback } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { getInternships, getFileUrl } from '../services/api';
import NeuralBackground from './NeuralBackground';
import '../styles/Internships.css';

const Internships = ({ isActive, onClose }) => {
    const [allExp, setAllExp] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadInternships = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInternships();
            if (Array.isArray(data) && data.length > 0) {
                setAllExp(data);
            } else {
                throw new Error('No internships found');
            }
        } catch (err) {
            console.warn('Internships API load failed, falling back to local data.', err);
            const data = getData(STORAGE_KEYS.INTERNSHIPS);
            setAllExp(data || []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isActive) {
            loadInternships();
        }
    }, [isActive, loadInternships]);

    const filteredExp = allExp
        .filter(item => {
            if (filter === 'All') return true;
            return item.type === filter;
        })
        .sort((a, b) => {
            // Sort: Internship > Experience
            const order = { 'Internship': 1, 'Experience': 2 };
            const typeA = order[a.type] || 99;
            const typeB = order[b.type] || 99;
            if (typeA !== typeB) return typeA - typeB;
            
            // Then by priority (robust check for boolean or string)
            const prioA = (a.priority === true || a.priority === 'true') ? 1 : 0;
            const prioB = (b.priority === true || b.priority === 'true') ? 1 : 0;
            return prioB - prioA;
        });

    return (
        <section id="internships" className={`section-overlay ${isActive ? 'active' : ''}`}>
            <NeuralBackground />

            <button className="close-btn" onClick={onClose} style={{ zIndex: 100 }}>
                <i className="fas fa-times"></i>
            </button>

            <div className="container" style={{ marginTop: '120px', paddingBottom: '5rem' }}>
                <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '4px' }}>
                        CAREER <span style={{ color: 'var(--primary-color)' }}>TIMELINE</span>
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto' }}>
                        A chronological record of professional experience and key internships in AI & Web Development.
                    </p>
                </div>

                <div className="exp-filter-nav">
                    {['All', 'Internship', 'Experience'].map(cat => (
                        <button
                            key={cat}
                            className={`exp-filter-btn ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat === 'All' ? 'ALL PHASES' : cat.toUpperCase() + (cat === 'Experience' ? '' : 'S')}
                        </button>
                    ))}
                </div>

                <div className="internships-container">
                    <div className="experience-timeline">
                        <div className="timeline-line"></div>

                        {filteredExp.length > 0 ? (
                            filteredExp.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`timeline-item ${isActive ? 'active' : ''}`}
                                    style={{ transitionDelay: `${idx * 0.1}s` }}
                                >
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="experience-type-badge">{item.type}</div>

                                        <div className="timeline-header">
                                            <div className="timeline-main-info">
                                                <h3>{item.role}</h3>
                                                <div className="company-name">
                                                    <i className={item.type === 'Experience' ? "fas fa-building" : "fas fa-flask"}></i>
                                                    {item.company}
                                                </div>
                                            </div>
                                            <div className="timeline-duration">
                                                <i className="far fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                                                {item.duration}
                                            </div>
                                        </div>

                                        <p className="timeline-desc">{item.desc}</p>

                                        {item.image && (
                                            <img src={getFileUrl(item.image)} alt={item.company} className="timeline-image-preview" onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling && (e.target.nextElementSibling.style.display='flex'); }} />
                                        )}

                                        <div className="timeline-footer" style={{ marginTop: '2rem' }}>
                                            <div className="tech-stack-row" style={{ display: 'flex', gap: '1rem' }}>
                                                <span className="tech-badge" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--primary-color)', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                    <i className={item.type === 'Internship' ? "fas fa-shield-alt" : "fas fa-briefcase"} style={{ marginRight: '6px' }}></i>
                                                    {item.type === 'Internship' ? 'Internship Phase' : 'Work Experience'}
                                                </span>
                                            </div>
                                            {item.link && item.link !== '#' && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="timeline-link">
                                                    VIEW ARTIFACT <i className="fas fa-external-link-alt"></i>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.2)' }}>
                                <i className="fas fa-database" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                                <p>No records found in this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Internships;
