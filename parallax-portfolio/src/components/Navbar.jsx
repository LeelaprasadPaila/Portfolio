import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';

const Navbar = ({ activeSection, onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'resume', label: 'Resume' },
    { id: 'certificates', label: 'Certifications' },
    { id: 'research', label: 'Research' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (id) => {
    setIsMenuOpen(false);
    onNavClick(id);
  };

  return (
    <header className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isMenuOpen ? 'navbar-mobile-open' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => handleNavClick('home')}>
          <span className="navbar-logo-text">P</span>
          <span className="navbar-logo-full">Leela Prasad</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`navbar-link ${activeSection === item.id ? 'navbar-link-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
              {activeSection === item.id && <span className="navbar-link-indicator" />}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
<button
            className="navbar-action-btn"
            onClick={() => window.dispatchEvent(new CustomEvent('openGlobalSearch'))}
            aria-label="Open search"
            title="Search (Cmd+K)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            className="navbar-cta"
            onClick={() => handleNavClick('contact')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span>Get in Touch</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            className={`navbar-hamburger ${isMenuOpen ? 'hamburger-active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMenuOpen ? 'navbar-mobile-visible' : ''}`}>
        <nav className="navbar-mobile-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`navbar-mobile-link ${activeSection === item.id ? 'navbar-mobile-link-active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;