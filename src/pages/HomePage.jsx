import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const HomePage = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/projects');
    };

    return (
        <Hero onExploreClick={handleExploreClick} />
    );
};

export default HomePage;
