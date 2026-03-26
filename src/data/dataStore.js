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
    INTERNSHIPS: 'portfolio_internships_data'
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
    freelance: "Available"
};

const initialProjects = [
    {
        category: "Machine Learning & AI",
        title: "Recommendation System",
        desc: "Collaborative filtering model using Matrix Factorization to predict user preferences with high precision.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Python | ML",
        priority: true
    },
    {
        category: "Machine Learning & AI",
        title: "Deepfake Detection",
        desc: "CNN-based model to identify manipulated facial features in video content using multiple frame analysis.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "PyTorch | CV",
        priority: true
    },
    {
        category: "Machine Learning & AI",
        title: "NLP Chatbot",
        desc: "Transformer-based conversational agent with context-aware responses and sentiment analysis integration.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "TensorFlow | NLP",
        priority: true
    },
    {
        category: "Machine Learning & AI",
        title: "Face Emotion Recognition",
        desc: "Real-time emotion detection system using deep learning to classify human expressions.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Keras | CNN",
        priority: false
    },
    {
        category: "Machine Learning & AI",
        title: "Stock Price Predictor",
        desc: "LSTM-based neural network for forecasting stock market trends with historical data analysis.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Python | LSTM",
        priority: false
    },
    {
        category: "Machine Learning & AI",
        title: "Object Segmentation",
        desc: "Advanced image processing using Mask R-CNN for precise pixel-level object classification.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "PyTorch | Segmentation",
        priority: false
    },
    {
        category: "Web Development & Automation",
        title: "Adventure World",
        desc: "Full-stack travel platform featuring interactive storytelling and smooth motion-based animations.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "React | Node.js",
        priority: true
    },
    {
        category: "Web Development & Automation",
        title: "AI Portfolio Engine",
        desc: "Dynamic portfolio framework with automated data synchronization and neural background effects.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Next.js | Three.js",
        priority: true
    },
    {
        category: "Web Development & Automation",
        title: "Smart Home Dashboard",
        desc: "IoT control center for managing smart energy devices with real-time analytics visualization.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "React | Socket.io",
        priority: false
    },
    {
        category: "Web Development & Automation",
        title: "DevOps Pipeline",
        desc: "Automated CI/CD workflows for multi-cloud deployment using GitHub Actions and Docker.",
        image: "images/projects/project-3-thumb.png",
        link: "#",
        meta: "Docker | Terraform",
        priority: false
    },
    {
        category: "Data Science & Analytics",
        title: "Marketing Insights Hub",
        desc: "Big data platform for analyzing consumer behavior and visualizing complex market trends.",
        image: "images/projects/project-1-thumb.png",
        link: "#",
        meta: "Pandas | Tableau",
        priority: true
    },
    {
        category: "Data Science & Analytics",
        title: "Healthcare Analytics",
        desc: "Predictive modeling for patient outcomes utilizing large-scale clinical dataset processing.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        meta: "Python | Scikit-learn",
        priority: false
    }
];

// Internships & Experiments data structure
const initialInternships = [
    {
        type: "Internship",
        company: "Bharat Intern",
        role: "Machine Learning Intern",
        duration: "Jan 2024 - Feb 2024",
        desc: "Specialized in Python-based ML models. Developed predictive algorithms and analyzed data trends using scikit-learn and pandas.",
        image: "images/certificates/BharatIntern.jpg",
        link: "#",
        priority: true
    },
    {
        type: "Internship",
        company: "Oasis Infobytes",
        role: "Web Development Intern",
        duration: "Dec 2023 - Jan 2024",
        desc: "Full-stack development focus. Implemented responsive UI components and optimized backend logic for web applications.",
        image: "images/certificates/OasisIfobytes.jpg",
        link: "#",
        priority: true
    },
    {
        type: "Experience",
        company: "Personal Lab",
        role: "AI Experimenter",
        duration: "ongoing",
        desc: "Researching on custom Transformer architectures and exploring LLM fine-tuning techniques for specialized tasks.",
        image: "images/projects/project-2-thumb.png",
        link: "#",
        priority: false
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

const CURRENT_VERSION = '3.2';

export const getData = (key) => {
    const version = localStorage.getItem('portfolio_data_version');

    // Global version migration
    if (version !== CURRENT_VERSION) {
        localStorage.setItem('portfolio_data_version', CURRENT_VERSION);
        // Force reset structured data to pick up new schema/categories
        localStorage.removeItem(STORAGE_KEYS.CERTS);
        localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        localStorage.removeItem(STORAGE_KEYS.TECH_SKILLS);
        localStorage.removeItem(STORAGE_KEYS.STATS);
        localStorage.removeItem(STORAGE_KEYS.INTERNSHIPS);
        window.location.reload();
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
            [STORAGE_KEYS.INTERNSHIPS]: initialInternships
        };
        return map[key];
    }
    return JSON.parse(data);
};

export const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export { STORAGE_KEYS };
