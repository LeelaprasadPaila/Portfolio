import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        
        // Log to console in development
        if (import.meta.env.DEV) {
            console.error('ErrorBoundary caught:', error, errorInfo);
        }

        // Track error if analytics is available
        if (window.gtag) {
            window.gtag('event', 'error', {
                error_message: error.message,
                error_stack: error.stack,
                component_stack: errorInfo?.componentStack,
            });
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const { fallback } = this.props;

            if (fallback) {
                return typeof fallback === 'function'
                    ? fallback({ 
                        error: this.state.error, 
                        resetError: this.handleReset 
                    })
                    : fallback;
            }

            return (
                <div className="error-boundary" role="alert">
                    <div className="error-boundary-content">
                        <div className="error-boundary-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="64" height="64">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className="error-boundary-title">Something went wrong</h2>
                        <p className="error-boundary-message">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <details className="error-boundary-details">
                                <summary>Error Details</summary>
                                <pre className="error-boundary-stack">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                        <div className="error-boundary-actions">
                            <button 
                                onClick={this.handleReset}
                                className="error-boundary-btn error-boundary-btn-primary"
                            >
                                Try Again
                            </button>
                            <button 
                                onClick={this.handleReload}
                                className="error-boundary-btn error-boundary-btn-secondary"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
