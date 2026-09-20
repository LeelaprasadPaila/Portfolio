import React, { useEffect, useRef, useState } from 'react';
import { assetUrl } from '../config/env';
import '../styles/BlogPreview.css';

const blogPosts = [
    {
        title: 'Building Scalable ML Pipelines with FastAPI',
        category: 'Machine Learning',
        readingTime: '8 min read',
        date: 'Mar 15, 2026',
        summary: 'A deep dive into architecting production-grade machine learning pipelines using FastAPI, Docker, and async processing patterns.',
        image: assetUrl('images/blog/blog-1.jpg'),
        color: '#00f2ff',
    },
    {
        title: 'Understanding Transformer Architectures',
        category: 'Deep Learning',
        readingTime: '12 min read',
        date: 'Feb 28, 2026',
        summary: 'An intuitive explanation of transformer models, attention mechanisms, and how they revolutionized natural language processing.',
        image: assetUrl('images/blog/blog-2.jpg'),
        color: '#8b5cf6',
    },
    {
        title: 'Optimizing Python Backend Performance',
        category: 'Backend',
        readingTime: '6 min read',
        date: 'Feb 10, 2026',
        summary: 'Practical strategies for improving Python backend performance including caching, async/await, and database optimization techniques.',
        image: assetUrl('images/blog/blog-3.jpg'),
        color: '#10b981',
    },
    {
        title: 'Computer Vision: From Theory to Production',
        category: 'Computer Vision',
        readingTime: '10 min read',
        date: 'Jan 25, 2026',
        summary: 'A comprehensive guide to deploying computer vision models in production, covering CNNs, object detection, and real-time inference.',
        image: assetUrl('images/blog/blog-4.jpg'),
        color: '#ec4899',
    },
];

const BlogPreview = ({ onExploreClick }) => {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.index);
                        setVisibleItems((prev) => new Set([...prev, index]));
                    }
                });
            },
            { threshold: 0.15 }
        );

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <section className="blog-preview-section" ref={sectionRef}>
            {/* Background */}
            <div className="blog-preview-bg" />
            <div className="blog-preview-bg-2" />

            <div className="blog-preview-container">
                {/* Section Header */}
                <div className="blog-preview-header">
                    <span className="blog-preview-badge">Latest Articles</span>
                    <h2 className="blog-preview-title">From the Blog</h2>
                    <p className="blog-preview-subtitle">
                        Insights, tutorials, and deep dives into AI, ML, and software engineering
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="blog-preview-grid">
                    {blogPosts.map((post, index) => (
                        <div
                            key={index}
                            className={`blog-preview-card ${
                                visibleItems.has(index) ? 'blog-preview-card-visible' : ''
                            }`}
                            data-index={index}
                            ref={(el) => (cardRefs.current[index] = el)}
                            style={{ '--card-color': post.color }}
                        >
                            {/* Card Image */}
                            <div className="blog-preview-card-image">
                                <div className="blog-preview-card-image-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                        <polyline points="10 9 9 9 8 9" />
                                    </svg>
                                </div>
                                <div className="blog-preview-card-image-overlay" />
                                {/* Category Badge */}
                                <span className="blog-preview-card-category">{post.category}</span>
                            </div>

                            {/* Card Content */}
                            <div className="blog-preview-card-content">
                                {/* Meta */}
                                <div className="blog-preview-card-meta">
                                    <span className="blog-preview-card-date">{post.date}</span>
                                    <span className="blog-preview-card-reading">{post.readingTime}</span>
                                </div>

                                {/* Title */}
                                <h3 className="blog-preview-card-title">{post.title}</h3>

                                {/* Summary */}
                                <p className="blog-preview-card-summary">{post.summary}</p>

                                {/* Continue Reading */}
                                <button
                                    className="blog-preview-card-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onExploreClick('blog');
                                    }}
                                >
                                    Continue Reading
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </button>
                            </div>

                            {/* Card Glow */}
                            <div className="blog-preview-card-glow" />
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="blog-preview-footer">
                    <button
                        className="blog-preview-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            onExploreClick('blog');
                        }}
                    >
                        <span>View All Articles</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default BlogPreview;