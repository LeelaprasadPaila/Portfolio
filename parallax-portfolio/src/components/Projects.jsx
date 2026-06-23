import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { getProjects, getFileUrl } from '../services/api';
import NeuralBackground from './NeuralBackground';
import '../styles/Projects.css';

const Projects = ({ isActive, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef({});

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
      setAllProjects(Array.isArray(data) ? data : []);
      setError('Unable to load live project data. Showing local portfolio fallback.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      loadProjects();
    }
  }, [isActive, loadProjects]);

  const categories = useMemo(() => {
    return ['All', ...new Set(allProjects.map((project) => project.category || 'Other'))];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return allProjects;
    return allProjects.filter((project) => project.category === activeCategory);
  }, [allProjects, activeCategory]);

  const featuredCount = allProjects.filter((project) => project.priority === true || project.priority === 'true').length;
  const liveCount = allProjects.filter((project) => project.link && project.link !== '#').length;

  const scrollAction = (dir, groupKey) => {
    const container = scrollRef.current[groupKey];
    if (!container) return;

    const offset = Math.round(container.clientWidth * 0.85);
    const target = dir === 'next' ? container.scrollLeft + offset : container.scrollLeft - offset;
    container.scrollTo({ left: target, behavior: 'smooth' });
  };

  const handleCardOpen = (project) => {
    setSelectedProject(project);
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
    if (!selectedProject || allProjects.length === 0) return;
    const currentIndex = allProjects.findIndex((project) => project._id === selectedProject._id || project.title === selectedProject.title);
    const nextIndex = direction === 'next'
      ? (currentIndex + 1) % allProjects.length
      : (currentIndex - 1 + allProjects.length) % allProjects.length;
    setSelectedProject(allProjects[nextIndex]);
  };

  return (
    <section id="projects" className={`section-overlay project-cinematic-section ${isActive ? 'active' : ''}`}>
      <NeuralBackground />

      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      <div className="projects-shell">
        <div className="projects-intro">
          <div>
            <span className="projects-label">Project Showcase</span>
            <h2 className="projects-heading">Interactive Portfolio Projects</h2>
            <p className="projects-description">
              Browse the complete project portfolio with strong visibility, clear metadata, and easy navigation.
            </p>
          </div>

          <div className="projects-stats">
            <div className="stat-card">
              <strong>{allProjects.length}</strong>
              <span>Total Projects</span>
            </div>
            <div className="stat-card">
              <strong>{featuredCount}</strong>
              <span>Featured</span>
            </div>
            <div className="stat-card">
              <strong>{liveCount}</strong>
              <span>Live Demos</span>
            </div>
          </div>
        </div>

        {error && <div className="projects-alert">{error}</div>}

        <div className="project-category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-tab ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="project-scroller-wrap">
          <button className="project-scroll-btn prev" onClick={() => scrollAction('prev', activeCategory)}>
            <i className="fas fa-chevron-left"></i>
          </button>

          <div
            className="projects-rolling-container"
            ref={(el) => { if (el) scrollRef.current[activeCategory] = el; }}
          >
            {loading ? (
              <div className="project-loading">Loading projects...</div>
            ) : filteredProjects.length === 0 ? (
              <div className="project-empty">No projects found for this category.</div>
            ) : (
              filteredProjects.map((project, index) => (
                <div key={project._id || project.title || index} className="project-slide-card">
                  <div className="project-card-inner" onClick={() => handleCardOpen(project)}>
                    <div className="project-image-wrap">
                      {project.image ? (
                        <img src={getFileUrl(project.image)} alt={project.title} />
                      ) : (
                        <div className="project-image-empty">No preview</div>
                      )}
                      <div className="project-type-tag">{project.category || 'Project'}</div>
                    </div>

                    <div className="project-info-minimal">
                      <div className="project-title-row">
                        <h4>{project.title}</h4>
                        {project.priority && <span className="project-featured-pill">Featured</span>}
                      </div>
                      <p>{project.desc?.slice(0, 120) || 'A concise project summary is not available.'}</p>
                      <div className="project-card-footer">
                        <span>Explore Project</span>
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button className="project-scroll-btn next" onClick={() => scrollAction('next', activeCategory)}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {selectedProject && (
        <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}>
          <button className="modal-nav modal-prev" onClick={(e) => { e.stopPropagation(); navigateModal('prev'); }}>
            <i className="fas fa-chevron-left"></i>
          </button>

          <div className="modal-content cinematic-modal">
            <button className="modal-close" onClick={() => setSelectedProject(null)}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-body">
              <div className="modal-left">
                <div className="modal-image-container">
                  {selectedProject.videoUrl ? (
                    <video
                      src={getFileUrl(selectedProject.videoUrl)}
                      controls
                      className="modal-video"
                      poster={getFileUrl(selectedProject.image)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedProject.image ? (
                    <img src={getFileUrl(selectedProject.image)} alt={selectedProject.title} className="modal-image" />
                  ) : (
                    <div className="modal-image-empty">No preview available</div>
                  )}
                </div>
              </div>

              <div className="modal-right">
                <div className="modal-category-badge">{selectedProject.category || 'Project'}</div>
                <h2 className="modal-title">{selectedProject.title}</h2>
                <div className="modal-detail-row">
                  <span className="project-detail-label">Category</span>
                  <span>{selectedProject.category || 'General'}</span>
                </div>
                {selectedProject.priority && <div className="project-priority-label">Priority Project</div>}

                <div className="modal-tech-stack">
                  {selectedProject.meta?.split('|').map((tag, idx) => (
                    <span key={idx} className="tech-pill">{tag.trim()}</span>
                  ))}
                </div>

                <div className="modal-divider"></div>
                <p className="modal-description">{selectedProject.desc || 'No detailed description available.'}</p>

                <div className="modal-actions">
                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="btn-modal-primary">
                      <i className="fas fa-external-link-alt"></i> Live Demo
                    </a>
                  )}
                  {selectedProject.githubLink && selectedProject.githubLink !== '#' && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn-modal-secondary">
                      <i className="fab fa-github"></i> Source Code
                    </a>
                  )}
                  {selectedProject.videoUrl && (
                    <a href={getFileUrl(selectedProject.videoUrl)} target="_blank" rel="noopener noreferrer" className="btn-modal-secondary">
                      <i className="fas fa-play"></i> Watch Video
                    </a>
                  )}
                  {!selectedProject.link && !selectedProject.githubLink && !selectedProject.videoUrl && (
                    <span className="btn-modal-disabled">
                      <i className="fas fa-code"></i> Private Project
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button className="modal-nav modal-next" onClick={(e) => { e.stopPropagation(); navigateModal('next'); }}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </section>
  );
};

export default Projects;
