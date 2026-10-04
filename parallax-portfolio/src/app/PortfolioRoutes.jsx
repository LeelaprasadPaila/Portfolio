import { Navigate, Route, Routes } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';
import AdminPage from '../pages/AdminPage';
import CertificationsPage from '../pages/CertificationsPage';
import ContactPage from '../pages/ContactPage';
import ExperiencePage from '../pages/ExperiencePage';
import HomePage from '../pages/HomePage';
import InternshipsPage from '../pages/InternshipsPage';
import Layout from '../pages/Layout';
import NotFoundPage from '../pages/NotFoundPage';
import PortfolioLandingPage from '../pages/PortfolioLandingPage';
import ProjectDetail from '../pages/ProjectDetail';
import ProjectsPage from '../pages/ProjectsPage';
import ResearchPapersPage from '../pages/ResearchPapersPage';
import ResumePage from '../pages/ResumePage';
import SkillsPage from '../pages/SkillsPage';

export default function PortfolioRoutes({ isPortfolioBuild }) {
    if (!isPortfolioBuild) {
        return (
            <Routes>
                <Route path="/" element={<PortfolioLandingPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="home" element={<Navigate to="/" replace />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="project/:projectTitle" element={<ProjectDetail />} />
                <Route path="experience" element={<ExperiencePage />} />
                <Route path="resume" element={<ResumePage />} />
                <Route path="certificates" element={<CertificationsPage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="admin" element={<AdminPage />} />
                <Route path="research" element={<ResearchPapersPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
