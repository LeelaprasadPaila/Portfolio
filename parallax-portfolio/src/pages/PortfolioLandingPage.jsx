import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assetUrl } from '../config/env';

const navigation = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio/' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Experience', path: '/experience' },
    { label: 'Skills', path: '/skills' },
    { label: 'Contact', path: '/contact' }
];

const PortfolioLandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="portfolio-landing">
            <aside className="portfolio-sidebar">
                <div className="portfolio-profile">
                    <div className="portfolio-avatar-wrap">
                        <img
                            className="portfolio-avatar"
                            src={assetUrl('images/Portfolio_image.png')}
                            alt="Leela Prasad Paila"
                        />
                    </div>
                    <p className="portfolio-kicker">AI / ML ENGINEER</p>
                    <h1>Leela Prasad<br />Paila</h1>
                    <p className="portfolio-location">Vijayawada, India</p>
                </div>

                <nav className="portfolio-nav" aria-label="Portfolio navigation">
                    {navigation.map((item, index) => (
                        <button
                            className={`portfolio-nav-link ${index === 0 ? 'is-active' : ''}`}
                            key={item.path}
                            onClick={() => navigate(item.path)}
                        >
                            <span className="portfolio-nav-index">0{index + 1}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="portfolio-sidebar-foot">
                    <span>Available for thoughtful work</span>
                    <a href="mailto:pailaleelaprasad@gmail.com">pailaleelaprasad@gmail.com</a>
                </div>
            </aside>

            <main className="portfolio-landing-main">
                <header className="portfolio-mobile-header">
                    <span>LP / PORTFOLIO</span>
                    <button onClick={() => navigate('/contact')} aria-label="Open contact page">Let's talk <span aria-hidden="true">↗</span></button>
                </header>

                <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
                    <div className="portfolio-hero-copy">
                        <p className="portfolio-eyebrow"><span /> Independent engineer · 2026</p>
                        <h2 id="portfolio-hero-title">I build<br /><em>intelligent</em><br />things.</h2>
                        <p className="portfolio-hero-summary">
                            AI-native systems, clear interfaces, and reliable backend architecture for people solving meaningful problems.
                        </p>
                        <div className="portfolio-hero-actions">
                            <button className="portfolio-primary-action" onClick={() => navigate('/portfolio/')}>
                                Open full portfolio <span aria-hidden="true">↗</span>
                            </button>
                            <button className="portfolio-text-action" onClick={() => navigate('/projects')}>
                                View selected work <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>

                    <div className="portfolio-portrait-panel">
                        <div className="portfolio-portrait-label">01 — PROFILE</div>
                        <img src={assetUrl('images/Portfolio_image.png')} alt="Leela Prasad Paila, AI Native Engineer" />
                        <span className="portfolio-portrait-caption">Curious by default.<br />Precise by practice.</span>
                    </div>
                </section>

                <section className="portfolio-intro-strip" aria-label="Portfolio highlights">
                    <p>Selected capabilities</p>
                    <div className="portfolio-capabilities">
                        <span>Machine learning</span>
                        <span>AI agents</span>
                        <span>Python systems</span>
                        <span>Creative technology</span>
                    </div>
                    <span className="portfolio-scroll-mark">Scroll to explore ↓</span>
                </section>
            </main>
        </div>
    );
};

export default PortfolioLandingPage;
