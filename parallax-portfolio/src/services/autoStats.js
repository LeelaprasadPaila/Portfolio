/**
 * AutoStats Service
 * Automatically aggregates portfolio statistics from live data sources
 * instead of using hardcoded values.
 */

import { getData, STORAGE_KEYS, saveData } from '../data/dataStore';
import { getProjects, getInternships, getCertificates } from './api';

/**
 * Extract all unique technologies from projects and internships
 */
const extractAllTechnologies = (projects, internships) => {
    const techSet = new Set();

    // From projects - parse the meta field (e.g., "Python | ML" -> ["Python", "ML"])
    projects.forEach(project => {
        if (project.meta) {
            project.meta.split('|').forEach(t => {
                const trimmed = t.trim();
                if (trimmed) techSet.add(trimmed);
            });
        }
        // From project technologies array if available
        if (project.technologies && Array.isArray(project.technologies)) {
            project.technologies.forEach(t => {
                if (t) techSet.add(t.trim());
            });
        }
    });

    // From internships - technologies array
    internships.forEach(internship => {
        if (internship.technologies && Array.isArray(internship.technologies)) {
            internship.technologies.forEach(t => {
                if (t) techSet.add(t.trim());
            });
        }
    });

    return Array.from(techSet);
};

/**
 * Extract all unique domains from tech skills, projects, and internships
 */
const extractDomainsExplored = (techSkills, projects, internships) => {
    const domainSet = new Set();

    // From tech skills section titles
    techSkills.forEach(skill => {
        if (skill.title) {
            domainSet.add(skill.title);
        }
        // Also add individual skills as sub-domains
        if (skill.skills && Array.isArray(skill.skills)) {
            skill.skills.forEach(s => {
                if (s) domainSet.add(s);
            });
        }
    });

    // From project categories
    projects.forEach(project => {
        if (project.category) {
            domainSet.add(project.category);
        }
    });

    // From internship types
    internships.forEach(internship => {
        if (internship.type) {
            domainSet.add(internship.type);
        }
        if (internship.role) {
            domainSet.add(internship.role);
        }
    });

    return Array.from(domainSet);
};

/**
 * Calculate years of experience from internships/experience entries
 */
const calculateYearsOfExperience = (internships) => {
    if (!internships || internships.length === 0) return 0;

    const yearSet = new Set();
    internships.forEach(internship => {
        if (internship.duration) {
            // Extract years from duration strings like "Jan 2024 - Feb 2024" or "ongoing"
            const years = internship.duration.match(/\d{4}/g);
            if (years) {
                years.forEach(y => yearSet.add(parseInt(y)));
            }
        }
    });

    if (yearSet.size === 0) return 1;
    const sortedYears = Array.from(yearSet).sort();
    const currentYear = new Date().getFullYear();
    const maxYear = Math.max(...sortedYears, currentYear);
    const minYear = Math.min(...sortedYears);
    return Math.max(1, maxYear - minYear);
};

/**
 * Fetch GitHub stats using the public GitHub API
 */
export const fetchGitHubStats = async (username) => {
    try {
        // Fetch user data
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userData = await userRes.json();

        if (!userData || userData.message === 'Not Found') {
            console.warn(`GitHub user ${username} not found`);
            return null;
        }

        // Fetch repos to count contributions (approximate from repos)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        const repos = await reposRes.json();
        
        // Count stars from all repos
        let totalStars = 0;
        if (Array.isArray(repos)) {
            repos.forEach(repo => {
                totalStars += repo.stargazers_count || 0;
            });
        }

        // Fetch events for recent open source contributions (last 90 days)
        const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=100`);
        const events = await eventsRes.json();
        
        // Count PRs, issues, and pushes to repos not owned by user (open source)
        let openSourceCount = 0;
        if (Array.isArray(events)) {
            events.forEach(event => {
                if (event.repo && !event.repo.name.startsWith(username)) {
                    if (['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'ForkEvent'].includes(event.type)) {
                        openSourceCount++;
                    }
                }
            });
        }

        // Fetch contribution calendar data using graphql
        let totalContributions = 0;
        try {
            const contribRes = await fetch(
                `https://github.com/users/${username}/contributions`,
                { headers: { 'Accept': 'text/html' } }
            );
            const contribHtml = await contribRes.text();
            
            // Parse SVG contribution graph - count rect elements with data-level > 0
            const rectMatches = contribHtml.match(/data-level="[1-4]"/g);
            totalContributions = rectMatches ? rectMatches.length : 0;
        } catch (e) {
            console.warn('Could not fetch contribution graph, using repo count as estimate');
            // Fallback: use public repos count as a rough estimate
            totalContributions = Array.isArray(repos) ? repos.length * 15 : 0;
        }

        const gitHubData = {
            username,
            contributions: totalContributions,
            repos: userData.public_repos || 0,
            stars: totalStars,
            openSourceContributions: openSourceCount,
            lastUpdated: new Date().toISOString()
        };

        // Cache in localStorage
        saveData(STORAGE_KEYS.GITHUB, gitHubData);
        return gitHubData;

    } catch (error) {
        console.warn('GitHub API fetch failed, using cached data:', error.message);
        const cached = getData(STORAGE_KEYS.GITHUB);
        return cached;
    }
};

/**
 * Main function to compute all credibility stats automatically
 */
export const computeAutoStats = async () => {
    // Fetch live data from API with fallback to localStorage
    let projects = [];
    let internships = [];
    let certificates = [];

    try {
        const projData = await getProjects();
        projects = Array.isArray(projData) ? projData : (projData?.projects || []);
    } catch (e) {
        projects = getData(STORAGE_KEYS.PROJECTS);
    }

    try {
        const expData = await getInternships();
        internships = Array.isArray(expData) ? expData : [];
    } catch (e) {
        internships = getData(STORAGE_KEYS.INTERNSHIPS);
    }

    try {
        const certData = await getCertificates();
        certificates = Array.isArray(certData) ? certData : [];
    } catch (e) {
        certificates = getData(STORAGE_KEYS.CERTS);
    }

    const techSkills = getData(STORAGE_KEYS.TECH_SKILLS);

    // Compute all stats
    const projectCount = projects.length;
    const technologies = extractAllTechnologies(projects, internships);
    const domainsExplored = extractDomainsExplored(techSkills, projects, internships);
    const yearsOfExperience = calculateYearsOfExperience(internships);
    
    // Get certificates count
    const certificateCount = certificates.length;

    // Research papers - fetch from data store
    let researchPapers = [];
    try {
        researchPapers = getData(STORAGE_KEYS.RESEARCH);
        if (!Array.isArray(researchPapers)) researchPapers = [];
    } catch (e) {
        researchPapers = [];
    }
    const researchCount = researchPapers.length;

    // GitHub stats - try to fetch live, fall back to cached
    let gitHubData = getData(STORAGE_KEYS.GITHUB);
    try {
        const liveGitHub = await fetchGitHubStats(gitHubData.username);
        if (liveGitHub) {
            gitHubData = liveGitHub;
        }
    } catch (e) {
        console.warn('Using cached GitHub data');
    }

    return {
        projectsCompleted: {
            value: projectCount,
            label: 'Projects Completed',
            suffix: '+',
            description: 'AI/ML & backend systems delivered'
        },
        technologiesUsed: {
            value: technologies.length,
            label: 'Technologies Used',
            suffix: '+',
            description: 'Across full-stack & ML projects'
        },
        gitHubContributions: {
            value: gitHubData.contributions || 0,
            label: 'GitHub Contributions',
            suffix: '+',
            description: 'Consistent open source activity'
        },
        certifications: {
            value: certificateCount,
            label: 'Certifications',
            suffix: '+',
            description: 'Industry-recognized credentials'
        },
        researchPapers: {
            value: researchCount,
            label: 'Research Papers',
            suffix: '',
            description: 'Published research in AI/ML'
        },
        openSourceContributions: {
            value: gitHubData.openSourceContributions || 0,
            label: 'Open Source Contributions',
            suffix: '+',
            description: 'Active contributor to OSS projects'
        },
        yearsOfExperience: {
            value: yearsOfExperience,
            label: 'Years of Learning',
            suffix: '+',
            description: 'Continuous skill development'
        },
        domainsExplored: {
            value: domainsExplored.length,
            label: 'Domains Explored',
            suffix: '',
            description: 'From NLP to computer vision'
        },
        // Inclusion of GitHub data for transparency
        gitHubData,
        technologies, // full list for reference
        domainsExplored // full list for reference
    };
};

export default computeAutoStats;