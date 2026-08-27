import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PremiumFooter from '../components/PremiumFooter';
import gsap from 'gsap';
import { prefersReducedMotion } from '../utils/accessibility';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Derive activeSection from the URL path
    const routePath = (location.pathname === '/' ? 'home' : location.pathname.substring(1)).toLowerCase();
    const topLevelRoute = routePath.split('/')[0];
    const activeSection = topLevelRoute === 'internships' ? 'experience' : topLevelRoute;

    const openSection = (targetId) => {
        if (targetId === 'home') {
            navigate('/');
        } else if (targetId === 'experience') {
            navigate('/experience');
        } else {
            navigate(`/${targetId}`);
        }
    };

    useEffect(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection && !prefersReducedMotion()) {
            if (activeSection === 'home') {
                gsap.to(heroSection, {
                    filter: "brightness(1) blur(0px)",
                    duration: 0.5
                });
            } else {
                gsap.to(heroSection, {
                    filter: "brightness(0.2) blur(5px)",
                    duration: 0.5
                });
            }
        }
    }, [activeSection]);

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }, [location.pathname]);

    return (
        <div className="ml-theme">
            {/* Screen reader announcer */}
            <div id="sr-announcer" aria-live="polite" aria-atomic="true" />

            <Navbar activeSection={activeSection} onNavClick={openSection} />

            <main id="main-content" role="main">
                <Outlet />
            </main>

            <PremiumFooter onAdminClick={openSection} />
        </div>
    );
};

export default Layout;