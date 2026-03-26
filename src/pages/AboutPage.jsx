import React from 'react';
import { useNavigate } from 'react-router-dom';
import About from '../components/About';

const AboutPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <About
            isActive={true}
            onClose={handleClose}
        />
    );
};

export default AboutPage;
