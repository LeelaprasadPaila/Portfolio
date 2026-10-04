import { assetUrl } from '../config/env';

const portfolioPath = (path) => `/portfolio${path === '/' ? '/' : `/${String(path).replace(/^\/+/, '')}`}`;

const navigation = [
    { label: 'Blogs', path: '/' },
    { label: 'Portfolio', path: '' },
    { label: 'Social Media', path: '/about' },
    { label: 'Priligramage', path: '/projects' },
    { label: 'Adventures', path: '/experience' }
];

const PortfolioLandingPage = () => {
    return (
        <div className="portfolio-landing">
            <aside className="portfolio-sidebar">
                <div className="portfolio-profile">
                    <div className="portfolio-avatar-wrap">
                        <img
                            className="portfolio-avatar"
                            src={assetUrl('images/Portfolio_image.png')}
                            alt="Leela Prasad Paila"
                        />
                    </div>
                    <p className="portfolio-kicker">AI / ML ENGINEER</p>
                    <h1>Leela Prasad<br />Paila</h1>
                    <p className="portfolio-location">Vijayawada, India</p>
                </div>

                <nav className="portfolio-nav" aria-label="Portfolio navigation">
                    {navigation.map((item, index) => (
                        <button
                            className={`portfolio-nav-link ${index === 0 ? 'is-active' : ''}`}
                            key={item.path}
                            onClick={() => window.location.assign(item.path === '/' ? '/' : portfolioPath(item.path))}
                        >
                            <span className="portfolio-nav-index">0{index + 1}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="portfolio-sidebar-foot">
                    <span>Available for thoughtful work</span>
                    <a href="mailto:pailaleelaprasad@gmail.com">pailaleelaprasad@gmail.com</a>
                </div>
            </aside>

            <main className="portfolio-landing-main">
                <header className="portfolio-mobile-header">
                    <span>LP / PORTFOLIO</span>
                    <button onClick={() => window.location.assign(portfolioPath('/contact'))} aria-label="Open contact page">Let's talk <span aria-hidden="true">↗</span></button>
                </header>

                <section className="portfolio-hero" aria-labelledby="portfolio-hero-title">
                    <div className="portfolio-hero-copy">
                        <p className="portfolio-eyebrow"><span /> Independent engineer · 2026</p>
                        <h2 id="portfolio-hero-title">I build<br /><em>intelligent</em><br />things.</h2>
                        <p className="portfolio-hero-summary">
                            AI-native systems, clear interfaces, and reliable backend architecture for people solving meaningful problems.
                        </p>
                        <div className="portfolio-hero-actions">
                            <a className="portfolio-primary-action" href={portfolioPath('/home')}>
                                Open full portfolio <span aria-hidden="true">↗</span>
                            </a>
                            <button className="portfolio-text-action" onClick={() => window.location.assign(portfolioPath('/projects'))}>
                                View selected work <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>

                    <div className="portfolio-portrait-panel">
                        <img src={assetUrl('images/Portfolio_image.png')} alt="Leela Prasad Paila, AI Native Engineer" />
                        <span className="portfolio-portrait-caption">Curious by default.<br />Precise by practice.</span>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default PortfolioLandingPage;
