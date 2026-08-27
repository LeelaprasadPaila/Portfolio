import React, { useEffect, useRef } from 'react';

const ScrollReveal = ({ 
  children, 
  className = '', 
  direction = 'up', 
  delay = 0,
  threshold = 0.15,
  rootMargin = '0px'
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add('visible');
          }, delay);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, threshold, rootMargin]);

  const directionClass = direction === 'left' ? 'reveal-left' 
    : direction === 'right' ? 'reveal-right'
    : direction === 'scale' ? 'reveal-scale'
    : '';

  return (
    <div 
      ref={ref} 
      className={`reveal-section ${directionClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;