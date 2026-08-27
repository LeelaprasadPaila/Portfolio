import { useEffect, useState, useCallback } from 'react';
import { analytics } from '../services/analytics';

/**
 * Performance monitoring hook
 * Tracks Core Web Vitals and custom performance metrics
 */
export const usePerformance = () => {
    const [metrics, setMetrics] = useState({
        FCP: null,
        LCP: null,
        FID: null,
        CLS: null,
        INP: null,
        TTFB: null,
    });

    useEffect(() => {
        // Only run in production
        if (import.meta.env.DEV) return;

        // Measure Web Vitals
        const measureWebVitals = async () => {
            try {
                // First Contentful Paint (FCP)
                const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
                if (fcpEntry) {
                    setMetrics(prev => ({ ...prev, FCP: fcpEntry.startTime }));
                }

                // Largest Contentful Paint (LCP)
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    setMetrics(prev => ({ ...prev, LCP: lastEntry.startTime }));
                });
                lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

                // Cumulative Layout Shift (CLS)
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    setMetrics(prev => ({ ...prev, CLS: clsValue }));
                });
                clsObserver.observe({ type: 'layout-shift', buffered: true });

                // First Input Delay (FID) / Interaction to Next Paint (INP)
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        setMetrics(prev => ({ 
                            ...prev, 
                            FID: entry.processingStart - entry.startTime 
                        }));
                    }
                });
                fidObserver.observe({ type: 'first-input', buffered: true });

                // Time to First Byte (TTFB)
                const navigationEntry = performance.getEntriesByType('navigation')[0];
                if (navigationEntry) {
                    setMetrics(prev => ({ 
                        ...prev, 
                        TTFB: navigationEntry.responseStart 
                    }));
                }

                return () => {
                    lcpObserver.disconnect();
                    clsObserver.disconnect();
                    fidObserver.disconnect();
                };
            } catch (error) {
                console.warn('Performance monitoring error:', error);
            }
        };

        measureWebVitals();
    }, []);

    // Report metrics to analytics
    useEffect(() => {
        const reportMetrics = () => {
            const validMetrics = Object.entries(metrics)
                .filter(([_, value]) => value !== null)
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

            if (Object.keys(validMetrics).length > 0) {
                analytics.trackPerformance(validMetrics);
            }
        };

        // Report after page is fully loaded
        if (document.readyState === 'complete') {
            reportMetrics();
        } else {
            window.addEventListener('load', reportMetrics);
            return () => window.removeEventListener('load', reportMetrics);
        }
    }, [metrics]);

    return metrics;
};

/**
 * Hook to measure component render time
 */
export const useRenderTime = (componentName) => {
    useEffect(() => {
        const startTime = performance.now();
        
        return () => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            if (import.meta.env.DEV && renderTime > 16) {
                console.warn(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
            }
        };
    }, [componentName]);
};

/**
 * Hook for lazy loading with intersection observer
 */
export const useLazyLoad = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (options.loadOnce) {
                    setIsLoaded(true);
                    observer.disconnect();
                }
            } else if (!options.loadOnce) {
                setIsVisible(false);
            }
        }, {
            threshold: options.threshold || 0.1,
            rootMargin: options.rootMargin || '50px',
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [options.threshold, options.rootMargin, options.loadOnce]);

    return { ref, isVisible, isLoaded };
};

export default usePerformance;