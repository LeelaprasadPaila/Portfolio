import SEO from '../../components/SEO';
import socialAccounts from './socialAccounts';
import './SocialMediaPage.css';

const icons = {
    github: (
        <path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.32-3.75-1.32-.51-1.3-1.24-1.65-1.24-1.65-1.01-.7.08-.68.08-.68 1.12.08 1.72 1.15 1.72 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.54 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.07-1.15 3.07-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.31-2.61 5.25-5.1 5.53.4.35.76 1.03.76 2.08v3.1c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" />
    ),
    linkedin: (
        <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.68H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z" />
    ),
    x: (
        <path d="M18.9 2H22l-6.78 7.75L23.2 22h-6.25l-4.9-7.3L5.67 22H2.54l7.25-8.29L2.08 2h6.4l4.43 6.58L18.9 2Zm-1.1 18h1.73L7.55 3.9H5.7L17.8 20Z" />
    ),
};

function AccountIcon({ name }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {icons[name]}
        </svg>
    );
}

function SocialMediaPage() {
    return (
        <main className="social-media-page">
            <SEO />
            <div className="social-media-shell">
                <header className="social-media-header">
                    <a className="social-media-wordmark" href="/" aria-label="Leela Prasad Paila home">
                        LP<span>.</span>
                    </a>
                    <nav className="social-media-nav" aria-label="Main navigation">
                        <a href="/">Home</a>
                        <a href="/portfolio/">Portfolio <span aria-hidden="true">↗</span></a>
                    </nav>
                </header>

                <section className="social-media-intro" aria-labelledby="social-media-title">
                    <div>
                        <p className="social-media-eyebrow"><span /> Connect / Follow</p>
                        <h1 id="social-media-title">Find me<br /><em>around the web.</em></h1>
                    </div>
                    <div className="social-media-intro-aside">
                        <p>Follow along for projects, ideas, and updates on AI and engineering.</p>
                        <a href="mailto:pailaleelaprasad@gmail.com">Or send me an email <span aria-hidden="true">↗</span></a>
                    </div>
                </section>

                <section className="social-media-grid" aria-label="Social media accounts">
                    {socialAccounts.map((account, index) => (
                        <a
                            className={`social-account-card social-account-${account.id}`}
                            href={account.href}
                            key={account.id}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <div className="social-account-card-top">
                                <span className="social-account-index">0{index + 1}</span>
                                <span className="social-account-icon"><AccountIcon name={account.id} /></span>
                                <span className="social-account-arrow" aria-hidden="true">↗</span>
                            </div>
                            <div className="social-account-copy">
                                <span className="social-account-category">{account.category}</span>
                                <h2>{account.name}</h2>
                                <span className="social-account-handle">{account.handle}</span>
                                <p>{account.description}</p>
                            </div>
                            <span className="social-account-visit">Visit profile <span aria-hidden="true">→</span></span>
                        </a>
                    ))}
                </section>

                <footer className="social-media-footer">
                    <span>Leela Prasad Paila <span aria-hidden="true">·</span> AI / ML Engineer</span>
                    <a href="mailto:pailaleelaprasad@gmail.com">pailaleelaprasad@gmail.com</a>
                </footer>
            </div>
        </main>
    );
}

export default SocialMediaPage;
