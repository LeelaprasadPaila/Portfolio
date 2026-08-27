import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, getFileUrl } from '../services/api';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/ProjectsPage.css';

const ProjectCard = ({ project, index, onSelect, isSelected }) => {
  const techs = project.meta?.split('|').map(t => t.trim()) || [];

  return (
    <div
      className={`proj-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(project)}
      style={{ '--card-delay': `${index * 0.05}s` }}
    >
      <div className="proj-card-image">
        {project.image ? (
          <img src={getFileUrl(project.image)} alt={project.title} loading="lazy" />
        ) : (
          <div className="proj-card-no-image">
            <i className="fas fa-code"></i>
          </div>
        )}
        <div className="proj-card-overlay">
          <div className="proj-card-play">
            <i className="fas fa-eye"></i>
          </div>
        </div>
        {project.priority && <div className="proj-card-featured">Featured</div>}
      </div>

      <div className="proj-card-body">
        <div className="proj-card-category">{project.category}</div>
        <h3 className="proj-card-title">{project.title}</h3>
        <p className="proj-card-desc">{project.desc?.slice(0, 100)}{project.desc?.length > 100 ? '...' : ''}</p>
        <div className="proj-card-techs">
          {techs.slice(0, 3).map((tech, i) => (
            <span key={i} className="proj-tech-tag">{tech}</span>
          ))}
          {techs.length > 3 && <span className="proj-tech-tag proj-tech-more">+{techs.length - 3}</span>}
        </div>
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      const items = Array.isArray(data) ? data : (data?.projects || []);
      if (items.length > 0) {
        setProjects(items);
      } else {
        throw new Error('No data');
      }
    } catch (err) {
      console.warn('Projects API failed, using local fallback.', err);
      const fallback = getData(STORAGE_KEYS.PROJECTS);
      const items = Array.isArray(fallback) ? fallback : [];
      setProjects(items.filter(p => !p.archived));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const categories = useMemo(() => {
    return ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (activeCategory !== 'All') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(p =>
        priorityFilter === 'Featured' ? Boolean(p.priority) : !p.priority
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.title?.toLowerCase().includes(q));
    }

    const hasCustomOrder = filtered.some(p => Number(p.sortOrder) > 0);
    return filtered.sort((a, b) => {
      if (hasCustomOrder) {
        return (Number(a.sortOrder) || 999) - (Number(b.sortOrder) || 999);
      }

      const aPriority = Number(Boolean(a.priority));
      const bPriority = Number(Boolean(b.priority));
      if (aPriority !== bPriority) return bPriority - aPriority;

      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [projects, activeCategory, priorityFilter, searchQuery]);

  const handleSelect = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedProject) return;
      if (e.key === 'Escape') handleCloseModal();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = projects.findIndex(p => p._id === selectedProject._id || p.title === selectedProject.title);
        const nextIndex = e.key === 'ArrowRight'
          ? (currentIndex + 1) % projects.length
          : (currentIndex - 1 + projects.length) % projects.length;
        setSelectedProject(projects[nextIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject, projects]);

  const selectedTechs = selectedProject?.meta?.split('|').map(t => t.trim()) || [];

  return (
    <div className="proj-page">
      {/* Hero */}
      <section className="proj-hero">
        <div className="proj-hero-bg">
          <div className="proj-hero-glow"></div>
          <div className="proj-hero-glow"></div>
          <div className="proj-hero-glow"></div>
        </div>
        <div className="proj-hero-content">
          <ScrollReveal>
            <div className="proj-hero-badge">Interactive Portfolio</div>
            <h1 className="proj-hero-title">
              My <span className="text-gradient">Projects</span>
            </h1>
            <p className="proj-hero-subtitle">
              A showcase of work across Machine Learning, Web Development, and Data Science.
              Each project represents a unique challenge and solution.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="proj-content">
        {/* Controls */}
        <div className="proj-controls">
          <div className="proj-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`proj-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <span className="proj-cat-count">
                  {cat === 'All' ? projects.length : projects.filter(p => p.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          <div className="proj-filters">
            <div className="proj-priority-filter">
              {['All', 'Featured', 'Standard'].map(option => (
                <button
                  key={option}
                  className={`proj-priority-btn ${priorityFilter === option ? 'active' : ''}`}
                  onClick={() => setPriorityFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="proj-search">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="proj-search-input"
              />
              {searchQuery && (
                <button className="proj-search-clear" onClick={() => setSearchQuery('')}>
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="proj-loading">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="proj-skeleton">
                <div className="proj-skeleton-img"></div>
                <div className="proj-skeleton-body">
                  <div className="proj-skeleton-line" style={{ width: '40%' }}></div>
                  <div className="proj-skeleton-line" style={{ width: '80%' }}></div>
                  <div className="proj-skeleton-line" style={{ width: '60%' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="proj-empty">
            <i className="fas fa-search"></i>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria.</p>
            <button className="proj-reset-btn" onClick={() => { setActiveCategory('All'); setPriorityFilter('All'); setSearchQuery(''); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="proj-grid">
            {filteredProjects.map((project, index) => (
              <ScrollReveal key={project._id || project.title || index} delay={index * 50}>
                <ProjectCard
                  project={project}
                  index={index}
                  onSelect={handleSelect}
                  isSelected={selectedProject?._id === project._id}
                />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {selectedProject && (
        <div className="proj-modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
          <div className="proj-modal">
            <button className="proj-modal-close" onClick={handleCloseModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="proj-modal-hero">
              {selectedProject.image ? (
                <img src={getFileUrl(selectedProject.image)} alt={selectedProject.title} className="proj-modal-bg" />
              ) : null}
              <div className="proj-modal-gradient"></div>
              <div className="proj-modal-hero-content">
                <div className="proj-modal-badge">{selectedProject.category || 'Project'}</div>
                <h2 className="proj-modal-title">{selectedProject.title}</h2>
                <div className="proj-modal-actions">
                  {selectedProject.link && selectedProject.link !== '#' && (
                    <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="proj-btn proj-btn-primary">
                      <i className="fas fa-external-link-alt"></i> Live Demo
                    </a>
                  )}
                  {selectedProject.githubLink && selectedProject.githubLink !== '#' && (
                    <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="proj-btn proj-btn-secondary">
                      <i className="fab fa-github"></i> Source Code
                    </a>
                  )}
                  {!selectedProject.link && !selectedProject.githubLink && (
                    <span className="proj-btn proj-btn-disabled">
                      <i className="fas fa-lock"></i> Private Project
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="proj-modal-body">
              <div className="proj-modal-section">
                <h3>About This Project</h3>
                <p>{selectedProject.desc || 'No detailed description available.'}</p>
              </div>

              {selectedTechs.length > 0 && (
                <div className="proj-modal-section">
                  <h4>Technologies Used</h4>
                  <div className="proj-modal-techs">
                    {selectedTechs.map((tech, i) => (
                      <span key={i} className="proj-modal-tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.priority && (
                <div className="proj-modal-featured-badge">
                  <i className="fas fa-star"></i> Featured Project
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <button className="proj-nav proj-nav-prev" onClick={(e) => { e.stopPropagation(); 
            const ci = projects.findIndex(p => p._id === selectedProject._id || p.title === selectedProject.title);
            setSelectedProject(projects[(ci - 1 + projects.length) % projects.length]);
          }}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="proj-nav proj-nav-next" onClick={(e) => { e.stopPropagation();
            const ci = projects.findIndex(p => p._id === selectedProject._id || p.title === selectedProject.title);
            setSelectedProject(projects[(ci + 1) % projects.length]);
          }}>
            <i className="fas fa-chevron-right"></i>
          </button>

          <div className="proj-modal-counter">
            {projects.findIndex(p => p._id === selectedProject._id || p.title === selectedProject.title) + 1} / {projects.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;