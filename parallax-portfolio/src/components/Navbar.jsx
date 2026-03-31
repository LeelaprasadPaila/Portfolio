import React, { useState } from 'react';

const Navbar = ({ activeSection, onNavClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'internships', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className="nav-trigger"></div>
      <header className={`navbar ${isMenuOpen ? 'active' : ''}`}>
        <nav className="navbar-container">
          <div className="navbar-logo" onClick={() => onNavClick('home')}>
            <span className="logo-text">Machine Learning</span>
            <span className="logo-badge">Graduate</span>
          </div>

          <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick(section.id);
                    setIsMenuOpen(false);
                  }}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="navbar-hamburger" onClick={handleToggle}>
            <div className="hamburger-bars">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
