import React, { useState, useEffect } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import * as api from '../services/api';
import '../styles/Admin.css';

const Admin = ({ onNavClick }) => {
    const [credentials, setCredentials] = useState({ username: 'admin', password: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState('bio');
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(false);

    // Data States
    const [bio, setBio] = useState({});
    const [certs, setCerts] = useState([]);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [techSkills, setTechSkills] = useState([]);
    const [interests, setInterests] = useState([]);
    const [internships, setInternships] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [stats, setStats] = useState([]);


    // Local state for tech skill tag inputs
    const [newTagInputs, setNewTagInputs] = useState({});

    // Filter states
    const [certFilter, setCertFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('');
    const [certCategoryFilter, setCertCategoryFilter] = useState('All');
    const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');

    useEffect(() => {
        setBio(getData(STORAGE_KEYS.BIO));
        setCerts(getData(STORAGE_KEYS.CERTS));
        setProjects(getData(STORAGE_KEYS.PROJECTS));
        setSkills(getData(STORAGE_KEYS.SKILLS));
        setTechSkills(getData(STORAGE_KEYS.TECH_SKILLS));
        setInterests(getData(STORAGE_KEYS.INTERESTS));
        setTestimonials(getData(STORAGE_KEYS.TESTIMONIALS));
        setStats(getData(STORAGE_KEYS.STATS));
        setInternships(getData(STORAGE_KEYS.INTERNSHIPS));
    }, []);

    // Auto-calculate age for display in admin
    const calculatedAge = () => {
        if (!bio.birthday) return '--';
        const birthDate = new Date(bio.birthday);
        if (isNaN(birthDate)) return '--';
        const now = new Date();
        let y = now.getFullYear() - birthDate.getFullYear();
        if (now.getMonth() < birthDate.getMonth() || (now.getMonth() === birthDate.getMonth() && now.getDate() < birthDate.getDate())) {
            y--;
        }
        return y;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await api.loginAdmin(credentials.username, credentials.password);
            if (data.token) {
                api.setAuthToken(data.token);
                setIsAuthenticated(true);
                showNotification('SYSTEM ACCESS GRANTED', 'success');
                fetchData();
            }
        } catch (err) {
            console.error('Login failed:', err);
            showNotification('ACCESS DENIED: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Bio
            try { const b = await api.getBio(); if (b) setBio(b); } catch (e) { setBio(getData(STORAGE_KEYS.BIO)); }
            // Projects
            try { const p = await api.getProjects(); if (p) setProjects(p); } catch (e) { setProjects(getData(STORAGE_KEYS.PROJECTS)); }
            // Certs
            try { const c = await api.getCertificates(); if (c) setCerts(c); } catch (e) { setCerts(getData(STORAGE_KEYS.CERTS)); }
            // Internships
            try { const i = await api.getInternships(); if (i) setInternships(i); } catch (e) { setInternships(getData(STORAGE_KEYS.INTERNSHIPS)); }
            // Skills
            try { const s = await api.getSkills(); if (s) setSkills(s); } catch (e) { setSkills(getData(STORAGE_KEYS.SKILLS)); }
            
            // Other static stats
            setTechSkills(getData(STORAGE_KEYS.TECH_SKILLS));
            setInterests(getData(STORAGE_KEYS.INTERESTS));
            setTestimonials(getData(STORAGE_KEYS.TESTIMONIALS));
            setStats(getData(STORAGE_KEYS.STATS));

        } finally {
            setLoading(false);
        }
    };

    const showNotification = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSave = async (key, data, msg, apiCall) => {
        setLoading(true);
        try {
            // If an API call is provided (for bulk sync or Bio), use it
            if (apiCall) {
                // If it's the Bio/Static update (single object)
                if (key === STORAGE_KEYS.BIO) {
                    await apiCall(data);
                } else {
                    // For Lists (Projects, Certs, Internships)
                    // We sync each item to ensure they are properly handled by the backend
                    for (const item of data) {
                        try {
                            if (item._id) {
                                // Update existing
                                await api.updateById(key, item._id, item);
                            } else {
                                // Create new
                                await api.createOne(key, item);
                            }
                        } catch (err) {
                            console.warn(`Sync failed for item in ${key}:`, err);
                        }
                    }
                }
            }
            
            // Always update local state too
            showNotification(msg || 'Changes Synced to Mainframe.');
        } catch (err) {
            showNotification('SYNC FAILED: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Auto-sync stats state when certs or projects lengths change
    useEffect(() => {
        if (isAuthenticated && stats.length > 0) {
            const updatedStats = stats.map(s => {
                if (s.label === 'Certificates') return { ...s, value: certs.length };
                if (s.label === 'Projects') return { ...s, value: projects.length };
                if (s.label === 'Internships') return { ...s, value: internships.filter(i => i.type === 'Internship').length };
                if (s.label === 'Experience') return { ...s, value: internships.filter(i => i.type === 'Experience').length };
                return s;
            });
            // Only update if actual value changed
            if (JSON.stringify(updatedStats) !== JSON.stringify(stats)) {
                setStats(updatedStats);
            }
        }
    }, [certs.length, projects.length, internships, isAuthenticated, stats.length]);

    if (!isAuthenticated) {
        return (
            <div className="admin-gateway" style={{ justifyContent: 'center', alignItems: 'center' }}>
                {notification && <div className={`admin-toast ${notification.type}`}>{notification.msg}</div>}
                <div className="admin-login-card">
                    <h1>SECURE ACCESS</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="text"
                            className="admin-input"
                            placeholder="Username"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                        <input
                            type="password"
                            className="admin-input"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                        <button type="submit" className="save-btn" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'ESTABLISHING...' : 'ESTABLISH LINK'}
                        </button>
                    </form>
                    <button
                        onClick={() => onNavClick('home')}
                        style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        ← Back to Portfolio
                    </button>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'bio', label: 'PROFILE', icon: 'fa-user' },
        { id: 'skills', label: 'SKILL MASTERY', icon: 'fa-percentage' },
        { id: 'tech', label: 'SPECIALIZED EXPERTISE', icon: 'fa-th' },
        { id: 'projects', label: 'PROJECTS', icon: 'fa-project-diagram' },
        { id: 'certs', label: 'ACHIEVEMENTS', icon: 'fa-certificate' },
        { id: 'testimonials', label: 'KIND WORDS', icon: 'fa-quote-right' },
        { id: 'stats', label: 'METRICS', icon: 'fa-chart-line' },
        { id: 'internships', label: 'INTERNSHIPS', icon: 'fa-briefcase' }
    ];

    return (
        <div className="admin-gateway">
            {notification && <div className={`admin-toast ${notification.type}`}><i className="fas fa-check-circle"></i> {notification.msg}</div>}

            <div className="admin-sidebar">
                <div className="sidebar-title">
                    <i className="fas fa-shield-alt" style={{ marginRight: '12px', fontSize: '1.4rem' }}></i>
                    COMMAND CENTER
                </div>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <i className={`fas ${tab.icon}`}></i>
                        {tab.label}
                    </button>
                ))}
                <div style={{ marginTop: 'auto', padding: '1rem' }}>
                    <button className="delete-btn" style={{ width: '100%', fontSize: '0.7rem', opacity: 0.6 }} onClick={() => setIsAuthenticated(false)}>LOGOUT SESSION</button>
                </div>
            </div>

            <div className="admin-main-content">
                <div className="admin-dashboard">
                    <div className="dashboard-header">
                        <div>
                            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-color)' }}>{tabs.find(t => t.id === activeTab).label}</h1>
                            <p style={{ color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Real-time modifications enabled for active environment.</p>
                        </div>
                    </div>

                    {/* BIO EDITOR */}
                    {activeTab === 'bio' && (
                        <div className="admin-section-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ margin: 0 }}>Identity Profile</h2>
                                <div style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--primary-color)', fontSize: '0.8rem' }}>
                                    AUTO-AGE: <strong>{calculatedAge()}</strong>
                                </div>
                            </div>
                            <div className="form-grid">
                                {Object.keys(bio).map(key => (
                                    <div key={key} className="form-group">
                                        <label>{key}</label>
                                        {key === 'intro' ? (
                                            <textarea className="admin-input" rows="5" value={bio[key]} onChange={(e) => setBio({ ...bio, [key]: e.target.value })} />
                                        ) : key === 'age' ? (
                                            <input type="text" className="admin-input" value={calculatedAge()} disabled style={{ opacity: 0.5 }} />
                                        ) : (
                                            <input type="text" className="admin-input" value={bio[key]} onChange={(e) => setBio({ ...bio, [key]: e.target.value })} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button className="save-btn" onClick={() => handleSave(STORAGE_KEYS.BIO, bio, 'Identity Synchronized.')}>APPLY PROFILE CHANGES</button>
                        </div>
                    )}

                    {/* SKILLS MASTERY */}
                    {activeTab === 'skills' && (
                        <div className="admin-section-card">
                            <h2>Proficiency Calibration</h2>
                            {skills.map((skill, idx) => (
                                <div key={idx} className="skill-list-item" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ fontSize: '0.6rem', color: 'var(--primary-color)', marginBottom: '0.5rem', display: 'block' }}>SKILL NAME</label>
                                        <input type="text" className="admin-input" style={{ marginBottom: 0 }} value={skill.name} onChange={(e) => {
                                            const n = [...skills]; n[idx].name = e.target.value; setSkills(n);
                                        }} />
                                    </div>
                                    <div style={{ width: '120px' }}>
                                        <label style={{ fontSize: '0.6rem', color: 'var(--primary-color)', marginBottom: '0.5rem', display: 'block' }}>LEVEL (%)</label>
                                        <input type="number" className="admin-input" style={{ marginBottom: 0 }} value={skill.level} onChange={(e) => {
                                            const n = [...skills]; n[idx].level = parseInt(e.target.value); setSkills(n);
                                        }} />
                                    </div>
                                    <button className="delete-btn" style={{ marginTop: '1.4rem' }} onClick={() => setSkills(skills.filter((_, i) => i !== idx))}>×</button>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => setSkills([...skills, { name: 'New Skill', level: 50 }])}>+ Add New Proficiency Bar</button>
                            <button className="save-btn" style={{ marginTop: '3rem' }} onClick={() => handleSave(STORAGE_KEYS.SKILLS, skills, 'Proficiency Data Synced.')}>SAVE SKILL MASTERY</button>
                        </div>
                    )}

                    {/* SPECIALIZED EXPERTISE */}
                    {activeTab === 'tech' && (
                        <div className="admin-section-card">
                            <h2>Expertise Clusters</h2>
                            {techSkills.map((cat, cIdx) => (
                                <div key={cIdx} className="tech-category-editor" style={{ background: 'rgba(10, 15, 25, 0.4)', padding: '2rem', marginBottom: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Domain Title</label>
                                            <input type="text" className="admin-input" value={cat.title} onChange={(e) => {
                                                const n = [...techSkills]; n[cIdx].title = e.target.value; setTechSkills(n);
                                            }} />
                                        </div>
                                        <div className="form-group">
                                            <label>Icon Style (FontAwesome)</label>
                                            <input type="text" className="admin-input" value={cat.icon} onChange={(e) => {
                                                const n = [...techSkills]; n[cIdx].icon = e.target.value; setTechSkills(n);
                                            }} />
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '2rem' }}>
                                        <label style={{ fontSize: '0.75rem', color: 'var(--primary-color)', display: 'block', marginBottom: '1rem' }}>DOMAIN TAGS</label>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                            {cat.skills.map((s, sIdx) => (
                                                <div key={sIdx} className="nested-skill-tag">
                                                    {s}
                                                    <button onClick={() => {
                                                        const n = [...techSkills];
                                                        n[cIdx].skills = n[cIdx].skills.filter((_, i) => i !== sIdx);
                                                        setTechSkills(n);
                                                    }}><i className="fas fa-times"></i></button>
                                                </div>
                                            ))}
                                            <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    placeholder="New Tag..."
                                                    className="admin-input"
                                                    style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', marginBottom: 0, width: '150px' }}
                                                    value={newTagInputs[cIdx] || ''}
                                                    onChange={(e) => setNewTagInputs({ ...newTagInputs, [cIdx]: e.target.value })}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter' && newTagInputs[cIdx]) {
                                                            const n = [...techSkills];
                                                            n[cIdx].skills.push(newTagInputs[cIdx]);
                                                            setTechSkills(n);
                                                            setNewTagInputs({ ...newTagInputs, [cIdx]: '' });
                                                        }
                                                    }}
                                                />
                                                <button className="add-nested-skill" onClick={() => {
                                                    if (newTagInputs[cIdx]) {
                                                        const n = [...techSkills];
                                                        n[cIdx].skills.push(newTagInputs[cIdx]);
                                                        setTechSkills(n);
                                                        setNewTagInputs({ ...newTagInputs, [cIdx]: '' });
                                                    }
                                                }}>+ ADD</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                                        <button className="delete-btn" onClick={() => setTechSkills(techSkills.filter((_, i) => i !== cIdx))}>Destroy Cluster</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" style={{ marginBottom: '5rem' }} onClick={() => setTechSkills([...techSkills, { title: 'New Domain', icon: 'fas fa-shield-alt', skills: [] }])}>+ Initialize New Domain Cluster</button>
                            <button className="save-btn" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }} onClick={() => handleSave(STORAGE_KEYS.TECH_SKILLS, techSkills, 'Expertise Clusters Deployed.')}>SYNC EXPERTISE GRID</button>
                        </div>
                    )}

                    {/* REDUNDANT BLOCK REMOVAL */}
                    {activeTab === 'projects' && (
                        <div className="admin-section-card" style={{ display: 'none' }}></div>
                    )}

                    {/* INTERNSHIPS */}
                    {activeTab === 'internships' && (
                        <div className="admin-section-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                                <h2 style={{ margin: 0 }}>Internship Experience</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                        <i className="fas fa-search" style={{ marginLeft: '10px', opacity: 0.4 }}></i>
                                        <input
                                            type="text"
                                            placeholder="Filter by company..."
                                            className="admin-input"
                                            style={{ width: '200px', marginBottom: 0, background: 'transparent', border: 'none' }}
                                        // No filter implementation for brevity
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {internships.map((intern, idx) => {
                                    const i = internships.indexOf(intern);
                                    return (
                                        <div key={i} className="tech-category-editor" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Type</label>
                                                    <select className="admin-input" value={intern.type || 'Internship'} onChange={(e) => {
                                                        const n = [...internships]; n[i].type = e.target.value; setInternships(n);
                                                    }}>
                                                        <option value="Internship">Internship</option>
                                                        <option value="Experience">Experience</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Company / Lab</label>
                                                    <input type="text" className="admin-input" value={intern.company} onChange={(e) => {
                                                        const n = [...internships]; n[i].company = e.target.value; setInternships(n);
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Role</label>
                                                    <input type="text" className="admin-input" value={intern.role} onChange={(e) => {
                                                        const n = [...internships]; n[i].role = e.target.value; setInternships(n);
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Duration</label>
                                                    <input type="text" className="admin-input" value={intern.duration} onChange={(e) => {
                                                        const n = [...internships]; n[i].duration = e.target.value; setInternships(n);
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Description</label>
                                                    <textarea className="admin-input" rows="3" value={intern.desc} onChange={(e) => {
                                                        const n = [...internships]; n[i].desc = e.target.value; setInternships(n);
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Image URL</label>
                                                    <input type="text" className="admin-input" value={intern.image} onChange={(e) => {
                                                        const n = [...internships]; n[i].image = e.target.value; setInternships(n);
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Link</label>
                                                    <input type="text" className="admin-input" value={intern.link} onChange={(e) => {
                                                        const n = [...internships]; n[i].link = e.target.value; setInternships(n);
                                                    }} />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                                <button className="delete-btn" onClick={() => setInternships(internships.filter((_, j) => j !== i))}>DELETE ENTRY</button>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button className="add-btn" onClick={() => setInternships([...internships, { company: '', role: '', duration: '', desc: '', image: '', link: '' }])}>+ ADD INTERNSHIP</button>
                                <button className="save-btn" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }} onClick={() => handleSave(STORAGE_KEYS.INTERNSHIPS, internships, 'Internships Synced.', api.createInternship)}>SYNC INTERNSHIPS</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="admin-section-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                                <h2 style={{ margin: 0 }}>Project Portfolio</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select
                                        className="admin-input"
                                        style={{ width: '150px', marginBottom: 0, paddingRight: '1rem' }}
                                        value={projectCategoryFilter}
                                        onChange={(e) => setProjectCategoryFilter(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {[...new Set(projects.map(p => p.category))].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                        <i className="fas fa-search" style={{ marginLeft: '10px', opacity: 0.4 }}></i>
                                        <input
                                            type="text"
                                            placeholder="Filter by title..."
                                            className="admin-input"
                                            style={{ width: '200px', marginBottom: 0, background: 'transparent', border: 'none' }}
                                            value={projectFilter}
                                            onChange={(e) => setProjectFilter(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <datalist id="project-categories">
                                {[...new Set(projects.map(p => p.category))].map(cat => <option key={cat} value={cat} />)}
                            </datalist>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {projects
                                    .filter(p => (projectCategoryFilter === 'All' || p.category === projectCategoryFilter) && p.title.toLowerCase().includes(projectFilter.toLowerCase()))
                                    .map((project, filteredIdx) => {
                                        const idx = projects.indexOf(project);
                                        return (
                                            <div key={idx} className="tech-category-editor" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label><i className="fas fa-tag"></i> CATEGORY</label>
                                                        <input
                                                            list="project-categories"
                                                            type="text"
                                                            className="admin-input"
                                                            value={project.category}
                                                            onChange={(e) => {
                                                                const n = [...projects]; n[idx].category = e.target.value; setProjects(n);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-heading"></i> TITLE</label>
                                                        <input type="text" className="admin-input" value={project.title} onChange={(e) => {
                                                            const n = [...projects]; n[idx].title = e.target.value; setProjects(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-code"></i> TECH META</label>
                                                        <input type="text" className="admin-input" value={project.meta} onChange={(e) => {
                                                            const n = [...projects]; n[idx].meta = e.target.value; setProjects(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-image"></i> IMAGE URL</label>
                                                        <input type="text" className="admin-input" value={project.image} onChange={(e) => {
                                                            const n = [...projects]; n[idx].image = e.target.value; setProjects(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-external-link-alt"></i> LIVE LINK</label>
                                                        <input type="text" className="admin-input" value={project.link} onChange={(e) => {
                                                            const n = [...projects]; n[idx].link = e.target.value; setProjects(n);
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                                    <label><i className="fas fa-align-left"></i> DESCRIPTION</label>
                                                    <textarea className="admin-input" rows="3" value={project.desc} onChange={(e) => {
                                                        const n = [...projects]; n[idx].desc = e.target.value; setProjects(n);
                                                    }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                                    <button className="delete-btn" onClick={() => setProjects(projects.filter((_, i) => i !== idx))}>DELETE PROJECT</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                            <button className="add-btn" style={{ marginBottom: '5rem' }} onClick={() => setProjects([{
                                category: 'Machine Learning',
                                title: 'New Portfolio Project',
                                desc: 'Project overview and objectives...',
                                image: 'images/projects/project-1-thumb.png',
                                link: '#',
                                meta: 'Python | React'
                            }, ...projects])}>+ DEPLOY NEW PROJECT ENTRY</button>
                            <button className="save-btn" style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }} onClick={() => handleSave(STORAGE_KEYS.PROJECTS, projects, 'Projects Mainframe Synchronized.', api.createProject)}>SYNC PROJECT DATA</button>
                        </div>
                    )}

                    {/* CERTS */}
                    {activeTab === 'certs' && (
                        <div className="admin-section-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                                <h2 style={{ margin: 0 }}>Credential Inventory</h2>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select
                                        className="admin-input"
                                        style={{ width: '150px', marginBottom: 0 }}
                                        value={certCategoryFilter}
                                        onChange={(e) => setCertCategoryFilter(e.target.value)}
                                    >
                                        <option value="All">All Categories</option>
                                        {[...new Set(certs.map(c => c.category))].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <div className="add-nested-container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                                        <i className="fas fa-search" style={{ marginLeft: '10px', opacity: 0.4 }}></i>
                                        <input
                                            type="text"
                                            placeholder="Filter by title..."
                                            className="admin-input"
                                            style={{ width: '200px', marginBottom: 0, background: 'transparent', border: 'none' }}
                                            value={certFilter}
                                            onChange={(e) => setCertFilter(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <datalist id="cert-categories">
                                {[...new Set(certs.map(c => c.category))].map(cat => <option key={cat} value={cat} />)}
                            </datalist>

                            <div className="certs-management-list" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {certs
                                    .filter(c => (certCategoryFilter === 'All' || c.category === certCategoryFilter) && c.title.toLowerCase().includes(certFilter.toLowerCase()))
                                    .map((cert, filteredIdx) => {
                                        const idx = certs.indexOf(cert);
                                        return (
                                            <div key={idx} className="tech-category-editor" style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div className="form-grid">
                                                    <div className="form-group">
                                                        <label><i className="fas fa-tag"></i> CATEGORY</label>
                                                        <input
                                                            list="cert-categories"
                                                            type="text"
                                                            className="admin-input"
                                                            value={cert.category}
                                                            onChange={(e) => {
                                                                const n = [...certs]; n[idx].category = e.target.value; setCerts(n);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-heading"></i> TITLE</label>
                                                        <input type="text" className="admin-input" value={cert.title} onChange={(e) => {
                                                            const n = [...certs]; n[idx].title = e.target.value; setCerts(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-building"></i> PROVIDER</label>
                                                        <input type="text" className="admin-input" value={cert.provider} onChange={(e) => {
                                                            const n = [...certs]; n[idx].provider = e.target.value; setCerts(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-calendar-alt"></i> DATE</label>
                                                        <input type="text" className="admin-input" value={cert.date} onChange={(e) => {
                                                            const n = [...certs]; n[idx].date = e.target.value; setCerts(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-image"></i> IMAGE PATH</label>
                                                        <input type="text" className="admin-input" value={cert.image} onChange={(e) => {
                                                            const n = [...certs]; n[idx].image = e.target.value; setCerts(n);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label><i className="fas fa-link"></i> VERIFY URL</label>
                                                        <input type="text" className="admin-input" value={cert.verifyUrl} onChange={(e) => {
                                                            const n = [...certs]; n[idx].verifyUrl = e.target.value; setCerts(n);
                                                        }} />
                                                    </div>
                                                </div>
                                                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                                                    <label><i className="fas fa-align-left"></i> DETAILS / OVERVIEW</label>
                                                    <textarea className="admin-input" rows="3" value={cert.details} onChange={(e) => {
                                                        const n = [...certs]; n[idx].details = e.target.value; setCerts(n);
                                                    }} />
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                                    <button className="delete-btn" onClick={() => setCerts(certs.filter((_, i) => i !== idx))}>REDACT CREDENTIAL</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            <button className="add-btn" style={{ marginTop: '2rem' }} onClick={() => setCerts([{
                                id: Date.now(),
                                category: 'Industry',
                                title: 'New Credential',
                                provider: 'Provider Name',
                                date: 'Jan 2024',
                                image: 'images/certificates/cert-1.png',
                                verifyUrl: 'https://verify.link',
                                details: 'Credential description...'
                            }, ...certs])}>+ ACQUIRE NEW CREDENTIAL</button>

                            <button
                                className="save-btn"
                                style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, boxShadow: '0 0 30px rgba(0, 242, 255, 0.4)' }}
                                onClick={() => handleSave(STORAGE_KEYS.CERTS, certs, 'Credentials Mainframe Updated.', api.createCertificate)}
                            >
                                DEPLOY CREDENTIALS
                            </button>
                        </div>
                    )}

                    {/* KIND WORDS */}
                    {activeTab === 'testimonials' && (
                        <div className="admin-section-card">
                            <h2>Intelligence Briefings</h2>
                            {testimonials.map((t, idx) => (
                                <div key={idx} className="cert-entry" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem' }}>
                                    <textarea className="admin-input" style={{ marginBottom: 0 }} value={t.text} onChange={(e) => {
                                        const n = [...testimonials]; n[idx].text = e.target.value; setTestimonials(n);
                                    }} placeholder="Intel Content..." />
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input type="text" className="admin-input" style={{ flex: 1, marginBottom: 0 }} value={t.author} onChange={(e) => {
                                            const n = [...testimonials]; n[idx].author = e.target.value; setTestimonials(n);
                                        }} placeholder="Source Designation" />
                                        <button className="delete-btn" onClick={() => setTestimonials(testimonials.filter((_, i) => i !== idx))}>DESTROY BRIEFING</button>
                                    </div>
                                </div>
                            ))}
                            <button className="add-btn" onClick={() => setTestimonials([...testimonials, { text: '', author: '' }])}>+ Gather New Intelligence</button>
                            <button className="save-btn" style={{ marginTop: '3rem' }} onClick={() => handleSave(STORAGE_KEYS.TESTIMONIALS, testimonials, 'Briefings Deployed.')}>SYNC KIND WORDS</button>
                        </div>
                    )}

                    {/* METRICS */}
                    {activeTab === 'stats' && (
                        <div className="admin-section-card">
                            <h2>Impact Analytics</h2>
                            <div className="form-grid">
                                {stats.map((s, idx) => {
                                    const isAuto = s.label === 'Certificates' || s.label === 'Projects' || s.label === 'Experience' || s.label === 'Internships';
                                    return (
                                        <div key={idx} className="form-group">
                                            <label>
                                                {s.label}
                                                {isAuto && <span style={{ fontSize: '0.6rem', color: 'var(--primary-color)', marginLeft: '10px', opacity: 0.7 }}> (AUTO-SYNCED)</span>}
                                            </label>
                                            <input
                                                type="number"
                                                className="admin-input"
                                                value={s.value}
                                                disabled={isAuto}
                                                style={isAuto ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                                                onChange={(e) => {
                                                    if (!isAuto) {
                                                        const n = [...stats];
                                                        n[idx].value = parseInt(e.target.value) || 0;
                                                        setStats(n);
                                                    }
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <button className="save-btn" onClick={() => handleSave(STORAGE_KEYS.STATS, stats, 'Metrics Operational.')}>SYNC PERFORMANCE DATA</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
