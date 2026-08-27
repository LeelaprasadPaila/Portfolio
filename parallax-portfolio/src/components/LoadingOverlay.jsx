import React from 'react';
import { useLoading } from '../context/LoadingContext';

const LoadingOverlay = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="loading-overlay" role="status" aria-live="polite">
            <div className="loading-card">
                <div className="loading-spinner" />
                <div className="loading-text">Loading…</div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
