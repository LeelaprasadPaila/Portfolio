import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const Hero = ({ onExploreClick }) => {
    const el = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: [
                'an AI Native Engineer',
                'a Machine Learning Engineer',
                'an Applied ML Expert',
                'a GenAI Developer',
                'an LLM Architect',
                'a Python Backend Dev',
                'a Software Engineer AI',
                'an AI Automation Expert'
            ].map(s => s.toUpperCase()),
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true
        });

        return () => {
            typed.destroy();
        };
    }, []);

    // Floating particles effect
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Reduce particles on mobile
        const isMobile = window.innerWidth < 768;
        const particleInterval = isMobile ? 600 : 300;

        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = '100%';
            particle.style.width = Math.random() * 4 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(particle);

            setTimeout(() => particle.remove(), 8000);
        };

        const interval = setInterval(createParticle, particleInterval);
        return () => clearInterval(interval);
    }, []);

    // Mouse parallax effect
    const handleMouseMove = (e) => {
        // Disable parallax on mobile
        if (window.innerWidth < 768) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        const heroContent = container.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
        }
    };

    return (
        <main id="home" className="parallax-container active-view" ref={containerRef} onMouseMove={handleMouseMove}>
            <div id="video-background" className="video-background">
                <video autoPlay muted loop playsInline id="bg-video">
                    <source src="images/Bg.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="video-overlay"></div>
            </div>

            <div className="hero-content">
                <div className="hero-text-container">
                    <h1 className="hero-title">
                        <span className="greeting">Hello, I'm</span>
                        <span className="highlight">Leela Prasad Paila</span>
                    </h1>
                    <h2 className="subtitle">I AM <span ref={el}></span></h2>
                </div>
                <p className="hero-subtitle">Engineering the Future with Machine Learning & Deep Learning</p>
                <div className="hero-cta">
                    <a
                        href="#projects"
                        className="btn btn-primary"
                        data-target="projects"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('projects');
                        }}
                    >
                        <span className="btn-icon"><i className="fas fa-rocket"></i></span>
                        <span className="btn-text">Explore Projects</span>
                    </a>
                    <a
                        href="#contact"
                        className="btn btn-secondary"
                        data-target="contact"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('contact');
                        }}
                    >
                        <span className="btn-icon"><i className="fas fa-envelope"></i></span>
                        <span className="btn-text">Get in Touch</span>
                    </a>
                    <a
                        href="#internships"
                        className="btn btn-secondary"
                        data-target="internships"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('internships');
                        }}
                    >
                        <span className="btn-icon"><i className="fas fa-briefcase"></i></span>
                        <span className="btn-text">My Experience</span>
                    </a>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-arrow"></div>
                </div>
            </div>
        </main>
    );
};

export default Hero;
