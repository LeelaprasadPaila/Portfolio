import React, { useState } from 'react';
import { assetUrl } from '../config/env';
import '../styles/PremiumFooter.css';

const PremiumFooter = ({ onAdminClick }) => {
    const [showBackToTop, setShowBackToTop] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="premium-footer">
            {/* Top Wave Divider */}
            <div className="premium-footer-wave">
                <svg viewBox="0 0 1200 60" preserveAspectRatio="none">
                    <path d="M0,30 C200,0 400,60 600,30 C800,0 1000,60 1200,30 L1200,60 L0,60 Z" fill="rgba(0,242,255,0.02)" />
                </svg>
            </div>

            <div className="premium-footer-container">
                {/* Main Grid */}
                <div className="premium-footer-grid">
                    {/* Professional Summary */}
                    <div className="premium-footer-col premium-footer-brand">
                        <h3 className="premium-footer-logo">
                            <span className="premium-footer-logo-accent">L</span>eela Prasad Paila
                        </h3>
                        <p className="premium-footer-description">
                            AI Engineer & Machine Learning Specialist. Building intelligent systems 
                            that solve real-world problems through scalable, production-ready solutions.
                        </p>
                        <div className="premium-footer-social">
                            <a href="https://github.com/leelaprasadpaila" target="_blank" rel="noopener noreferrer" className="premium-footer-social-link" aria-label="GitHub">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com/in/leelaprasadpaila" target="_blank" rel="noopener noreferrer" className="premium-footer-social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect x="2" y="9" width="4" height="12" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                            </a>
                            <a href="mailto:pailaleelaprasad@gmail.com" className="premium-footer-social-link" aria-label="Email">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </a>
                            <a href="https://twitter.com/leelaprasad" target="_blank" rel="noopener noreferrer" className="premium-footer-social-link" aria-label="Twitter">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="premium-footer-col">
                        <h4 className="premium-footer-col-title">Quick Links</h4>
                        <ul className="premium-footer-links">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Projects', href: '/projects' },
                                { label: 'Experience', href: '/experience' },
                                { label: 'Certifications', href: '/certificates' },
                                { label: 'About', href: '/about' },
                                { label: 'Contact', href: '/contact' },
                            ].map((link, i) => (
                                <li key={i}>
                                    <a href={link.href} className="premium-footer-link">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="premium-footer-col">
                        <h4 className="premium-footer-col-title">Resources</h4>
                        <ul className="premium-footer-links">
                            {[
                                { label: 'Resume', href: assetUrl('resume.pdf'), icon: 'download' },
                                { label: 'GitHub', href: 'https://github.com/leelaprasadpaila', icon: 'external' },
                                { label: 'LinkedIn', href: 'https://linkedin.com/in/leelaprasadpaila', icon: 'external' },
                            ].map((link, i) => (
                                <li key={i}>
                                    <a
                                        href={link.href}
                                        target={link.icon === 'external' ? '_blank' : undefined}
                                        rel={link.icon === 'external' ? 'noopener noreferrer' : undefined}
                                        className="premium-footer-link"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            {link.icon === 'download' ? (
                                                <>
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="7 10 12 15 17 10" />
                                                    <line x1="12" y1="15" x2="12" y2="3" />
                                                </>
                                            ) : (
                                                <>
                                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                    <polyline points="15 3 21 3 21 9" />
                                                    <line x1="10" y1="14" x2="21" y2="3" />
                                                </>
                                            )}
                                        </svg>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="premium-footer-col">
                        <h4 className="premium-footer-col-title">Contact</h4>
                        <ul className="premium-footer-contact">
                            <li className="premium-footer-contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <a href="mailto:pailaleelaprasad@gmail.com">pailaleelaprasad@gmail.com</a>
                            </li>
                            <li className="premium-footer-contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>India</span>
                            </li>
                            <li className="premium-footer-contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>Available for opportunities</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="premium-footer-bottom">
                    <div className="premium-footer-bottom-content">
                        <p className="premium-footer-copyright">
                            © {currentYear} Leela Prasad Paila. Built with passion for AI and engineering excellence.
                        </p>
                        <div className="premium-footer-bottom-links">
                            <button
                                className="premium-footer-admin-btn"
                                onClick={() => onAdminClick('admin')}
                                title="System Access"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            <button
                className={`premium-footer-back-to-top ${showBackToTop ? 'premium-footer-back-to-top-visible' : ''}`}
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                </svg>
            </button>
        </footer>
    );
};

export default PremiumFooter;