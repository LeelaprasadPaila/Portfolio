import React, { useEffect, useRef, useState } from 'react';
import '../styles/TechShowcase.css';

const techCategories = [
    {
        category: 'Backend',
        color: '#00f2ff',
        technologies: [
            { name: 'Python', icon: '🐍', description: 'Primary language for backend & ML', level: 95 },
            { name: 'FastAPI', icon: '⚡', description: 'High-performance async framework', level: 90 },
            { name: 'Django', icon: '🌐', description: 'Full-stack Python framework', level: 80 },
            { name: 'Flask', icon: '🔬', description: 'Lightweight web framework', level: 75 },
        ],
    },
    {
        category: 'Frontend',
        color: '#8b5cf6',
        technologies: [
            { name: 'React', icon: '⚛️', description: 'Component-based UI library', level: 85 },
            { name: 'Next.js', icon: '▲', description: 'React framework for production', level: 80 },
            { name: 'JavaScript', icon: '🟨', description: 'Core web language', level: 90 },
            { name: 'TypeScript', icon: '📘', description: 'Typed JS superset', level: 85 },
        ],
    },
    {
        category: 'Machine Learning',
        color: '#ec4899',
        technologies: [
            { name: 'TensorFlow', icon: '🧠', description: 'Deep learning framework', level: 85 },
            { name: 'PyTorch', icon: '🔥', description: 'Dynamic computation graphs', level: 80 },
            { name: 'Scikit-learn', icon: '📊', description: 'Classic ML algorithms', level: 90 },
            { name: 'Pandas', icon: '🐼', description: 'Data manipulation & analysis', level: 95 },
            { name: 'NumPy', icon: '🔢', description: 'Numerical computing', level: 90 },
        ],
    },
    {
        category: 'Databases',
        color: '#10b981',
        technologies: [
            { name: 'MySQL', icon: '🗄️', description: 'Relational database', level: 85 },
            { name: 'PostgreSQL', icon: '🐘', description: 'Advanced relational DB', level: 80 },
            { name: 'MongoDB', icon: '🍃', description: 'NoSQL document store', level: 75 },
        ],
    },
    {
        category: 'DevOps',
        color: '#f59e0b',
        technologies: [
            { name: 'Docker', icon: '🐳', description: 'Containerization platform', level: 80 },
            { name: 'Git', icon: '🔀', description: 'Version control system', level: 90 },
            { name: 'Linux', icon: '🐧', description: 'Server operating system', level: 85 },
            { name: 'AWS', icon: '☁️', description: 'Cloud infrastructure', level: 75 },
        ],
    },
];

const TechCard = ({ tech, color, index, isVisible }) => {
    return (
        <div
            className={`tech-card ${isVisible ? 'tech-card-visible' : ''}`}
            style={{ 
                '--card-color': color,
                transitionDelay: `${index * 0.08}s`
            }}
        >
            <div className="tech-card-icon">
                <span className="tech-card-emoji">{tech.icon}</span>
            </div>
            <div className="tech-card-info">
                <h4 className="tech-card-name">{tech.name}</h4>
                <p className="tech-card-desc">{tech.description}</p>
                <div className="tech-card-level">
                    <div className="tech-card-level-bar">
                        <div
                            className="tech-card-level-fill"
                            style={{
                                width: isVisible ? `${tech.level}%` : '0%',
                                transitionDelay: `${index * 0.08 + 0.3}s`
                            }}
                        />
                    </div>
                    <span className="tech-card-level-text">{tech.level}%</span>
                </div>
            </div>
            <div className="tech-card-glow" />
        </div>
    );
};

const TechShowcase = () => {
    const [visibleCategories, setVisibleCategories] = useState(new Set());
    const sectionRef = useRef(null);
    const categoryRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        setVisibleCategories((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.1 }
        );

        categoryRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="tech-showcase-section" ref={sectionRef}>
            {/* Background gradients */}
            <div className="tech-showcase-bg" />
            <div className="tech-showcase-bg-2" />

            <div className="tech-showcase-container">
                {/* Section Header */}
                <div className="tech-showcase-header">
                    <span className="tech-showcase-badge">Technology Stack</span>
                    <h2 className="tech-showcase-title">Tools & Technologies</h2>
                    <p className="tech-showcase-subtitle">
                        A comprehensive toolbox spanning backend, frontend, machine learning,
                        databases, and cloud infrastructure
                    </p>
                </div>

                {/* Categories */}
                <div className="tech-showcase-categories">
                    {techCategories.map((category, catIndex) => (
                        <div
                            key={catIndex}
                            className={`tech-category ${
                                visibleCategories.has(catIndex) ? 'tech-category-visible' : ''
                            }`}
                            data-index={catIndex}
                            ref={(el) => (categoryRefs.current[catIndex] = el)}
                        >
                            {/* Category Header */}
                            <div className="tech-category-header">
                                <h3 className="tech-category-title" style={{ color: category.color }}>
                                    {category.category}
                                </h3>
                                <div
                                    className="tech-category-line"
                                    style={{ background: `linear-gradient(90deg, ${category.color}, transparent)` }}
                                />
                            </div>

                            {/* Technology Grid */}
                            <div className="tech-category-grid">
                                {category.technologies.map((tech, techIndex) => (
                                    <TechCard
                                        key={techIndex}
                                        tech={tech}
                                        color={category.color}
                                        index={techIndex}
                                        isVisible={visibleCategories.has(catIndex)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechShowcase;