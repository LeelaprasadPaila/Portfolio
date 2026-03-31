import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { getProjects, getFileUrl } from '../services/api';
import NeuralBackground from './NeuralBackground';
import gsap from 'gsap';
import '../styles/Projects.css';

const Projects = ({ isActive, onClose }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef({});
  const autoSlideInterval = useRef(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      if (Array.isArray(data) && data.length > 0) {
        setAllProjects(data);
      } else {
        throw new Error('No projects found');
      }
    } catch (err) {
      console.warn('Projects API load failed, falling back to local data.', err);
      const data = getData(STORAGE_KEYS.PROJECTS);
      setAllProjects(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      loadProjects();
    }
  }, [isActive, loadProjects]);

  const categories = ["All", ...new Set(allProjects.map(p => p.category))];

  // Logic to determine which categories to show
  // If "All" is selected, show grouped categories (except "All" itself as a group)
  // If a specific category is selected, just show that one.
  const projectGroups = useMemo(() => {
    if (allProjects.length === 0) return [];

    if (activeCategory !== "All") {
      const projects = allProjects.filter(p => p.category === activeCategory);
      return projects.length > 0 ? [{ title: activeCategory, projects }] : [];
    } else {
      // Show all categories separately
      const distinctCats = [...new Set(allProjects.map(p => p.category))];
      return distinctCats.map(cat => ({
        title: cat,
        projects: allProjects.filter(p => p.category === cat)
      }));
    }
  }, [allProjects, activeCategory]);

  // Keyboard support 
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isActive) return;

      const key = e.key.toLowerCase();

      // ESC to close modal (if open) or close section
      if (e.key === 'Escape') {
        if (selectedProject) {
          setSelectedProject(null);
        } else {
          onClose();
        }
        return;
      }

      if (selectedProject) {
        // Modal navigation
        if (key === 'arrowright' || key === 'd') navigateModal('next');
        if (key === 'arrowleft' || key === 'a') navigateModal('prev');
        return;
      }

      // Slider navigation
      if (key === 'arrowright' || key === 'd') {
        if (projectGroups.length > 0) slideAction('next', projectGroups[0].title);
      } else if (key === 'arrowleft' || key === 'a') {
        if (projectGroups.length > 0) slideAction('prev', projectGroups[0].title);
      } else if (key === 'arrowdown' || key === 's') {
        const currentIndex = categories.indexOf(activeCategory);
        if (currentIndex < categories.length - 1) setActiveCategory(categories[currentIndex + 1]);
      } else if (key === 'arrowup' || key === 'w') {
        const currentIndex = categories.indexOf(activeCategory);
        if (currentIndex > 0) setActiveCategory(categories[currentIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, selectedProject, activeCategory, projectGroups, categories]);

  // Auto-sliding 
  useEffect(() => {
    if (isActive && !selectedProject && projectGroups.length > 0) {
      autoSlideInterval.current = setInterval(() => {
        projectGroups.forEach(group => {
          slideAction('next', group.title, true);
        });
      }, 3000);
    } else {
      clearInterval(autoSlideInterval.current);
    }
    return () => clearInterval(autoSlideInterval.current);
  }, [isActive, selectedProject, projectGroups]);

  const slideAction = (dir, catTitle, isAuto = false) => {
    const container = scrollRef.current[catTitle];
    if (container) {
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const currentScroll = container.scrollLeft;
      const scrollAmount = dir === 'next' ? 400 : -400;

      if (isAuto && dir === 'next' && currentScroll + clientWidth >= scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const navigateModal = (direction) => {
    if (!selectedProject) return;
    const currentIndex = allProjects.findIndex(p => p.title === selectedProject.title);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % allProjects.length;
    } else {
      nextIndex = (currentIndex - 1 + allProjects.length) % allProjects.length;
    }
    setSelectedProject(allProjects[nextIndex]);
  };

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  return (
    <section id="projects" className={`section-overlay project-cinematic-section ${isActive ? 'active' : ''}`}>
      <NeuralBackground />

      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      <div className="container" style={{ marginTop: '120px', paddingBottom: '5rem' }}>
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '3rem', textTransform: 'uppercase', letterSpacing: '4px' }}>
            PROJECT <span style={{ color: 'var(--primary-color)' }}>PORTFOLIO</span>
          </h2>
          <div className="project-category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {projectGroups.map((group, gIdx) => (
          <div
            key={gIdx}
            className="project-category-row"
            style={{ marginBottom: '4rem' }}
          >
            <div className="category-header">
              <div className="category-info">
                <h3 className="category-title">{group.title}</h3>
              </div>
            </div>

            <div
              className="projects-rolling-container"
              ref={el => scrollRef.current[group.title] = el}
            >
              {group.projects.map((project, pIdx) => (
                <div
                  key={pIdx}
                  className="project-slide-card"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-card-inner">
                    <div className="project-image-wrap">
                      <img src={getFileUrl(project.image)} alt={project.title} onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling && (e.target.nextElementSibling.style.display='flex'); }} />
                      <div className="project-type-tag">{project.meta?.split('|')[1]?.trim() || "PROJECT"}</div>
                    </div>
                    <div className="project-info-minimal">
                      <h4>{project.title}</h4>
                      <p>{project.desc?.substring(0, 60)}...</p>
                      <div className="project-card-footer">
                        <span>EXPLORE</span>
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {projectGroups.length === 0 && (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginTop: '5rem' }}>
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="modal-overlay active" style={{ zIndex: 5000 }} onClick={(e) => e.target === e.currentTarget && setSelectedProject(null)}>
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
                  <img src={getFileUrl(selectedProject.image)} alt={selectedProject.title} className="modal-image" />
                </div>
              </div>
              <div className="modal-right">
                <div className="modal-category-badge">{selectedProject.category}</div>
                <h2 className="modal-title">{selectedProject.title}</h2>
                <div className="modal-tech-stack">
                  {selectedProject.meta?.split('|').map((t, i) => (
                    <span key={i} className="tech-pill">{t.trim()}</span>
                  ))}
                </div>
                <div className="modal-divider"></div>
                <p className="modal-description">{selectedProject.desc}</p>
                <div className="modal-actions">
                  <a href={selectedProject.link === '#' ? 'javascript:void(0)' : selectedProject.link} target="_blank" rel="noopener noreferrer" className="btn-modal-primary">
                    <i className="fas fa-external-link-alt"></i> LIVE DEMO
                  </a>
                  <a href="#" className="btn-modal-secondary">
                    <i className="fab fa-github"></i> SOURCE
                  </a>
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
