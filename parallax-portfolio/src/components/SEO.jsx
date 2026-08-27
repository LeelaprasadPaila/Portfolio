import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'Paila Leela Prasad - AI Architect & Full-Stack Engineer Portfolio';
const DEFAULT_DESCRIPTION = 'AI & Machine Learning specialist portfolio showcasing 50+ projects, certifications, and expertise in artificial intelligence, deep learning, and full-stack engineering.';
const SITE_URL = 'https://leelaprasad.dev/';
const SITE_NAME = 'Paila Leela Prasad Portfolio';

const pageMeta = {
    '/': {
        title: DEFAULT_TITLE,
        description: DEFAULT_DESCRIPTION,
        ogType: 'website',
    },
    '/projects': {
        title: 'Projects - Paila Leela Prasad | AI & Full-Stack Portfolio',
        description: 'Explore 50+ AI, machine learning, and full-stack development projects. From deep learning models to production web applications.',
        ogType: 'website',
    },
    '/experience': {
        title: 'Experience - Paila Leela Prasad | Professional Journey',
        description: 'Professional experience and internships in AI, machine learning, and software engineering.',
        ogType: 'article',
    },
    '/resume': {
        title: 'Resume - Paila Leela Prasad | AI Engineer',
        description: 'Download resume and view professional qualifications of Paila Leela Prasad, AI Architect & Full-Stack Engineer.',
        ogType: 'website',
    },
    '/certificates': {
        title: 'Certifications - Paila Leela Prasad | AI & ML Credentials',
        description: 'View professional certifications in AI, machine learning, deep learning, and full-stack development.',
        ogType: 'website',
    },
    '/skills': {
        title: 'Skills - Paila Leela Prasad | Technical Expertise',
        description: 'Technical skills and expertise in AI, machine learning, deep learning, React, Python, TensorFlow, and more.',
        ogType: 'website',
    },
    '/about': {
        title: 'About - Paila Leela Prasad | AI Architect',
        description: 'Learn more about Paila Leela Prasad, an AI Architect & Full-Stack Engineer passionate about building intelligent systems.',
        ogType: 'profile',
    },
    '/contact': {
        title: 'Contact - Paila Leela Prasad | Get in Touch',
        description: 'Get in touch with Paila Leela Prasad for collaboration, opportunities, or project inquiries.',
        ogType: 'website',
    },
};

const SEO = ({ customMeta = {} }) => {
    const location = useLocation();
    const path = location.pathname.replace(/\/$/, '') || '/';
    
    const meta = pageMeta[path] || pageMeta['/'];
    const title = customMeta.title || meta.title;
    const description = customMeta.description || meta.description;
    const ogType = customMeta.ogType || meta.ogType || 'website';
    const canonical = customMeta.canonical || `${SITE_URL}${path === '/' ? '' : path.substring(1)}`;
    const image = customMeta.image || 'https://leelaprasad.dev/images/og-image.jpg';

    useEffect(() => {
        // Update document title
        document.title = title;

        // Update or create meta tags
        const updateMetaTag = (name, content, property = false) => {
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let tag = document.querySelector(selector);
            if (!tag) {
                tag = document.createElement('meta');
                if (property) {
                    tag.setAttribute('property', name);
                } else {
                    tag.setAttribute('name', name);
                }
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        updateMetaTag('description', description);
        updateMetaTag('og:title', title, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:url', canonical, true);
        updateMetaTag('og:type', ogType, true);
        updateMetaTag('og:image', image, true);
        updateMetaTag('og:site_name', SITE_NAME, true);
        updateMetaTag('twitter:title', title, true);
        updateMetaTag('twitter:description', description, true);
        updateMetaTag('twitter:image', image, true);

        // Update canonical link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            document.head.appendChild(canonicalLink);
        }
        canonicalLink.setAttribute('href', canonical);

        // Scroll to top on route change
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [title, description, canonical, ogType, image, location.pathname]);

    return null;
};

export default SEO;