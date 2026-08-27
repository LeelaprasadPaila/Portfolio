import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInternships } from '../services/api';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/ExperiencePage.css';

const TYPE_ICONS = {
  Internship: { icon: 'fas fa-briefcase', color: '#00f2ff' },
  Experience: { icon: 'fas fa-flask', color: '#8b5cf6' },
  Research: { icon: 'fas fa-microscope', color: '#10b981' },
  Leadership: { icon: 'fas fa-crown', color: '#f59e0b' },
  Education: { icon: 'fas fa-graduation-cap', color: '#ec4899' }
};

// Helper: parse a duration string like "Jan 2024 - Feb 2024" or "ongoing" into a sortable date
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
    if (month !== undefined && !isNaN(year)) {
      return new Date(year, month, 1);
    }
  }
  const yearMatch = startStr.match(/(\d{4})/);
  if (yearMatch) {
    return new Date(parseInt(yearMatch[1]), 0, 1);
  }
  return new Date(0);
};

// Respect sortOrder from backend (admin reorder, non-zero means custom order applied), fall back to duration-based sort
const sortExperiences = (items) => {
  const hasCustomOrder = items.some(item => item.sortOrder && item.sortOrder > 0);
  if (hasCustomOrder) {
    return [...items].sort((a, b) => (a.sortOrder || 999) - (b.sortOrder || 999));
  }

  const typeRank = {
    Experience: 0,
    Internship: 1,
    Research: 2,
    Leadership: 3,
    Education: 4,
    Other: 5,
  };

  return [...items].sort((a, b) => {
    const aIsTopCompany = (a.company || '').toLowerCase().includes('a2z');
    const bIsTopCompany = (b.company || '').toLowerCase().includes('a2z');

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

const ExperiencePage = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getInternships();
      const items = Array.isArray(data) ? data : [];
      if (items.length > 0) {
        setExperiences(sortExperiences(items));
      } else {
        throw new Error('No data');
      }
    } catch (err) {
      const fallback = getData(STORAGE_KEYS.INTERNSHIPS);
      setExperiences(sortExperiences(Array.isArray(fallback) ? fallback : []));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperiences();
  }, [loadExperiences]);

  const filters = useMemo(() => {
    const types = ['All', ...new Set(experiences.map(exp => exp.type).filter(Boolean))];
    return types;
  }, [experiences]);

  const filteredExperiences = useMemo(() => {
    if (activeFilter === 'All') return experiences;
    return experiences.filter(exp => exp.type === activeFilter);
  }, [experiences, activeFilter]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeStyle = (type) => {
    return TYPE_ICONS[type] || { icon: 'fas fa-star', color: '#6366f1' };
  };

  return (
    <div className="experience-page">
      {/* Hero Section */}
      <section className="exp-hero">
        <div className="exp-hero-bg">
          <div className="exp-hero-particle"></div>
          <div className="exp-hero-particle"></div>
          <div className="exp-hero-particle"></div>
        </div>
        <div className="exp-hero-content">
          <ScrollReveal>
            <div className="exp-hero-badge">Career Journey</div>
            <h1 className="exp-hero-title">
              Professional <span className="text-gradient">Experience</span>
            </h1>
            <p className="exp-hero-subtitle">
              A timeline of growth — from internships and research to independent engineering and leadership.
            </p>
          </ScrollReveal>
          <div className="exp-hero-stats">
            {['Total', ...filters.filter(f => f !== 'All')].slice(0, 4).map(stat => (
              <div key={stat} className="exp-hero-stat">
                <span className="exp-hero-stat-value">
                  {stat === 'Total' ? experiences.length : experiences.filter(e => e.type === stat).length}
                </span>
                <span className="exp-hero-stat-label">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="exp-section">
        {/* Filter Bar */}
        <ScrollReveal>
          <div className="exp-filter-bar">
            {filters.map(filter => {
              const typeInfo = getTypeStyle(filter);
              return (
                <button
                  key={filter}
                  className={`exp-filter-btn ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                  style={{ '--filter-accent': typeInfo.color }}
                >
                  {filter !== 'All' && <i className={typeInfo.icon}></i>}
                  <span>{filter}</span>
                  <span className="exp-filter-count">
                    {filter === 'All' ? experiences.length : experiences.filter(e => e.type === filter).length}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Loading State */}
        {loading ? (
          <div className="exp-loading">
            {[1, 2, 3].map(i => (
              <div key={i} className="exp-skeleton">
                <div className="exp-skeleton-dot"></div>
                <div className="exp-skeleton-body">
                  <div className="exp-skeleton-line" style={{ width: '60%' }}></div>
                  <div className="exp-skeleton-line" style={{ width: '40%' }}></div>
                  <div className="exp-skeleton-line" style={{ width: '80%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Timeline */
          <div className="exp-timeline">
            <div className="exp-timeline-track"></div>
            {filteredExperiences.length === 0 ? (
              <div className="exp-empty">
                <i className="fas fa-search"></i>
                <h3>No experiences found</h3>
                <p>Try selecting a different filter category.</p>
              </div>
            ) : (
              filteredExperiences.map((exp, index) => {
                const typeInfo = getTypeStyle(exp.type);
                const isExpanded = expandedId === (exp._id || index);
                return (
                  <ScrollReveal key={exp._id || index} delay={index * 100}>
                    <div
                      className={`exp-card ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleExpand(exp._id || index)}
                      style={{ '--card-accent': typeInfo.color }}
                    >
                      {/* Timeline Dot */}
                      <div className="exp-card-dot" style={{ background: typeInfo.color, boxShadow: `0 0 20px ${typeInfo.color}40` }}>
                        <i className={typeInfo.icon}></i>
                      </div>

                      {/* Card Header */}
                      <div className="exp-card-header">
                        <div className="exp-card-type">
                          <span className="exp-type-badge" style={{
                            background: `${typeInfo.color}20`,
                            color: typeInfo.color,
                            borderColor: `${typeInfo.color}40`
                          }}>
                            <i className={typeInfo.icon}></i>
                            {exp.type}
                          </span>
                          {exp.priority && <span className="exp-featured">Featured</span>}
                        </div>
                        <div className="exp-card-meta">
                          <h3 className="exp-card-role">{exp.role}</h3>
                          <h4 className="exp-card-company">{exp.company}</h4>
                          <span className="exp-card-duration">
                            <i className="fas fa-calendar-alt"></i>
                            {exp.duration}
                          </span>
                        </div>
                      </div>

                      {/* Card Preview */}
                      <div className="exp-card-preview">
                        <p className="exp-card-desc">
                          {exp.desc?.slice(0, 150)}
                          {exp.desc?.length > 150 ? '...' : ''}
                        </p>
                        <div className="exp-expand-indicator">
                          <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
                          <i className={`fas fa-chevron-down ${isExpanded ? 'rotated' : ''}`}></i>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <div className={`exp-card-details ${isExpanded ? 'open' : ''}`}>
                        <div className="exp-details-inner">
                          {/* Full Description */}
                          <div className="exp-detail-section">
                            <h4 className="exp-detail-title">
                              <i className="fas fa-align-left"></i>
                              Full Description
                            </h4>
                            <p className="exp-detail-text">{exp.desc}</p>
                          </div>

                          {/* Technologies */}
                          {exp.technologies && exp.technologies.length > 0 && (
                            <div className="exp-detail-section">
                              <h4 className="exp-detail-title">
                                <i className="fas fa-code"></i>
                                Technologies Used
                              </h4>
                              <div className="exp-tech-grid">
                                {exp.technologies.map((tech, i) => (
                                  <span key={i} className="exp-tech-tag">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Achievements */}
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="exp-detail-section">
                              <h4 className="exp-detail-title">
                                <i className="fas fa-trophy"></i>
                                Key Achievements
                              </h4>
                              <ul className="exp-achievements-list">
                                {exp.achievements.map((ach, i) => (
                                  <li key={i} className="exp-achievement-item">
                                    <i className="fas fa-check-circle"></i>
                                    <span>{ach}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Certificate Link */}
                          {exp.link && exp.link !== '#' && (
                            <a
                              href={exp.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="exp-cert-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <i className="fas fa-external-link-alt"></i>
                              View Certificate
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="exp-cta">
        <ScrollReveal>
          <div className="exp-cta-card">
            <div className="exp-cta-glow"></div>
            <h2 className="exp-cta-title">Want to work together?</h2>
            <p className="exp-cta-text">
              I'm always open to new opportunities, collaborations, and interesting projects.
            </p>
            <div className="exp-cta-actions">
              <button className="exp-btn exp-btn-primary" onClick={() => navigate('/contact')}>
                <i className="fas fa-envelope"></i>
                Get in Touch
              </button>
              <button className="exp-btn exp-btn-secondary" onClick={() => navigate('/resume')}>
                <i className="fas fa-file-alt"></i>
                View Resume
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default ExperiencePage;