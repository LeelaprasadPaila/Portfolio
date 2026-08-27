/**
 * Accessibility utilities for WCAG 2.2 AA compliance
 */

// Focus trap for modals and dialogs
export const createFocusTrap = (container) => {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ];

    const getFocusableElements = () => {
        if (!container) return [];
        return Array.from(container.querySelectorAll(focusableSelectors.join(',')));
    };

    const trapFocus = (e) => {
        const focusableElements = getFocusableElements();
        if (focusableElements.length === 0) return;

        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        }
    };

    document.addEventListener('keydown', trapFocus);

    // Focus first element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }

    return () => {
        document.removeEventListener('keydown', trapFocus);
    };
};

// Announce to screen readers
export const announceToScreenReader = (message, priority = 'polite') => {
    const announcer = document.getElementById('sr-announcer');
    if (announcer) {
        announcer.textContent = '';
        // Force a reflow to ensure the announcement is made
        requestAnimationFrame(() => {
            announcer.textContent = message;
        });
    }
};

// Handle keyboard navigation
export const handleKeyboardNavigation = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        callback();
    }
};

// Check if reduced motion is preferred
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Check if high contrast is preferred
export const prefersHighContrast = () => {
    return window.matchMedia('(prefers-contrast: high)').matches;
};

// Get color contrast ratio (WCAG 2.1)
export const getContrastRatio = (color1, color2) => {
    const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const parseColor = (color) => {
        const hex = color.replace('#', '');
        return {
            r: parseInt(hex.substring(0, 2), 16),
            g: parseInt(hex.substring(2, 4), 16),
            b: parseInt(hex.substring(4, 6), 16),
        };
    };

    const c1 = parseColor(color1);
    const c2 = parseColor(color2);
    const l1 = getLuminance(c1.r, c1.g, c1.b);
    const l2 = getLuminance(c2.r, c2.g, c2.b);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

// Check if contrast ratio meets WCAG AA standards
export const meetsWCAGAA = (ratio, isLargeText = false) => {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

// Generate accessible ID
export const generateId = (prefix = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

// Debounce utility for performance
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Throttle utility for performance
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};