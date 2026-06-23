import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const HomePage = () => {
    const navigate = useNavigate();

    const handleActionClick = (target) => {
        if (target === 'home') navigate('/');
        else if (target === 'experience') navigate('/experience');
        else navigate(`/${target}`);
    };

    return (
        <Hero onExploreClick={handleActionClick} />
    );
};

export default HomePage;
