# Landing Page

The Landing Page build is kept distinct from the Portfolio build: Vite mode `landing` emits the root app to `parallax-portfolio/dist-main`, while mode `portfolio` emits the Portfolio app to `parallax-portfolio/dist-portfolio`. The root UI currently reuses the existing `PortfolioLandingPage` component because the repository has no separate Landing Page source project. The Render and Pages assembly places those outputs at `/` and `/portfolio/`, respectively.
