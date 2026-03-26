import React from 'react';
import { useNavigate } from 'react-router-dom';
import Contact from '../components/Contact';

const ContactPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <Contact
            isActive={true}
            onClose={handleClose}
        />
    );
};

export default ContactPage;
