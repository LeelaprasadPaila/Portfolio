import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getData, STORAGE_KEYS, saveData } from '../data/dataStore';
import ScrollReveal from '../components/ScrollReveal';

const EmptyState = ({ onAddSample }) => (
    <div className="research-empty" style={{
        textAlign: 'center',
        padding: '5rem 2rem',
        background: 'rgba(255,255,255,0.02)',
        borderRadius: '1.5rem',
        border: '1px dashed rgba(255,255,255,0.1)'
    }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.6 }}>
            <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
        </div>
        <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Research Papers Yet</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            This is where your published research papers will appear. Once you publish a paper,
            you can add it here with details like title, abstract, publication venue, and link.
        </p>
        <button
            onClick={onAddSample}
            style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                transition: 'transform 0.2s'
            }}
        >
            <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
            Add Your First Paper
        </button>
    </div>
);

const ResearchPapersPage = () => {
    const navigate = useNavigate();
    const [papers, setPapers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        authors: '',
        journal: '',
        year: new Date().getFullYear(),
        doi: '',
        link: '',
        abstract: '',
        status: 'Published'
    });

    const loadPapers = useCallback(() => {
        const saved = getData(STORAGE_KEYS.RESEARCH);
        setPapers(Array.isArray(saved) ? saved : []);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadPapers();
    }, [loadPapers]);

    const handleAddSample = () => {
        setShowForm(true);
        // Scroll to form
        setTimeout(() => {
            document.querySelector('.research-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPaper = {
            ...formData,
            id: Date.now().toString(),
            dateAdded: new Date().toISOString()
        };
        const updatedPapers = [...papers, newPaper];
        setPapers(updatedPapers);
        saveData(STORAGE_KEYS.RESEARCH, updatedPapers);
        setShowForm(false);
        setFormData({
            title: '',
            authors: '',
            journal: '',
            year: new Date().getFullYear(),
            doi: '',
            link: '',
            abstract: '',
            status: 'Published'
        });
    };

    const handleDelete = (id) => {
        const updated = papers.filter(p => p.id !== id);
        setPapers(updated);
        saveData(STORAGE_KEYS.RESEARCH, updated);
    };

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const styles = {
        page: {
            minHeight: '100vh',
            background: '#0a0a0f',
            color: '#fff',
            position: 'relative'
        },
        hero: {
            position: 'relative',
            padding: '6rem 2rem 4rem',
            textAlign: 'center',
            overflow: 'hidden'
        },
        heroBg: {
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(ellipse at 30% 50%, rgba(236,72,153,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139,92,246,0.15) 0%, transparent 60%)',
            zIndex: 0
        },
        heroContent: {
            position: 'relative',
            zIndex: 1,
            maxWidth: '800px',
            margin: '0 auto'
        },
        badge: {
            display: 'inline-block',
            padding: '0.35rem 1rem',
            borderRadius: '2rem',
            background: 'rgba(236,72,153,0.15)',
            color: '#ec4899',
            fontSize: '0.85rem',
            fontWeight: 600,
            border: '1px solid rgba(236,72,153,0.3)',
            marginBottom: '1rem'
        },
        title: {
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.2
        },
        gradientText: {
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
        },
        subtitle: {
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.1rem',
            lineHeight: 1.7
        },
        section: {
            padding: '0 2rem 6rem',
            maxWidth: '1200px',
            margin: '0 auto'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
        },
        card: {
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.06)',
            padding: '1.5rem',
            transition: 'all 0.3s ease',
            position: 'relative'
        },
        cardStatus: {
            display: 'inline-block',
            padding: '0.2rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            background: 'rgba(16,185,129,0.15)',
            color: '#10b981',
            border: '1px solid rgba(16,185,129,0.3)',
            marginBottom: '0.75rem'
        },
        cardTitle: {
            fontSize: '1.15rem',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '0.5rem',
            lineHeight: 1.4
        },
        cardAuthors: {
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            marginBottom: '0.5rem'
        },
        cardJournal: {
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '0.75rem'
        },
        cardAbstract: {
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
        },
        cardActions: {
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
        },
        linkBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            background: 'rgba(139,92,246,0.15)',
            color: '#a78bfa',
            border: '1px solid rgba(139,92,246,0.3)',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 0.2s'
        },
        deleteBtn: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            background: 'rgba(239,68,68,0.15)',
            color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.3)',
            cursor: 'pointer',
            marginLeft: 'auto',
            transition: 'all 0.2s'
        },
        formSection: {
            maxWidth: '700px',
            margin: '0 auto 3rem',
            padding: '2rem',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.08)'
        },
        formTitle: {
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '1.5rem'
        },
        formGroup: {
            marginBottom: '1rem'
        },
        label: {
            display: 'block',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '0.4rem',
            fontWeight: 500
        },
        input: {
            width: '100%',
            padding: '0.65rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
        },
        textarea: {
            width: '100%',
            padding: '0.65rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: '#fff',
            fontSize: '0.95rem',
            outline: 'none',
            resize: 'vertical',
            minHeight: '100px',
            boxSizing: 'border-box',
            fontFamily: 'inherit'
        },
        submitBtn: {
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            width: '100%',
            transition: 'transform 0.2s, opacity 0.2s'
        },
        cancelBtn: {
            background: 'transparent',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.75rem 2rem',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 500,
            width: '100%',
            marginTop: '0.5rem'
        },
        count: {
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '1.5rem'
        }
    };

    return (
        <div style={styles.page}>
            {/* Hero Section */}
            <section style={styles.hero}>
                <div style={styles.heroBg}></div>
                <div style={styles.heroContent}>
                    <ScrollReveal>
                        <div style={styles.badge}>Academic Research</div>
                        <h1 style={styles.title}>
                            Research <span style={styles.gradientText}>Papers</span>
                        </h1>
                        <p style={styles.subtitle}>
                            A collection of published research papers and academic contributions
                            in the fields of AI, Machine Learning, and related disciplines.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Content Section */}
            <section style={styles.section}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
                        Loading...
                    </div>
                ) : papers.length === 0 && !showForm ? (
                    <EmptyState onAddSample={handleAddSample} />
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={styles.count}>
                                {papers.length} paper{papers.length !== 1 ? 's' : ''}
                            </div>
                            <button
                                onClick={handleAddSample}
                                style={{
                                    ...styles.linkBtn,
                                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                                    color: '#fff',
                                    border: 'none'
                                }}
                            >
                                <i className="fas fa-plus"></i>
                                Add Paper
                            </button>
                        </div>

                        {/* Add Paper Form */}
                        {showForm && (
                            <div className="research-form-section" style={styles.formSection}>
                                <h3 style={styles.formTitle}>
                                    <i className="fas fa-file-alt" style={{ marginRight: '0.5rem' }}></i>
                                    Add New Research Paper
                                </h3>
                                <form onSubmit={handleSubmit}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Title *</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={formData.title}
                                            onChange={handleInputChange('title')}
                                            placeholder="e.g., A Novel Approach to ..."
                                            required
                                        />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Authors *</label>
                                        <input
                                            style={styles.input}
                                            type="text"
                                            value={formData.authors}
                                            onChange={handleInputChange('authors')}
                                            placeholder="e.g., Leelaprasad Paila, John Doe"
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Journal / Conference</label>
                                            <input
                                                style={styles.input}
                                                type="text"
                                                value={formData.journal}
                                                onChange={handleInputChange('journal')}
                                                placeholder="e.g., IEEE Conference on AI"
                                            />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Year *</label>
                                            <input
                                                style={styles.input}
                                                type="number"
                                                value={formData.year}
                                                onChange={handleInputChange('year')}
                                                min="2020"
                                                max="2030"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>DOI</label>
                                            <input
                                                style={styles.input}
                                                type="text"
                                                value={formData.doi}
                                                onChange={handleInputChange('doi')}
                                                placeholder="e.g., 10.xxxx/xxxxx"
                                            />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Link</label>
                                            <input
                                                style={styles.input}
                                                type="url"
                                                value={formData.link}
                                                onChange={handleInputChange('link')}
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Status</label>
                                        <select
                                            style={styles.input}
                                            value={formData.status}
                                            onChange={handleInputChange('status')}
                                        >
                                            <option value="Published">Published</option>
                                            <option value="Under Review">Under Review</option>
                                            <option value="Preprint">Preprint</option>
                                            <option value="In Progress">In Progress</option>
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Abstract</label>
                                        <textarea
                                            style={styles.textarea}
                                            value={formData.abstract}
                                            onChange={handleInputChange('abstract')}
                                            placeholder="Brief summary of the research paper..."
                                        />
                                    </div>
                                    <button type="submit" style={styles.submitBtn}>
                                        <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
                                        Save Paper
                                    </button>
                                    <button
                                        type="button"
                                        style={styles.cancelBtn}
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Papers Grid */}
                        {papers.length > 0 && (
                            <div style={styles.grid}>
                                {papers.map((paper) => (
                                    <ScrollReveal key={paper.id}>
                                        <div style={styles.card}>
                                            <div style={styles.cardStatus}>
                                                <i className="fas fa-check-circle" style={{ marginRight: '0.3rem' }}></i>
                                                {paper.status || 'Published'}
                                            </div>
                                            <h3 style={styles.cardTitle}>{paper.title}</h3>
                                            <p style={styles.cardAuthors}>
                                                <i className="fas fa-users" style={{ marginRight: '0.3rem', opacity: 0.5 }}></i>
                                                {paper.authors || 'Authors not specified'}
                                            </p>
                                            <p style={styles.cardJournal}>
                                                <i className="fas fa-book" style={{ marginRight: '0.3rem' }}></i>
                                                {paper.journal || 'Publication venue not specified'} ({paper.year})
                                            </p>
                                            {paper.abstract && (
                                                <p style={styles.cardAbstract}>
                                                    {paper.abstract}
                                                </p>
                                            )}
                                            <div style={styles.cardActions}>
                                                {paper.link && (
                                                    <a
                                                        href={paper.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={styles.linkBtn}
                                                    >
                                                        <i className="fas fa-external-link-alt"></i>
                                                        View Paper
                                                    </a>
                                                )}
                                                {paper.doi && (
                                                    <span style={{ ...styles.linkBtn, cursor: 'default', opacity: 0.7 }}>
                                                        DOI: {paper.doi}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(paper.id)}
                                                    style={styles.deleteBtn}
                                                    title="Delete paper"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </section>
        </div>
    );
};

export default ResearchPapersPage;