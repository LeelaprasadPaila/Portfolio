import React, { useEffect, useRef, useState } from 'react';
import '../styles/Hero.css';

const Hero = ({ onExploreClick }) => {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Mouse tracking for parallax
    const handleMouseMove = (e) => {
        if (window.innerWidth < 768) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setMousePos({
            x: (e.clientX - rect.left) / rect.width - 0.5,
            y: (e.clientY - rect.top) / rect.height - 0.5,
        });
    };

    // Floating particles
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const isMobile = window.innerWidth < 768;
        const interval = setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.width = (Math.random() * 4 + 2) + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(particle);
            setTimeout(() => particle.remove(), 8000);
        }, isMobile ? 600 : 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <main
            id="home"
            className={`hero-section ${isVisible ? 'hero-visible' : ''}`}
            ref={containerRef}
            onMouseMove={handleMouseMove}
        >
            {/* Background Video */}
            <div className="hero-bg">
                <video autoPlay muted loop playsInline className="hero-bg-video">
                    <source src="/images/Bg.mp4" type="video/mp4" />
                </video>
                <div className="hero-bg-overlay" />
                <div className="hero-bg-grid" />
            </div>

            {/* Ambient Glow Effects */}
            <div
                className="hero-ambient-glow"
                style={{
                    transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
                }}
            />
            <div
                className="hero-ambient-glow hero-ambient-glow-2"
                style={{
                    transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
                }}
            />

            {/* Floating Geometric Orbs */}
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />

            {/* Decorative Rings */}
            <div className="hero-ring hero-ring-1" />
            <div className="hero-ring hero-ring-2" />

            {/* Main Content */}
            <div className="hero-content">
                {/* Intro Badge */}
                <div className="hero-badge">
                    <span className="hero-badge-dot" />
                    Artificial Intelligence & Machine Learning Engineer
                </div>

                {/* Name */}
                <h1 className="hero-name">
                    <span className="hero-greeting">Hello, I'm</span>
                    <span className="hero-name-highlight">
                        Leela Prasad Paila
                        <span className="hero-name-glow" />
                    </span>
                </h1>

                {/* Professional Title */}
                <div className="hero-title-wrapper">
                    <h2 className="hero-professional-title">AI Engineer</h2>
                    <span className="hero-title-separator">|</span>
                    <h2 className="hero-professional-title">ML Engineer</h2>
                    <span className="hero-title-separator">|</span>
                    <h2 className="hero-professional-title">Backend Engineer</h2>
                </div>

                {/* Value Proposition */}
                <p className="hero-description">
                    Building scalable AI-powered backend systems using 
                    <span className="hero-description-highlight"> Python, FastAPI, Machine Learning</span>, 
                    and modern cloud technologies. Specializing in LLMs, 
                    computer vision, and intelligent automation.
                </p>

                {/* Proof Statement - Metrics Strip */}
                <div className="hero-metrics">
                    <div className="hero-metric-item">
                        <svg className="hero-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="16 18 22 12 16 6" />
                            <polyline points="8 6 2 12 8 18" />
                        </svg>
                        <span>Projects</span>
                    </div>
                    <div className="hero-metric-divider" />
                    <div className="hero-metric-item">
                        <svg className="hero-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </svg>
                        <span>Backend Systems</span>
                    </div>
                    <div className="hero-metric-divider" />
                    <div className="hero-metric-item">
                        <svg className="hero-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span>Machine Learning</span>
                    </div>
                    <div className="hero-metric-divider" />
                    <div className="hero-metric-item">
                        <svg className="hero-metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        <span>Open Source</span>
                    </div>
                </div>

                {/* CTA Buttons - Only TWO */}
                <div className="hero-cta">
                    <button
                        className="hero-btn hero-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('projects');
                        }}
                    >
                        <span className="hero-btn-content">
                            <svg className="hero-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Explore Projects
                        </span>
                        <span className="hero-btn-glow" />
                    </button>

                    <button
                        className="hero-btn hero-btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('contact');
                        }}
                    >
                        <span className="hero-btn-content">
                            <svg className="hero-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            Contact Me
                        </span>
                    </button>
                </div>

                {/* Scroll Indicator */}
                <div className="hero-scroll-indicator">
                    <div className="hero-scroll-mouse">
                        <div className="hero-scroll-wheel" />
                    </div>
                    <span className="hero-scroll-text">Scroll to explore</span>
                </div>
            </div>
        </main>
    );
};

export default Hero;