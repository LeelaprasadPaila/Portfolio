/**
 * Analytics Service
 * Privacy-friendly analytics with support for multiple providers
 */

class Analytics {
    constructor() {
        this.initialized = false;
        this.providers = {
            google: null,
            plausible: null,
            posthog: null,
            clarity: null,
        };
    }

    init() {
        if (this.initialized || import.meta.env.DEV) return;

        this.initGoogleAnalytics();
        this.initPlausible();
        this.initPostHog();
        this.initMicrosoftClarity();

        this.initialized = true;
    }

    initGoogleAnalytics() {
        const GA_ID = import.meta.env.VITE_GA_ID;
        if (!GA_ID) return;

        // Load gtag script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', GA_ID, {
            page_path: window.location.pathname,
            anonymize_ip: true,
            cookie_flags: 'SameSite=None;Secure',
        });
        window.gtag = gtag;
        this.providers.google = gtag;
    }

    initPlausible() {
        const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
        if (!PLAUSIBLE_DOMAIN) return;

        const script = document.createElement('script');
        script.defer = true;
        script.setAttribute('data-domain', PLAUSIBLE_DOMAIN);
        script.src = 'https://plausible.io/js/script.js';
        document.head.appendChild(script);
        this.providers.plausible = true;
    }

    initPostHog() {
        const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
        const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';
        if (!POSTHOG_KEY) return;

        // Load PostHog
        window.posthog = window.posthog || [];
        window.posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            autocapture: true,
            capture_pageview: true,
            capture_pageleave: true,
            session_recording: {
                maskAllInputs: false,
                maskInputOptions: {
                    password: true,
                },
            },
        });
        this.providers.posthog = window.posthog;
    }

    initMicrosoftClarity() {
        const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;
        if (!CLARITY_ID) return;

        (function(c, l, a, r, i, t, y) {
            c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) };
            t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', CLARITY_ID);
        this.providers.clarity = true;
    }

    // Track page view
    pageView(path, title) {
        if (!this.initialized) return;

        if (this.providers.google) {
            this.providers.google('event', 'page_view', {
                page_path: path,
                page_title: title,
            });
        }

        if (this.providers.posthog) {
            this.providers.posthog.capture('$pageview', {
                $current_url: path,
                $page_title: title,
            });
        }
    }

    // Track custom event
    track(eventName, properties = {}) {
        if (!this.initialized) return;

        if (this.providers.google) {
            this.providers.google('event', eventName, properties);
        }

        if (this.providers.posthog) {
            this.providers.posthog.capture(eventName, properties);
        }
    }

    // Track project click
    trackProjectClick(projectId, projectTitle) {
        this.track('project_click', {
            project_id: projectId,
            project_title: projectTitle,
        });
    }

    // Track blog engagement
    trackBlogEngagement(articleId, articleTitle, action) {
        this.track('blog_engagement', {
            article_id: articleId,
            article_title: articleTitle,
            action: action, // 'read', 'scroll_depth', 'share'
        });
    }

    // Track outbound link click
    trackOutboundLink(url, linkText) {
        this.track('outbound_link_click', {
            url: url,
            link_text: linkText,
        });
    }

    // Track search
    trackSearch(searchTerm, resultsCount) {
        this.track('search', {
            search_term: searchTerm,
            results_count: resultsCount,
        });
    }

    // Track error
    trackError(error, context = {}) {
        this.track('error', {
            error_message: error.message,
            error_stack: error.stack,
            ...context,
        });
    }

    // Track performance metrics
    trackPerformance(metrics) {
        this.track('performance', metrics);
    }

    // Track user interaction
    trackInteraction(interactionType, target, details = {}) {
        this.track('user_interaction', {
            type: interactionType,
            target: target,
            ...details,
        });
    }
}

export const analytics = new Analytics();
export default analytics;