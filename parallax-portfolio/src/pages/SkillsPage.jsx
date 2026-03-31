import React from 'react';
import { useNavigate } from 'react-router-dom';
import Skills from '../components/Skills';

const SkillsPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <Skills
            isActive={true}
            onClose={handleClose}
        />
    );
};

export default SkillsPage;
