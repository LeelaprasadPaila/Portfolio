import React from 'react';

const Footer = ({ onAdminClick }) => {
    return (
        <footer className="footer">
            <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="footer-info">
                    © {new Date().getFullYear()} Leela Prasad Paila • AI Native Engineer
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div className="footer-links">
                        <a href="https://github.com/leelaprasadpaila" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://linkedin.com/in/leelaprasadpaila" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="mailto:pailaleelaprasad@gmail.com">
                            <i className="fas fa-envelope"></i>
                        </a>
                    </div>

                    <button
                        onClick={() => onAdminClick('admin')}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            transition: 'color 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                        onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.1)'}
                        title="System Access"
                    >
                        <i className="fas fa-lock"></i>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
