import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import '../styles/Navbar.css';

const Navbar = ({ activeSection, onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef(null);
  const megaMenuRef = useRef(null);

  const mainSections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'certificates', label: 'Certificates' },
  ];

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMoreToggle = (e) => {
    e.preventDefault();
    setIsMoreOpen(!isMoreOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (megaMenuRef.current) {
      if (isMoreOpen) {
        gsap.fromTo(
          megaMenuRef.current,
          { opacity: 0, y: 15, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
        );
      } else {
        gsap.to(megaMenuRef.current, {
          opacity: 0,
          y: 10,
          scale: 0.98,
          duration: 0.3,
          ease: 'power2.in',
        });
      }
    }
  }, [isMoreOpen]);

  return (
    <>
      <div className="nav-trigger"></div>
      <header className={`navbar-wrapper ${isMenuOpen ? 'mobile-active' : ''}`}>
        <div className="navbar-content">
          <div className="navbar-logo" onClick={() => onNavClick('home')}>
            <div className="logo-symbol">ML Graduate</div>
          </div>

          <div className="nav-pill">
            <ul className="navbar-menu">
              {mainSections.map((section) => (
                <li key={section.id} className="nav-item">
                  {activeSection === section.id && <div className="active-cap"></div>}
                  <a
                    href={`#${section.id}`}
                    className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      setIsMoreOpen(false);
                      onNavClick(section.id);
                    }}
                  >
                    {section.label}
                  </a>
                </li>
              ))}

              <li className="nav-item more-dropdown" ref={moreRef}>
                <a
                  href="#more"
                  className={`nav-link ${isMoreOpen ? 'active' : ''}`}
                  onClick={handleMoreToggle}
                >
                  More{' '}
                  <span className={`chevron ${isMoreOpen ? 'open' : ''}`}>
                    {isMoreOpen ? '▴' : '▾'}
                  </span>
                </a>

                {isMoreOpen && (
                  <div className="mega-menu" ref={megaMenuRef}>
                    <div className="mega-menu-container">
                      <div className="mega-featured">
                        <div
                          className="mega-card featured-primary"
                          onClick={() => {
                            // Sample button 1 - you can update this
                            window.open('https://github.com/LeelaprasadPaila', '_blank');
                            setIsMoreOpen(false);
                          }}
                        >
                          <div className="mega-card-img" style={{background: 'linear-gradient(145deg, #667eea, #764ba2)'}}></div>
                          <div className="mega-card-overlay"></div>
                          <div className="mega-card-content">
                            <div className="card-badge">🚀</div>
                            <h3>Sample Feature 1</h3>
                            <p>Update this button with your content</p>
                          </div>
                        </div>
                        <div
                          className="mega-card featured-primary"
                          onClick={() => {
                            // Sample button 2 - you can update this
                            window.open('https://linkedin.com/in/leelaprasadpaila', '_blank');
                            setIsMoreOpen(false);
                          }}
                        >
                          <div className="mega-card-img" style={{background: 'linear-gradient(145deg, #f093fb, #f5576c)'}}></div>
                          <div className="mega-card-overlay"></div>
                          <div className="mega-card-content">
                            <div className="card-badge">💼</div>
                            <h3>Sample Feature 2</h3>
                            <p>Update this button with your content</p>
                          </div>
                        </div>
                      </div>

                      <div className="mega-links">
                        <div
                          className="mega-link-item"
                          onClick={() => {
                            onNavClick('projects');
                            setIsMoreOpen(false);
                          }}
                        >
                          <div className="mega-icon">💻</div>
                          <div className="mega-info">
                            <h4>Projects</h4>
                            <span>Check my portfolio work</span>
                          </div>
                        </div>
                        <div
                          className="mega-link-item"
                          onClick={() => {
                            onNavClick('contact');
                            setIsMoreOpen(false);
                          }}
                        >
                          <div className="mega-icon">✉️</div>
                          <div className="mega-info">
                            <h4>Contact</h4>
                            <span>Get in touch for collaborations</span>
                          </div>
                        </div>
                        <div
                          className="mega-link-item"
                          onClick={() => {
                            window.open('https://github.com/LeelaprasadPaila', '_blank');
                            setIsMoreOpen(false);
                          }}
                        >
                          
                          <div className="mega-info">
                            <h4>Github</h4>
                            <span>Check out my open source work</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            </ul>

            <div className="nav-action-buttons">
              <button
                className="book-call-btn"
                onClick={() => window.open('https://wa.me/9700651322?text=Hi%20Leela%20Prasad,%20I%20would%20like%20to%20book%20a%20call%20with%20you.', '_blank')}
              >
                <i className="fab fa-whatsapp"></i> Book a Call
              </button>
              <button
                className="hire-me-btn"
                onClick={() => onNavClick('contact')}
              >
                <i className="fas fa-user-tie"></i> Hire Me
              </button>
            </div>
          </div>

          <div className="navbar-utility">
            <div className="portfolio-icon" onClick={() => window.open('#projects', '_self')}>🔗</div>
            <div className="navbar-hamburger" onClick={handleToggle}>
              <div className="hamburger-bars">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
