import React, { useEffect, useRef, useState } from 'react';
import '../styles/FeaturedProjects.css';
import { assetUrl } from '../config/env';

const featuredProjects = [
    {
        title: 'Recommendation System',
        description: 'Collaborative filtering model using Matrix Factorization to predict user preferences with high precision across large-scale datasets.',
        problem: 'E-commerce platforms struggle with personalized recommendations at scale, leading to poor user engagement and low conversion rates.',
        tech: ['Python', 'ML', 'Matrix Factorization', 'Pandas'],
        image: assetUrl('images/projects/project-1-thumb.png'),
        github: 'https://github.com/LeelaprasadPaila',
        demo: '#',
        color: '#00f2ff',
    },
    {
        title: 'Deepfake Detection',
        description: 'CNN-based model to identify manipulated facial features in video content using multi-frame temporal analysis with 94% accuracy.',
        problem: 'Misinformation through deepfake videos is growing exponentially. Manual detection is impossible at scale.',
        tech: ['PyTorch', 'Computer Vision', 'CNN', 'OpenCV'],
        image: assetUrl('images/projects/project-2-thumb.png'),
        github: 'https://github.com/LeelaprasadPaila',
        demo: '#',
        color: '#8b5cf6',
    },
    {
        title: 'NLP Chatbot',
        description: 'Transformer-based conversational agent with context-aware responses, sentiment analysis, and multi-turn dialogue management.',
        problem: 'Customer support teams spend 70% of time on repetitive queries. An intelligent chatbot reduces response time by 85%.',
        tech: ['TensorFlow', 'NLP', 'Transformers', 'FastAPI'],
        image: assetUrl('images/projects/project-3-thumb.png'),
        github: 'https://github.com/LeelaprasadPaila',
        demo: '#',
        color: '#ec4899',
    },
    {
        title: 'AI Portfolio Engine',
        description: 'Dynamic portfolio framework with automated data synchronization, neural background effects, and real-time admin dashboard.',
        problem: 'Static portfolios fail to showcase evolving skills. An AI-powered engine keeps content fresh and engaging automatically.',
        tech: ['React', 'Node.js', 'Three.js', 'MongoDB'],
        image: assetUrl('images/projects/project-1-thumb.png'),
        github: 'https://github.com/LeelaprasadPaila',
        demo: '#',
        color: '#10b981',
    },
];

const FeaturedProjects = ({ onExploreClick }) => {
    const [visibleCards, setVisibleCards] = useState(new Set());
    const [hoveredCard, setHoveredCard] = useState(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        setVisibleCards((prev) => new Set([...prev, index]));
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

    return (
        <section className="featured-section">
            {/* Background gradient */}
            <div className="featured-bg-gradient" />

            <div className="featured-container">
                {/* Section Header */}
                <div className="featured-header">
                    <span className="featured-badge">Featured Work</span>
                    <h2 className="featured-title">Selected Projects</h2>
                    <p className="featured-subtitle">
                        Real-world solutions built with modern AI, ML, and backend technologies
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="featured-grid">
                    {featuredProjects.map((project, index) => (
                        <div
                            key={index}
                            className={`featured-card ${visibleCards.has(index) ? 'featured-card-visible' : ''}`}
                            data-index={index}
                            ref={(el) => (cardRefs.current[index] = el)}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{ '--card-accent': project.color }}
                        >
                            {/* Card Image */}
                            <div className="featured-card-image">
                                <img src={project.image} alt={project.title} loading="lazy" />
                                <div className="featured-card-image-overlay" />
                                <div className="featured-card-image-shine" />
                            </div>

                            {/* Card Content */}
                            <div className="featured-card-content">
                                <div className="featured-card-header">
                                    <h3 className="featured-card-title">{project.title}</h3>
                                    <div className="featured-card-accent-line" />
                                </div>

                                <p className="featured-card-desc">{project.description}</p>

                                {/* Problem Solved */}
                                <div className="featured-card-problem">
                                    <span className="featured-card-problem-label">Problem</span>
                                    <p className="featured-card-problem-text">{project.problem}</p>
                                </div>

                                {/* Tech Stack */}
                                <div className="featured-card-tech">
                                    {project.tech.map((tech, i) => (
                                        <span key={i} className="featured-card-tech-tag">{tech}</span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="featured-card-actions">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="featured-card-btn featured-card-btn-primary"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                        </svg>
                                        GitHub
                                    </a>
                                    <a
                                        href={project.demo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="featured-card-btn featured-card-btn-secondary"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        Live Demo
                                    </a>
                                    <button
                                        className="featured-card-btn featured-card-btn-ghost"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onExploreClick('projects');
                                        }}
                                    >
                                        Learn More
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Card Glow Effect */}
                            <div className="featured-card-glow" />
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="featured-footer">
                    <button
                        className="featured-view-all"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('projects');
                        }}
                    >
                        <span>View All Projects</span>
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

export default FeaturedProjects;
