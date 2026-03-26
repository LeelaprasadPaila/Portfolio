import React from 'react';
import { useNavigate } from 'react-router-dom';
import Certificates from '../components/Certificates';

const CertificatesPage = () => {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/');
    };

    return (
        <Certificates
            isActive={true}
            onClose={handleClose}
        />
    );
};

export default CertificatesPage;
