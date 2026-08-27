import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { getProjects, getFileUrl } from '../services/api';
import NeuralBackground from './NeuralBackground';
import '../styles/Projects.css';

const Projects = ({ isActive, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const rowRefs = useRef({});
  const scrollIntervals = useRef({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      const projects = Array.isArray(data) ? data : (data?.projects || []);
      if (projects.length > 0) {
        setAllProjects(projects);
      } else {
        throw new Error('No projects available');
      }
    } catch (err) {
      console.warn('Projects API load failed, falling back to local data.', err);
      const data = getData(STORAGE_KEYS.PROJECTS);
      const items = Array.isArray(data) ? data : [];
      setAllProjects(items.filter(p => !p.archived));
      setError(`Unable to load live project data (${err.message}). Showing local portfolio fallback.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      loadProjects();
    }
  }, [isActive, loadProjects]);

  const filteredProjects = useMemo(() => {
    let items = [...allProjects];

    if (priorityFilter !== 'All') {
      items = items.filter(p => priorityFilter === 'Featured' ? Boolean(p.priority) : !p.priority);
    }

    const hasCustomOrder = items.some(p => Number(p.sortOrder) > 0);
    return items.sort((a, b) => {
      if (hasCustomOrder) {
        return (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999);
      }
      if (Boolean(a.priority) !== Boolean(b.priority)) {
        return Number(Boolean(b.priority)) - Number(Boolean(a.priority));
      }
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [allProjects, priorityFilter]);

  // Group projects by category (Netflix-style rows)
  const categoryRows = useMemo(() => {
    const categories = [...new Set(filteredProjects.map(p => p.category || 'Other'))];
    return categories.map(cat => ({
      category: cat,
      projects: filteredProjects.filter(p => (p.category || 'Other') === cat)
    }));
  }, [filteredProjects]);

  // Auto-scroll logic for each row
  const startAutoScroll = useCallback((category) => {
    if (scrollIntervals.current[category]) {
      clearInterval(scrollIntervals.current[category]);
    }
    scrollIntervals.current[category] = setInterval(() => {
      const container = rowRefs.current[category];
      if (!container || hoveredRow === category) return;
      
      const maxScroll = container.scrollWidth - container.clientWidth;
      const nextPos = container.scrollLeft + 2;
      
      if (nextPos >= maxScroll) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollTo({ left: nextPos, behavior: 'smooth' });
      }
    }, 50);
  }, [hoveredRow]);

  const stopAutoScroll = useCallback((category) => {
    if (scrollIntervals.current[category]) {
      clearInterval(scrollIntervals.current[category]);
      delete scrollIntervals.current[category];
    }
  }, []);

  // Start auto-scroll for all rows when component mounts
  useEffect(() => {
    if (!isActive || filteredProjects.length === 0) return;
    
    const categories = [...new Set(filteredProjects.map(p => p.category || 'Other'))];
    categories.forEach(cat => startAutoScroll(cat));

    return () => {
      Object.values(scrollIntervals.current).forEach(interval => {
        clearInterval(interval);
      });
      scrollIntervals.current = {};
    };
  }, [isActive, allProjects, startAutoScroll]);

  // Pause/resume on hover
  const handleRowMouseEnter = (category) => {
    setHoveredRow(category);
    stopAutoScroll(category);
  };

  const handleRowMouseLeave = (category) => {
    setHoveredRow(null);
    startAutoScroll(category);
  };

  const handleCardOpen = (project, index) => {
    setSelectedProject(project);
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const navigateModal = (direction) => {
    if (!selectedProject || filteredProjects.length === 0) return;
    const currentIndex = filteredProjects.findIndex(
      (project) => project._id === selectedProject._id || project.title === selectedProject.title
    );
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % filteredProjects.length
        : (currentIndex - 1 + filteredProjects.length) % filteredProjects.length;
    setSelectedProject(filteredProjects[nextIndex]);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === 'Escape') setSelectedProject(null);
      if (e.key === 'ArrowLeft') navigateModal('prev');
      if (e.key === 'ArrowRight') navigateModal('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, filteredProjects]);

  return (
    <section id="projects" className={`section-overlay netflix-projects-section ${isActive ? 'active' : ''}`}>
      <NeuralBackground />

      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      <div className="netflix-header">
        <div className="netflix-header-content">
          <h1 className="netflix-title">Projects</h1>
          <div className="netflix-subtitle">
            <span className="netflix-badge">Interactive Portfolio</span>
            <span className="netflix-count">{allProjects.length} Projects</span>
          </div>
          <p className="netflix-description">
            Explore my work across Machine Learning, Web Development, and Data Science
          </p>
        </div>
        <div className="netflix-priority-filter">
          {['All', 'Featured', 'Standard'].map(option => (
            <button
              key={option}
              className={`netflix-priority-btn ${priorityFilter === option ? 'active' : ''}`}
              onClick={() => setPriorityFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="netflix-alert">{error}</div>}

      {loading ? (
        <div className="netflix-loading">
          <div className="netflix-loading-spinner"></div>
          <p>Loading projects...</p>
        </div>
      ) : (
        <div className="netflix-rows-container">
          {categoryRows.map((row, rowIndex) => (
            <div key={row.category} className="netflix-row">
              <div className="netflix-row-header">
                <h2 className="netflix-row-title">{row.category}</h2>
                <span className="netflix-row-count">{row.projects.length} projects</span>
              </div>
              <div
                className="netflix-row-scroll"
                ref={(el) => { if (el) rowRefs.current[row.category] = el; }}
                onMouseEnter={() => handleRowMouseEnter(row.category)}
                onMouseLeave={() => handleRowMouseLeave(row.category)}
              >
                {/* Gradient fade edges */}
                <div className="netflix-fade-left"></div>
                <div className="netflix-fade-right"></div>

                {row.projects.map((project, index) => (
                  <div
                    key={project._id || project.title || index}
                    className="netflix-card"
                    onClick={() => handleCardOpen(project, index)}
                  >
                    <div className="netflix-card-image-wrap">
                      {project.image ? (
                        <img src={getFileUrl(project.image)} alt={project.title} />
                      ) : (
                        <div className="netflix-card-no-image">
                          <i className="fas fa-code"></i>
                        </div>
                      )}
                      <div className="netflix-card-overlay">
                        <div className="netflix-card-play-btn">
                          <i className="fas fa-play"></i>
                        </div>
                      </div>
                      <div className="netflix-card-top-badge">
                        {project.priority && <span className="netflix-featured-badge">Featured</span>}
                      </div>
                    </div>
                    <div className="netflix-card-info">
                      <h3 className="netflix-card-title">{project.title}</h3>
                      <div className="netflix-card-meta">
                        {project.meta?.split('|').slice(0, 2).map((tag, i) => (
                          <span key={i} className="netflix-card-tag">{tag.trim()}</span>
                        ))}
                      </div>
                      <p className="netflix-card-desc">{project.desc?.slice(0, 100) || 'No description available.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Netflix-style Modal */}
      {selectedProject && (
        <div className="netflix-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}>
          <div className="netflix-modal">
            <button className="netflix-modal-close" onClick={() => setSelectedProject(null)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="netflix-modal-hero">
              {selectedProject.image ? (
                <img src={getFileUrl(selectedProject.image)} alt={selectedProject.title} className="netflix-modal-bg" />
              ) : null}
              <div className="netflix-modal-hero-gradient"></div>
              <div className="netflix-modal-hero-content">
                <div className="netflix-modal-badge">{selectedProject.category || 'Project'}</div>
                <h2 className="netflix-modal-title">{selectedProject.title}</h2>
                <div className="netflix-modal-actions">
                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="netflix-btn-play">
                      <i className="fas fa-play"></i> Live Demo
                    </a>
                  )}
                  {selectedProject.githubLink && selectedProject.githubLink !== '#' && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="netflix-btn-info">
                      <i className="fab fa-github"></i> Source Code
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a href={getFileUrl(selectedProject.videoUrl)} target="_blank" rel="noopener noreferrer" className="netflix-btn-info">
                      <i className="fas fa-play"></i> Watch Video
                    </a>
                  )}
                  {!selectedProject.link && !selectedProject.githubLink && !selectedProject.videoUrl && (
                    <span className="netflix-btn-disabled">
                      <i className="fas fa-lock"></i> Private Project
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="netflix-modal-body">
              <div className="netflix-modal-details">
                <h3>About This Project</h3>
                <p>{selectedProject.desc || 'No detailed description available.'}</p>
                
                {selectedProject.meta && (
                  <div className="netflix-modal-tech-section">
                    <h4>Technologies Used</h4>
                    <div className="netflix-modal-tech-stack">
                      {selectedProject.meta.split('|').map((tag, idx) => (
                        <span key={idx} className="netflix-tech-pill">{tag.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProject.priority && (
                  <div className="netflix-modal-priority">
                    <i className="fas fa-star"></i> Featured Project
                  </div>
                )}
              </div>
            </div>
          </div>

          <button className="netflix-nav-arrow netflix-nav-prev" onClick={(e) => { e.stopPropagation(); navigateModal('prev'); }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="netflix-nav-arrow netflix-nav-next" onClick={(e) => { e.stopPropagation(); navigateModal('next'); }}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="netflix-modal-counter">
            {allProjects.findIndex(p => p._id === selectedProject._id || p.title === selectedProject.title) + 1} / {allProjects.length}
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;