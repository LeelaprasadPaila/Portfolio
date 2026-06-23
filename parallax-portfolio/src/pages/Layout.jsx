import React, { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import gsap from 'gsap';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Derive activeSection from the URL path
    const routePath = (location.pathname === '/' ? 'home' : location.pathname.substring(1)).toLowerCase();
    const activeSection = routePath === 'internships' ? 'experience' : routePath;

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
        const parallaxContainer = document.querySelector('.parallax-container');
        if (parallaxContainer) {
            if (activeSection === 'home') {
                gsap.to(parallaxContainer, {
                    filter: "brightness(1) blur(0px)",
                    duration: 0.5
                });
            } else {
                gsap.to(parallaxContainer, {
                    filter: "brightness(0.2) blur(5px)",
                    duration: 0.5
                });
            }
        }
    }, [activeSection]);

    return (
        <div className="ml-theme">
            <Navbar activeSection={activeSection} onNavClick={openSection} />

            <Outlet />

            {activeSection === 'home' && <Footer onAdminClick={openSection} />}
        </div>
    );
};

export default Layout;
