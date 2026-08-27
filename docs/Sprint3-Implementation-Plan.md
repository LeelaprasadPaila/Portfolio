# Sprint 3 Implementation Plan

## Current State Analysis
- React app with React Router v6
- Dark theme with existing design system (CSS variables)
- Components: Hero, Navbar, FeaturedProjects, About, Projects, Contact, Certificates, Internships, Skills
- Pages: HomePage, AboutPage, ProjectsPage, CertificatesPage, InternshipsPage, SkillsPage, ContactPage, AdminPage
- Data layer: dataStore.js with localStorage + API fallback

## Files to Create

### New Pages (7)
1. `src/pages/ProjectDetail.jsx` - Individual project case study
2. `src/pages/ExperiencePage.jsx` - Dedicated experience page
3. `src/pages/ResumePage.jsx` - Premium online resume
4. `src/pages/CertificationsPage.jsx` - Enhanced certifications with filter/search
5. `src/pages/TravelPage.jsx` - Redesigned travel storytelling
6. `src/pages/ContactPage.jsx` - Redesigned contact experience

### New Components (3)
7. `src/components/ProjectCaseStudy.jsx` - Case study detail component
8. `src/components/ScrollReveal.jsx` - Scroll animation wrapper
9. `src/components/FilterBar.jsx` - Reusable filter/search component

### New Styles (10)
10. `src/styles/ProjectDetail.css`
11. `src/styles/ExperiencePage.css`
12. `src/styles/ResumePage.css`
13. `src/styles/CertificationsPage.css`
14. `src/styles/TravelPage.css`
15. `src/styles/ContactPage.css`
16. `src/styles/sprint3-animations.css`
17. `src/styles/scroll-reveal.css`
18. `src/styles/filter-bar.css`
19. `src/styles/print.css`

### Updated Files (5)
20. `src/App.jsx` - Add new routes
21. `src/components/Navbar.jsx` - Add nav items
22. `src/components/PremiumFooter.jsx` - Add footer links
23. `src/styles/design-system.css` - Add new design tokens
24. `src/data/dataStore.js` - Add enhanced project data

## Implementation Order
1. First: Design system enhancements + new styles
2. Second: Enhanced data with case study structure
3. Third: Components (ScrollReveal, FilterBar, ProjectCaseStudy)
4. Fourth: New pages (ProjectDetail, Experience, Resume, Certifications, Travel, Contact)
5. Fifth: Update existing files (App.jsx, Navbar, Footer, dataStore)
6. Sixth: Animations and polish
7. Seventh: Test all routes and interactions