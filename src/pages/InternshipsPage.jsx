import React from 'react';
import { useNavigate } from 'react-router-dom';
import Internships from '../components/Internships';

const InternshipsPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <Internships
            isActive={true}
            onClose={handleClose}
        />
    );
};

export default InternshipsPage;
