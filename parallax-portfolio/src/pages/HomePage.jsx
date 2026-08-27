import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import TrustIndicators from '../components/TrustIndicators';
import FeaturedProjects from '../components/FeaturedProjects';
import CredibilityStats from '../components/CredibilityStats';
import TechShowcase from '../components/TechShowcase';
import ExperiencePreview from '../components/ExperiencePreview';
import AboutPreview from '../components/AboutPreview';

const HomePage = () => {
    const navigate = useNavigate();

    const handleActionClick = (target) => {
        if (target === 'home') navigate('/');
        else if (target === 'experience') navigate('/experience');
        else navigate(`/${target}`);
    };

    return (
        <>
            <Hero onExploreClick={handleActionClick} />
            <TrustIndicators />
            <FeaturedProjects onExploreClick={handleActionClick} />
            
            {/* Section Transition */}
            <div className="section-divider-glow" />
            
            <CredibilityStats />
            
            {/* Section Transition */}
            <div className="section-divider-shape" />
            
            <TechShowcase />
            
            {/* Section Transition */}
            <div className="section-divider-glow" />
            
            <ExperiencePreview onExploreClick={handleActionClick} />
            
            {/* Section Transition */}
            <div className="section-divider-shape" />
            
            <AboutPreview onExploreClick={handleActionClick} />
        </>
    );
};

export default HomePage;
