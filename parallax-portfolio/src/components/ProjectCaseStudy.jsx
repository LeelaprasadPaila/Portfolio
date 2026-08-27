import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFileUrl } from '../services/api';
import { projectCaseStudies } from '../data/projectsCaseStudies';
import ScrollReveal from './ScrollReveal';
import '../styles/ProjectDetail.css';

const Lightbox = ({ images, currentIndex, onClose, onNavigate }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate('prev');
      if (e.key === 'ArrowRight') onNavigate('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate]);

  return (
    <div className="lightbox-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <button className="lightbox-close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <button className="lightbox-nav lightbox-prev" onClick={() => onNavigate('prev')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </button>
      <button className="lightbox-nav lightbox-next" onClick={() => onNavigate('next')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9,6 15,12 9,18" />
        </svg>
      </button>
      <div className="lightbox-content">
        <img src={getFileUrl(images[currentIndex]?.src)} alt={images[currentIndex]?.alt} />
        <p className="lightbox-caption">{images[currentIndex]?.caption}</p>
      </div>
      <div className="lightbox-counter">{currentIndex + 1} / {images.length}</div>
    </div>
  );
};

const ExpandableCard = ({ title, children, defaultExpanded = false }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`expandable-card glass-card ${expanded ? 'expanded' : ''}`}>
      <button className="expandable-card-header" onClick={() => setExpanded(!expanded)}>
        <h3>{title}</h3>
        <svg className={`expand-icon ${expanded ? 'rotated' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9" />
        </svg>
      </button>
      <div className="expandable-card-body">
        {children}
      </div>
    </div>
  );
};

const ProjectCaseStudy = ({ projectTitle, onBack }) => {
  const navigate = useNavigate();
  const caseStudy = projectCaseStudies[projectTitle];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  if (!caseStudy) {
    return (
      <div className="case-study-container">
        <div className="case-study-not-found">
          <h2>Project Not Found</h2>
          <p>The case study for "{projectTitle}" is not available yet.</p>
          <button className="btn-premium btn-premium-primary" onClick={onBack}>
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  const { hero, problem, solution, architecture, developmentProcess, technologies, challenges, results, gallery, resources, relatedProjects } = caseStudy;

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/projects');
  };

  return (
    <div className="case-study-container">
      {/* Hero Section */}
      <section className="case-study-hero">
        <button className="case-study-back-btn" onClick={handleBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
          Back to Projects
        </button>

        <ScrollReveal>
          <div className="case-study-hero-content">
            <div className="case-study-hero-text">
              <div className="case-study-badges">
                <span className="badge">{hero.role}</span>
                <span className="badge">{hero.timeline}</span>
                <span className={`badge badge-${hero.status.toLowerCase()}`}>{hero.status}</span>
              </div>
              <h1 className="case-study-title">{hero.title}</h1>
              <p className="case-study-subtitle">{hero.subtitle}</p>
              <div className="case-study-tech-tags">
                {hero.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
            <div className="case-study-hero-image">
              <div className="image-reveal">
                <img src={getFileUrl(hero.banner)} alt={hero.title} />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Problem Section */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Problem</div>
          <h2 className="section-title">The Challenge</h2>
          <div className="case-study-problem">
            <p className="case-study-text">{problem.overview}</p>
            <div className="pain-points-grid">
              {problem.painPoints.map((point, i) => (
                <div key={i} className="pain-point-card glass-card">
                  <svg className="pain-point-icon" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p>{point}</p>
                </div>
              ))}
            </div>
            <div className="limitation-box glass-card">
              <h4>Existing Limitations</h4>
              <p>{problem.existingLimitations}</p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Solution Section */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Solution</div>
          <h2 className="section-title">Our Approach</h2>
          <div className="case-study-solution">
            <p className="case-study-text">{solution.approach}</p>
            <div className="solution-features-grid">
              {solution.keyFeatures.map((feature, i) => (
                <div key={i} className="solution-feature-card glass-card">
                  <div className="feature-number">0{i + 1}</div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
            <div className="solution-details-grid">
              <div className="glass-card solution-detail">
                <h4>Design Decisions</h4>
                <p>{solution.designDecisions}</p>
              </div>
              <div className="glass-card solution-detail">
                <h4>Engineering Approach</h4>
                <p>{solution.engineeringApproach}</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Architecture Section */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Architecture</div>
          <h2 className="section-title">System Design</h2>
          <div className="architecture-content">
            <ExpandableCard title="System Architecture" defaultExpanded={true}>
              <div className="architecture-diagram glass-card">
                <div className="arch-node arch-input">Input</div>
                <div className="arch-arrow">→</div>
                <div className="arch-node arch-process">Process</div>
                <div className="arch-arrow">→</div>
                <div className="arch-node arch-output">Output</div>
              </div>
              <p>{architecture.systemDesign}</p>
            </ExpandableCard>

            <ExpandableCard title="Database Design">
              <p>{architecture.databaseDesign}</p>
            </ExpandableCard>

            <ExpandableCard title="API Flow">
              <div className="api-flow glass-card">
                {architecture.apiFlow.split(' -> ').map((step, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="api-step">{step}</span>
                    {i < arr.length - 1 && <span className="api-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </ExpandableCard>

            <ExpandableCard title="Folder Structure">
              <div className="folder-structure">
                {architecture.folderStructure.map((item, i) => (
                  <div key={i} className="folder-item">{item}</div>
                ))}
              </div>
            </ExpandableCard>

            <ExpandableCard title="Deployment Workflow">
              <div className="deployment-flow">
                {architecture.deploymentWorkflow.split(' -> ').map((step, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="deploy-step glass-card">{step}</span>
                    {i < arr.length - 1 && <span className="deploy-arrow">→</span>}
                  </React.Fragment>
                ))}
              </div>
            </ExpandableCard>
          </div>
        </ScrollReveal>
      </section>

      {/* Development Timeline */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Process</div>
          <h2 className="section-title">Development Timeline</h2>
          <div className="development-timeline">
            <div className="timeline-line"></div>
            {developmentProcess.map((phase, i) => (
              <div key={i} className="timeline-item" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                </div>
                <div className="timeline-content glass-card">
                  <div className="timeline-header">
                    <h3>{phase.phase}</h3>
                    <span className="timeline-duration">{phase.duration}</span>
                  </div>
                  <ul className="timeline-tasks">
                    {phase.tasks.map((task, j) => (
                      <li key={j}>{task}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Technologies */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Tech Stack</div>
          <h2 className="section-title">Technologies Used</h2>
          <div className="tech-comparison-grid">
            {technologies.map((tech, i) => (
              <div key={i} className="tech-comparison-card glass-card">
                <div className="tech-card-header">
                  <i className={tech.icon}></i>
                  <h3>{tech.name}</h3>
                </div>
                <div className="tech-card-body">
                  <div className="tech-detail">
                    <span className="tech-label">Purpose</span>
                    <p>{tech.purpose}</p>
                  </div>
                  <div className="tech-detail">
                    <span className="tech-label">Why Chosen</span>
                    <p>{tech.whyChosen}</p>
                  </div>
                  <div className="tech-detail">
                    <span className="tech-label">Alternatives</span>
                    <p className="tech-alternatives">{tech.alternatives}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Challenges */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Challenges</div>
          <h2 className="section-title">Problems Solved</h2>
          <div className="challenges-grid">
            {challenges.map((challenge, i) => (
              <div key={i} className={`challenge-card glass-card challenge-${challenge.severity.toLowerCase()}`}>
                <div className="challenge-header">
                  <span className={`challenge-severity ${challenge.severity.toLowerCase()}`}>
                    {challenge.severity}
                  </span>
                  <h3>{challenge.title}</h3>
                </div>
                <p>{challenge.description}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Results */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Results</div>
          <h2 className="section-title">Impact & Metrics</h2>
          <div className="results-content">
            <div className="result-hero glass-card">
              <span className="result-performance">{results.performance}</span>
            </div>
            <div className="metrics-grid">
              {results.metrics.map((metric, i) => (
                <div key={i} className="metric-card glass-card">
                  <span className="metric-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
                    </svg>
                  </span>
                  <p>{metric}</p>
                </div>
              ))}
            </div>
            <div className="achievements-section">
              <h3>Achievements</h3>
              <ul className="achievements-list">
                {results.achievements.map((achievement, i) => (
                  <li key={i} className="achievement-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald)" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22,4 12,14.01 9,11.01" />
                    </svg>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
            <div className="future-roadmap glass-card">
              <h3>Future Roadmap</h3>
              <div className="roadmap-items">
                {results.futureRoadmap.map((item, i) => (
                  <div key={i} className="roadmap-item">
                    <span className="roadmap-number">0{i + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Gallery */}
      {gallery && gallery.length > 0 && (
        <section className="case-study-section">
          <ScrollReveal>
            <div className="section-label">Gallery</div>
            <h2 className="section-title">Screenshots & Media</h2>
            <div className="gallery-grid">
              {gallery.map((item, i) => (
                <div
                  key={i}
                  className="gallery-item glass-card"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                >
                  <img src={getFileUrl(item.src)} alt={item.alt} />
                  <div className="gallery-item-overlay">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                    <span>{item.caption}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Resources */}
      <section className="case-study-section">
        <ScrollReveal>
          <div className="section-label">Resources</div>
          <h2 className="section-title">Links & Downloads</h2>
          <div className="resources-grid">
            {resources.github && resources.github !== '#' && (
              <a href={resources.github} target="_blank" rel="noopener noreferrer" className="resource-card glass-card">
                <i className="fab fa-github"></i>
                <span>GitHub Repository</span>
              </a>
            )}
            {resources.liveDemo && resources.liveDemo !== '#' && (
              <a href={resources.liveDemo} target="_blank" rel="noopener noreferrer" className="resource-card glass-card">
                <i className="fas fa-external-link-alt"></i>
                <span>Live Demo</span>
              </a>
            )}
            {resources.documentation && resources.documentation !== '#' && (
              <a href={resources.documentation} target="_blank" rel="noopener noreferrer" className="resource-card glass-card">
                <i className="fas fa-file-alt"></i>
                <span>Documentation</span>
              </a>
            )}
            {resources.presentation && resources.presentation !== '#' && (
              <a href={resources.presentation} target="_blank" rel="noopener noreferrer" className="resource-card glass-card">
                <i className="fas fa-presentation"></i>
                <span>Presentation</span>
              </a>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* Related Projects */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="case-study-section">
          <ScrollReveal>
            <div className="section-label">Explore More</div>
            <h2 className="section-title">Related Projects</h2>
            <div className="related-projects-grid">
              {relatedProjects.map((project, i) => {
                const related = projectCaseStudies[project];
                return (
                  <div key={i} className="related-project-card glass-card" onClick={() => navigate(`/project/${encodeURIComponent(project)}`)}>
                    <div className="related-project-image">
                      <img src={getFileUrl(related?.hero?.banner || 'images/projects/project-1-thumb.png')} alt={project} />
                    </div>
                    <div className="related-project-info">
                      <h3>{project}</h3>
                      <p>{related?.hero?.subtitle?.slice(0, 80)}...</p>
                      <span className="tech-tag">{related?.hero?.technologies?.[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollReveal>
        </section>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={gallery}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={(dir) => {
            setLightboxIndex(prev => {
              if (dir === 'next') return (prev + 1) % gallery.length;
              return (prev - 1 + gallery.length) % gallery.length;
            });
          }}
        />
      )}
    </div>
  );
};

export default ProjectCaseStudy;