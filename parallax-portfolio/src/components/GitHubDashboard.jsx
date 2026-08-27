import React, { useState, useEffect } from 'react';
import './GitHubDashboard.css';

const GitHubDashboard = ({ username = 'LeelaprasadPaila' }) => {
    const [stats, setStats] = useState({
        repos: 0,
        stars: 0,
        forks: 0,
        followers: 0,
        contributions: 0
    });
    const [languages, setLanguages] = useState([]);
    const [pinnedRepos, setPinnedRepos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulate GitHub API data (in production, replace with actual API calls)
        const fetchGitHubData = async () => {
            setIsLoading(true);
            try {
                // Simulated data - replace with actual GitHub API calls
                const mockStats = {
                    repos: 24,
                    stars: 156,
                    forks: 42,
                    followers: 89,
                    contributions: 1247
                };

                const mockLanguages = [
                    { name: 'Python', percentage: 45, color: '#3776ab' },
                    { name: 'JavaScript', percentage: 25, color: '#f7df1e' },
                    { name: 'TypeScript', percentage: 15, color: '#3178c6' },
                    { name: 'React', percentage: 10, color: '#61dafb' },
                    { name: 'Other', percentage: 5, color: '#8b5cf6' }
                ];

                const mockPinnedRepos = [
                    {
                        name: 'AI-Portfolio-Engine',
                        description: 'Dynamic portfolio framework with neural background effects',
                        language: 'TypeScript',
                        stars: 45,
                        forks: 12,
                        url: '#'
                    },
                    {
                        name: 'Recommendation-System',
                        description: 'Collaborative filtering model using Matrix Factorization',
                        language: 'Python',
                        stars: 38,
                        forks: 8,
                        url: '#'
                    },
                    {
                        name: 'Deepfake-Detection',
                        description: 'CNN-based model for identifying manipulated facial features',
                        language: 'Python',
                        stars: 32,
                        forks: 6,
                        url: '#'
                    },
                    {
                        name: 'Adventure-World',
                        description: 'Full-stack travel platform with interactive storytelling',
                        language: 'JavaScript',
                        stars: 28,
                        forks: 5,
                        url: '#'
                    }
                ];

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                setStats(mockStats);
                setLanguages(mockLanguages);
                setPinnedRepos(mockPinnedRepos);
                setError(null);
            } catch (err) {
                setError('Unable to load GitHub data. Please try again later.');
                console.error('GitHub API error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGitHubData();
    }, [username]);

    if (error) {
        return (
            <div className="github-dashboard">
                <div className="github-error">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="github-dashboard">
            <div className="github-header">
                <div className="github-profile">
                    <div className="github-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </div>
                    <div className="github-info">
                        <h3>{username}</h3>
                        <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer" className="github-link">
                            @{username}
                        </a>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="github-loading">
                    <div className="github-skeleton-grid">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="github-skeleton-card" />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="github-stats">
                        <div className="github-stat">
                            <div className="github-stat-value">{stats.repos}</div>
                            <div className="github-stat-label">Repositories</div>
                        </div>
                        <div className="github-stat">
                            <div className="github-stat-value">{stats.stars}</div>
                            <div className="github-stat-label">Stars</div>
                        </div>
                        <div className="github-stat">
                            <div className="github-stat-value">{stats.forks}</div>
                            <div className="github-stat-label">Forks</div>
                        </div>
                        <div className="github-stat">
                            <div className="github-stat-value">{stats.followers}</div>
                            <div className="github-stat-label">Followers</div>
                        </div>
                    </div>

                    <div className="github-section">
                        <h4 className="github-section-title">Most Used Languages</h4>
                        <div className="github-languages">
                            {languages.map((lang, idx) => (
                                <div key={idx} className="github-language-item">
                                    <div className="github-language-info">
                                        <span 
                                            className="github-language-dot" 
                                            style={{ backgroundColor: lang.color }}
                                        />
                                        <span className="github-language-name">{lang.name}</span>
                                    </div>
                                    <div className="github-language-bar">
                                        <div 
                                            className="github-language-fill" 
                                            style={{ 
                                                width: `${lang.percentage}%`,
                                                backgroundColor: lang.color 
                                            }}
                                        />
                                    </div>
                                    <span className="github-language-percentage">{lang.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="github-section">
                        <h4 className="github-section-title">Pinned Repositories</h4>
                        <div className="github-repos">
                            {pinnedRepos.map((repo, idx) => (
                                <a
                                    key={idx}
                                    href={repo.url}
                                    className="github-repo-card"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <div className="github-repo-header">
                                        <svg className="github-repo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                        </svg>
                                        <span className="github-repo-name">{repo.name}</span>
                                    </div>
                                    <p className="github-repo-description">{repo.description}</p>
                                    <div className="github-repo-meta">
                                        <span className="github-repo-language">
                                            <span 
                                                className="github-language-dot" 
                                                style={{ 
                                                    backgroundColor: languages.find(l => l.name === repo.language)?.color || '#8b5cf6'
                                                }}
                                            />
                                            {repo.language}
                                        </span>
                                        <span className="github-repo-stars">
                                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                            {repo.stars}
                                        </span>
                                        <span className="github-repo-forks">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                                <circle cx="12" cy="18" r="3" />
                                                <circle cx="6" cy="6" r="3" />
                                                <circle cx="18" cy="6" r="3" />
                                                <path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" />
                                                <path d="M12 12v3" />
                                            </svg>
                                            {repo.forks}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="github-section">
                        <h4 className="github-section-title">Contribution Philosophy</h4>
                        <div className="github-philosophy">
                            <p>
                                I believe in open source as a way to learn, share, and build together. 
                                My contributions focus on creating tools and libraries that solve real problems 
                                while maintaining high code quality and comprehensive documentation.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default GitHubDashboard;