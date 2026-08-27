import React from 'react';
import './Dashboards.css';

const Dashboards = () => {
    const skillCategories = [
        {
            title: "Programming & Core Engineering",
            skills: ["Python Programming", "Problem-Solving", "Scripting", "OOP"],
            level: 90
        },
        {
            title: "Machine Learning & AI",
            skills: ["Supervised Learning", "Feature Engineering", "Recommendation Systems", "Computer Vision"],
            level: 85
        },
        {
            title: "Generative AI",
            skills: ["Prompt Engineering", "LLM Automation", "AI Agents", "Context Logic"],
            level: 80
        },
        {
            title: "Backend (Python)",
            skills: ["Flask & FastAPI", "Auth & Roles", "ML API Deployment", "Optimization"],
            level: 85
        },
        {
            title: "Databases",
            skills: ["MySQL/Postgres", "Pandas & NumPy", "Schema Design", "Query Optimization"],
            level: 75
        },
        {
            title: "Web Development",
            skills: ["HTML5, CSS3, ES6", "Admin Dashboards", "Modern Architecture", "Interactive UI"],
            level: 80
        }
    ];

    const projectStats = [
        { label: "Total Projects", value: 12, icon: "📦" },
        { label: "ML/AI Projects", value: 6, icon: "🤖" },
        { label: "Web Projects", value: 4, icon: "🌐" },
        { label: "Data Science", value: 2, icon: "📊" }
    ];

    const experienceStats = [
        { label: "Internships", value: 2, icon: "💼" },
        { label: "Certificates", value: 10, icon: "🏆" },
        { label: "Years Learning", value: 4, icon: "📚" },
        { label: "Technologies", value: 15, icon: "⚡" }
    ];

    return (
        <div className="dashboards-container">
            {/* Technology Proficiency Dashboard */}
            <div className="dashboard-section">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Technology Proficiency</h2>
                    <p className="dashboard-subtitle">Skills and expertise across different domains</p>
                </div>

                <div className="skill-categories">
                    {skillCategories.map((category, idx) => (
                        <div key={idx} className="skill-category-card">
                            <div className="skill-category-header">
                                <h3 className="skill-category-title">{category.title}</h3>
                                <span className="skill-level">{category.level}%</span>
                            </div>
                            <div className="skill-bar">
                                <div 
                                    className="skill-bar-fill" 
                                    style={{ width: `${category.level}%` }}
                                />
                            </div>
                            <div className="skill-tags">
                                {category.skills.map((skill, skillIdx) => (
                                    <span key={skillIdx} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Statistics Dashboard */}
            <div className="dashboard-section">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Project Statistics</h2>
                    <p className="dashboard-subtitle">Overview of my project portfolio</p>
                </div>

                <div className="stats-grid">
                    {projectStats.map((stat, idx) => (
                        <div key={idx} className="stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Experience Overview Dashboard */}
            <div className="dashboard-section">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Experience Overview</h2>
                    <p className="dashboard-subtitle">Professional journey and achievements</p>
                </div>

                <div className="stats-grid">
                    {experienceStats.map((stat, idx) => (
                        <div key={idx} className="stat-card">
                            <div className="stat-icon">{stat.icon}</div>
                            <div className="stat-content">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Learning Roadmap */}
            <div className="dashboard-section">
                <div className="dashboard-header">
                    <h2 className="dashboard-title">Learning Roadmap</h2>
                    <p className="dashboard-subtitle">Continuous growth and development</p>
                </div>

                <div className="roadmap">
                    <div className="roadmap-item">
                        <div className="roadmap-marker completed" />
                        <div className="roadmap-content">
                            <h4>Python & ML Fundamentals</h4>
                            <p>Mastered core concepts and built foundational projects</p>
                            <span className="roadmap-status">Completed</span>
                        </div>
                    </div>

                    <div className="roadmap-item">
                        <div className="roadmap-marker completed" />
                        <div className="roadmap-content">
                            <h4>Deep Learning & Computer Vision</h4>
                            <p>Built CNN models and image processing systems</p>
                            <span className="roadmap-status">Completed</span>
                        </div>
                    </div>

                    <div className="roadmap-item">
                        <div className="roadmap-marker in-progress" />
                        <div className="roadmap-content">
                            <h4>LLMs & Generative AI</h4>
                            <p>Exploring transformer architectures and fine-tuning</p>
                            <span className="roadmap-status">In Progress</span>
                        </div>
                    </div>

                    <div className="roadmap-item">
                        <div className="roadmap-marker upcoming" />
                        <div className="roadmap-content">
                            <h4>AI Agents & Autonomous Systems</h4>
                            <p>Building intelligent agent workflows</p>
                            <span className="roadmap-status">Upcoming</span>
                        </div>
                    </div>

                    <div className="roadmap-item">
                        <div className="roadmap-marker upcoming" />
                        <div className="roadmap-content">
                            <h4>Production ML Systems</h4>
                            <p>Scalable deployment and MLOps</p>
                            <span className="roadmap-status">Upcoming</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboards;