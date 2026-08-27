import React, { useEffect, useRef } from 'react';
import './Microinteractions.css';

const Microinteractions = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Magnetic button effect
        const magneticButtons = container.querySelectorAll('.magnetic-btn');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        // Cursor-aware hover effects
        const cursorAwareElements = container.querySelectorAll('.cursor-aware');
        
        cursorAwareElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                el.style.setProperty('--mouse-x', `${x * 100}%`);
                el.style.setProperty('--mouse-y', `${y * 100}%`);
            });
        });

        // Smooth card expansion
        const expandableCards = container.querySelectorAll('.expandable-card');
        
        expandableCards.forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('expanded');
            });
        });

        return () => {
            magneticButtons.forEach(btn => {
                btn.removeEventListener('mousemove', () => {});
                btn.removeEventListener('mouseleave', () => {});
            });
        };
    }, []);

    return (
        <div ref={containerRef} className="microinteractions-container">
            {/* This component adds global microinteraction classes and effects */}
        </div>
    );
};

export default Microinteractions;