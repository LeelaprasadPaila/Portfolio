import { certificatesData as initialCerts } from './certificatesData';

const STORAGE_KEYS = {
    BIO: 'portfolio_bio_data',
    CERTS: 'portfolio_certs_data_v2',
    SKILLS: 'portfolio_skills_data',
    INTERESTS: 'portfolio_interests_data',
    TESTIMONIALS: 'portfolio_testimonials_data',
    STATS: 'portfolio_stats_data',
    TECH_SKILLS: 'portfolio_tech_skills_data',
    PROJECTS: 'portfolio_projects_data',
    INTERNSHIPS: 'portfolio_internships_data',
    RESEARCH: 'portfolio_research_data',
    GITHUB: 'portfolio_github_data'
};

const initialBio = {
    title: "AI Native Engineer",
    intro: "I am an AI Native Engineer dedicated to pioneering the next generation of intelligent systems. By mastering 'Vibe Coding' and AI Agentic workflows, I bridge the gap between high-level architectural intent and machine execution. My focus is on building autonomous, context-aware applications that push the boundaries of Deep Learning and AI Agency.",
    birthday: "22 October 2002",
    phone: "+91 9700651322",
    city: "Vijayawada, Andhra Pradesh",
    age: "21",
    degree: "B.tech CSE(AI & ML)",
    email: "pailaleelaprasad@gmail.com",
    freelance: "Available",
    profileImage: "/images/Portfolio_image.png"
};

const initialProjects = [
    {
        category: "Machine Learning & AI",
        title: "Recommendation System",
        desc: "Collaborative filtering model using Matrix Factorization to predict user preferences with high precision.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Python | ML",
        priority: true,
        technologies: ["Python", "scikit-learn", "NumPy"]
    },
    {
        category: "Machine Learning & AI",
        title: "Deepfake Detection",
        desc: "CNN-based model to identify manipulated facial features in video content using multiple frame analysis.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "PyTorch | CV",
        priority: true,
        technologies: ["PyTorch", "OpenCV", "Python"]
    },
    {
        category: "Machine Learning & AI",
        title: "NLP Chatbot",
        desc: "Transformer-based conversational agent with context-aware responses and sentiment analysis integration.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "TensorFlow | NLP",
        priority: true,
        technologies: ["TensorFlow", "NLP", "Python"]
    },
    {
        category: "Machine Learning & AI",
        title: "Face Emotion Recognition",
        desc: "Real-time emotion detection system using deep learning to classify human expressions.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Keras | CNN",
        priority: false,
        technologies: ["Keras", "CNN", "Python"]
    },
    {
        category: "Machine Learning & AI",
        title: "Stock Price Predictor",
        desc: "LSTM-based neural network for forecasting stock market trends with historical data analysis.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Python | LSTM",
        priority: false,
        technologies: ["Python", "LSTM", "Pandas"]
    },
    {
        category: "Machine Learning & AI",
        title: "Object Segmentation",
        desc: "Advanced image processing using Mask R-CNN for precise pixel-level object classification.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "PyTorch | Segmentation",
        priority: false,
        technologies: ["PyTorch", "Segmentation", "Python"]
    },
    {
        category: "Web Development & Automation",
        title: "Adventure World",
        desc: "Full-stack travel platform featuring interactive storytelling and smooth motion-based animations.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "React | Node.js",
        priority: true,
        technologies: ["React", "Node.js", "JavaScript"]
    },
    {
        category: "Web Development & Automation",
        title: "AI Portfolio Engine",
        desc: "Dynamic portfolio framework with automated data synchronization and neural background effects.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Next.js | Three.js",
        priority: true,
        technologies: ["Next.js", "Three.js", "React"]
    },
    {
        category: "Web Development & Automation",
        title: "Smart Home Dashboard",
        desc: "IoT control center for managing smart energy devices with real-time analytics visualization.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "React | Socket.io",
        priority: false,
        technologies: ["React", "Socket.io", "Node.js"]
    },
    {
        category: "Web Development & Automation",
        title: "DevOps Pipeline",
        desc: "Automated CI/CD workflows for multi-cloud deployment using GitHub Actions and Docker.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Docker | Terraform",
        priority: false,
        technologies: ["Docker", "Terraform", "GitHub Actions"]
    },
    {
        category: "Data Science & Analytics",
        title: "Marketing Insights Hub",
        desc: "Big data platform for analyzing consumer behavior and visualizing complex market trends.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pandas | Tableau",
        priority: true,
        technologies: ["Pandas", "Tableau", "Python"]
    },
    {
        category: "Data Science & Analytics",
        title: "Healthcare Analytics",
        desc: "Predictive modeling for patient outcomes utilizing large-scale clinical dataset processing.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Python | Scikit-learn",
        priority: false,
        technologies: ["Python", "scikit-learn", "Pandas"]
    },
    {
        category: "Portfolio Updates",
        title: "# NeuroDVT",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# OTP-BYPASS",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# work-report-generator",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Currency_conversion_in_Java",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Asset-Managment-System",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Online-Fee-Payment_System",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# FilePulse-Pro",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Data_Size_Unit_Converter_in_C",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Email-Generator-Pro",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Indian-Hackers",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# LeelaprasadPaila",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# General_store-website_2",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Portfolio",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Home-security",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# recipe-api",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# LeelaPrasad_Portfolio",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# 20KT1A4238--PAILA-LEELA-PRASAD",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# CGV",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Portfolio-Website-Oasis",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Task3-OASIS-",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# House_Price_Prediction",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Wine_Quality_Prediction",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Iris_Flowers_Classification",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# Adventure_World_Website-Angular",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    },
    {
        category: "Portfolio Updates",
        title: "# hotel-booking-system",
        desc: "Project placeholder. Update this project once the details are ready.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pending update",
        priority: false,
        technologies: ["Pending"]
    }
];

// Internships & Experiments data structure
const initialInternships = [
    {
        type: "Experience",
        company: "A2Z Company",
        role: "AI/ML Engineer",
        duration: "2024 - Present",
        desc: "Working across AI-driven product development, scalable backend systems, and intelligent workflow automation for real-world business impact.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        priority: true,
        technologies: ["Python", "FastAPI", "React", "LLMs", "MLOps"],
        achievements: ["Delivered AI-enabled product workflows", "Built scalable backend services", "Improved automation and user engagement"]
    },
    {
        type: "Internship",
        company: "Bharat Intern",
        role: "Machine Learning Intern",
        duration: "Jan 2024 - Feb 2024",
        desc: "Specialized in Python-based ML models. Developed predictive algorithms and analyzed data trends using scikit-learn and pandas.",
        image: "images/certificates/BharatIntern.jpg",
        link: "#",
        priority: true,
        technologies: ["Python", "scikit-learn", "Pandas", "NumPy"],
        achievements: ["Developed 3 predictive models with 85%+ accuracy", "Processed and cleaned 10K+ data records", "Automated data preprocessing pipeline"]
    },
    {
        type: "Internship",
        company: "Oasis Infobytes",
        role: "Web Development Intern",
        duration: "Dec 2023 - Jan 2024",
        desc: "Full-stack development focus. Implemented responsive UI components and optimized backend logic for web applications.",
        image: "images/certificates/OasisIfobytes.jpg",
        link: "#",
        priority: true,
        technologies: ["React", "Node.js", "CSS", "JavaScript"],
        achievements: ["Built 5+ responsive UI components", "Reduced page load time by 40%", "Integrated RESTful APIs with frontend"]
    },
    {
        type: "Experience",
        company: "Business Analyst",
        role: "Business Analyst",
        duration: "2024 - Present",
        desc: "Translating business needs into technical requirements, analyzing workflows, and supporting decision-making through data-driven process evaluation and solution planning.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        priority: false,
        technologies: ["Business Analysis", "Requirements Gathering", "Process Mapping", "Data-Driven Decisions"],
        achievements: ["Defined requirements for technical initiatives", "Improved process clarity and alignment across teams", "Supported solution planning with actionable insights"]
    }
];

const initialSkills = [
    { name: "Python", level: 80 },
    { name: "Java", level: 80 },
    { name: "C language", level: 80 },
    { name: "HTML", level: 100 },
    { name: "CSS", level: 90 },
    { name: "JavaScript", level: 75 },
    { name: "PHP", level: 80 }
];

const initialTechSkills = [
    {
        title: "Programming & Core Engineering",
        icon: "fas fa-code-branch",
        skills: ["Python Programming", "Problem-Solving", "Scripting", "OOP"]
    },
    {
        title: "Machine Learning & AI",
        icon: "fas fa-brain",
        skills: ["Supervised Learning", "Feature Engineering", "Recommendation Systems", "Computer Vision"]
    },
    {
        title: "Generative AI",
        icon: "fas fa-robot",
        skills: ["Prompt Engineering", "LLM Automation", "AI Agents", "Context Logic"]
    },
    {
        title: "Backend (Python)",
        icon: "fas fa-server",
        skills: ["Flask & FastAPI", "Auth & Roles", "ML API Deployment", "Optimization"]
    },
    {
        title: "Databases",
        icon: "fas fa-database",
        skills: ["MySQL/Postgres", "Pandas & NumPy", "Schema Design", "Query Optimization"]
    },
    {
        title: "Web Development",
        icon: "fas fa-globe",
        skills: ["HTML5, CSS3, ES6", "Admin Dashboards", "Modern Architecture", "Interactive UI"]
    }
];

const initialInterests = [
    "Data Science", "Machine Learning", "Git/Github", "Software Engineer",
    "Open Source", "Photography", "Open world Games", "Chess"
];

const initialTestimonials = [
    {
        text: "Leelaprasad consistently delivers exceptional results with their innovative approach and attention to detail.",
        author: "Ravi Kiran",
        role: "Data Science Enthusiast"
    },
    {
        text: "Leelaprasad's creative solutions and strong work ethic have been invaluable to our team's success.",
        author: "Sonu Sandeep",
        role: "Blockchain Enthusiast"
    },
    {
        text: "Leela's creativity and dedication have significantly enhanced our projects' success. They are a true professional.",
        author: "Amala",
        role: "Freelancer"
    }
];

const initialStats = [
    { label: "Certificates", value: initialCerts.length },
    { label: "Projects", value: initialProjects.length },
    { label: "Internships", value: initialInternships.filter(i => i.type === 'Internship').length },
    { label: "Experience", value: initialInternships.filter(i => i.type === 'Experience').length }
];

const initialResearch = [];

const initialGitHubData = {
    username: "LeelaprasadPaila",
    contributions: 0,
    repos: 0,
    stars: 0,
    openSourceContributions: 0,
    lastUpdated: null
};

const CURRENT_VERSION = '3.4';

export const getData = (key) => {
    const version = localStorage.getItem('portfolio_data_version');

    // Global version migration - only migrate once per version, no reload
    if (version !== CURRENT_VERSION) {
        localStorage.setItem('portfolio_data_version', CURRENT_VERSION);
        // Only reset if upgrading from an older version to pick up schema changes
        if (version && version < CURRENT_VERSION) {
            localStorage.removeItem(STORAGE_KEYS.CERTS);
            localStorage.removeItem(STORAGE_KEYS.PROJECTS);
            localStorage.removeItem(STORAGE_KEYS.TECH_SKILLS);
            localStorage.removeItem(STORAGE_KEYS.STATS);
            localStorage.removeItem(STORAGE_KEYS.INTERNSHIPS);
            localStorage.removeItem(STORAGE_KEYS.RESEARCH);
            localStorage.removeItem(STORAGE_KEYS.GITHUB);
        }
    }

    let data = localStorage.getItem(key);

    if (!data) {
        if (key === STORAGE_KEYS.BIO) saveData(key, initialBio);
        if (key === STORAGE_KEYS.CERTS) saveData(key, initialCerts);
        if (key === STORAGE_KEYS.PROJECTS) saveData(key, initialProjects);
        if (key === STORAGE_KEYS.SKILLS) saveData(key, initialSkills);
        if (key === STORAGE_KEYS.TECH_SKILLS) saveData(key, initialTechSkills);
        if (key === STORAGE_KEYS.INTERESTS) saveData(key, initialInterests);
        if (key === STORAGE_KEYS.TESTIMONIALS) saveData(key, initialTestimonials);
        if (key === STORAGE_KEYS.STATS) saveData(key, initialStats);
        if (key === STORAGE_KEYS.INTERNSHIPS) saveData(key, initialInternships);
        if (key === STORAGE_KEYS.RESEARCH) saveData(key, initialResearch);
        if (key === STORAGE_KEYS.GITHUB) saveData(key, initialGitHubData);

        const map = {
            [STORAGE_KEYS.BIO]: initialBio,
            [STORAGE_KEYS.CERTS]: initialCerts,
            [STORAGE_KEYS.PROJECTS]: initialProjects,
            [STORAGE_KEYS.SKILLS]: initialSkills,
            [STORAGE_KEYS.TECH_SKILLS]: initialTechSkills,
            [STORAGE_KEYS.INTERESTS]: initialInterests,
            [STORAGE_KEYS.TESTIMONIALS]: initialTestimonials,
            [STORAGE_KEYS.STATS]: [
                { label: "Certificates", value: initialCerts.length },
                { label: "Projects", value: initialProjects.length },
                { label: "Internships", value: initialInternships.filter(i => i.type === 'Internship').length },
                { label: "Experience", value: initialInternships.filter(i => i.type === 'Experience').length }
            ],
            [STORAGE_KEYS.INTERNSHIPS]: initialInternships,
            [STORAGE_KEYS.RESEARCH]: initialResearch,
            [STORAGE_KEYS.GITHUB]: initialGitHubData
        };
        return map[key];
    }
    return JSON.parse(data);
};

export const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export { STORAGE_KEYS };
export { initialTechSkills, initialProjects, initialInternships, initialCerts, initialBio, initialResearch, initialGitHubData };