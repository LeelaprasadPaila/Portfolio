import React, { createContext, useContext, useEffect, useState } from 'react';

const LoadingContext = createContext({ isLoading: false });

export const LoadingProvider = ({ children }) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const handler = (e) => {
            const delta = e?.detail?.delta || 0;
            setCounter((c) => {
                const next = Math.max(0, c + delta);
                try {
                    // Debug log to help trace stuck loading states
                    // eslint-disable-next-line no-console
                    console.debug('[LoadingContext] api:loading', { delta, before: c, after: next });
                } catch (_) {}
                return next;
            });
        };

        window.addEventListener('api:loading', handler);
        return () => window.removeEventListener('api:loading', handler);
    }, []);

    const value = { isLoading: counter > 0 };

    return (
        <LoadingContext.Provider value={value}>
            {children}
        </LoadingContext.Provider>
    );
};

// Safety: if counter remains >0 for too long, reset to 0 to avoid stuck overlay
// (helps in development when a request hangs). This is not a substitute for fixing the root cause.
const MAX_STUCK_MS = 30000; // 30s

export const LoadingWatcher = () => {
    const [timer, setTimer] = React.useState(null);
    const { isLoading } = React.useContext(LoadingContext);

    React.useEffect(() => {
        if (isLoading) {
            const t = setTimeout(() => {
                // Force-reset by dispatching a delta that clears any lingering increments
                // eslint-disable-next-line no-console
                console.warn('[LoadingWatcher] Resetting stuck loading state after timeout');
                try {
                    window.dispatchEvent(new CustomEvent('api:loading', { detail: { delta: -1000 } }));
                } catch (_) {}
            }, MAX_STUCK_MS);
            setTimer(t);
            return () => clearTimeout(t);
        }
        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
    }, [isLoading]);

    return null;
};

export const useLoading = () => useContext(LoadingContext);

export default LoadingContext;
