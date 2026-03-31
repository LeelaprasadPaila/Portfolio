import React from 'react';
import { useNavigate } from 'react-router-dom';
import Projects from '../components/Projects';

const ProjectsPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <Projects
            isActive={true}
            onClose={handleClose}
        />
    );
};

export default ProjectsPage;
