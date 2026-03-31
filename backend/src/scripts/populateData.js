#!/usr/bin/env node

/**
 * Populate Database with Initial Data
 * Run: node backend/src/scripts/populateData.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bio from '../models/Bio.js';
import Certificate from '../models/Certificate.js';
import Project from '../models/Project.js';
import Internship from '../models/Internship.js';
import Skill from '../models/Skill.js';

dotenv.config();

// Initial data (copied from frontend data files)
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

const initialTechSkills = [
    {
        category: "Programming & Core Engineering",
        title: "Programming & Core Engineering",
        icon: "fas fa-code-branch",
        skills: ["Python Programming", "Problem-Solving", "Scripting", "OOP"]
    },
    {
        category: "Machine Learning & AI",
        title: "Machine Learning & AI",
        icon: "fas fa-brain",
        skills: ["Supervised Learning", "Feature Engineering", "Recommendation Systems", "Computer Vision"]
    },
    {
        category: "Generative AI",
        title: "Generative AI",
        icon: "fas fa-robot",
        skills: ["Prompt Engineering", "LLM Automation", "AI Agents", "Context Logic"]
    },
    {
        category: "Backend (Python)",
        title: "Backend (Python)",
        icon: "fas fa-server",
        skills: ["Flask/Django", "REST APIs", "Database Design", "Authentication"]
    },
    {
        category: "Frontend Development",
        title: "Frontend Development",
        icon: "fas fa-desktop",
        skills: ["React/Next.js", "CSS Frameworks", "Responsive Design", "UI/UX"]
    },
    {
        category: "Data Science & Analytics",
        title: "Data Science & Analytics",
        icon: "fas fa-chart-line",
        skills: ["Pandas/NumPy", "Data Visualization", "Statistical Analysis", "Big Data"]
    }
];

const certificatesData = [
    { id: 1, priority: true, category: "Education", title: "AI & ML BY APSCHE", provider: "APSCHE", date: "2024", image: "images/certificates/APSCHE_AI_ML.jpg", verifyUrl: "#", details: "Artificial Intelligence and Machine Learning specialization." },
    { id: 2, priority: true, category: "Education", title: "AWS Skill Builder", provider: "AWS", date: "2024", image: "images/certificates/AWS_Generative_AI.jpg", verifyUrl: "#", details: "Cloud fundamentals and AWS services." },
    { id: 3, priority: true, category: "Education", title: "Advanced Google Analytics", provider: "Google", date: "2021", image: "images/certificates/Google_Advanced_Analytics.jpg", verifyUrl: "#", details: "Data analysis and tracking expertise." },
    { id: 4, priority: true, category: "Education", title: "HackerRank Python", provider: "HackerRank", date: "2021", image: "images/certificates/HackerRank_Python_Basic.jpg", verifyUrl: "#", details: "Python programming proficiency." },
    { id: 5, priority: true, category: "Education", title: "NxtWave Tech", provider: "NxtWave", date: "2023", image: "images/certificates/NxtWave_4.0_Tech_Bootcamp.jpg", verifyUrl: "#", details: "Full-stack development training." },
    { id: 6, priority: true, category: "Education", title: "Sololearn Python Data Science", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Python_DataScience.jpg", verifyUrl: "#", details: "Data Science applications using Python." },
    { id: 7, priority: true, category: "Education", title: "Web Dev Bolt IoT", provider: "Bolt IoT", date: "2022", image: "images/certificates/Bolt_IoT_Web_Dev.jpg", verifyUrl: "#", details: "Web technologies and IoT integration." },
    { id: 8, priority: true, category: "Sports & Others", title: "Kung-Fu & Karate", provider: "Martial Arts", date: "2013", image: "images/certificates/Kung-Fu_Karate_Championship.jpg", verifyUrl: "#", details: "Martial arts belt certification." },
    { id: 9, priority: true, category: "Sports & Others", title: "Nss Freefire", provider: "NSS", date: "2022", image: "images/certificates/NSS_Technovation_FreeFire.jpg", verifyUrl: "#", details: "Participation in NSS competitive events." },
    { id: 10, priority: false, category: "Education", title: "Bharat Intern", provider: "Bharat Intern", date: "2023", image: "images/certificates/BharatIntern_ML.jpg", verifyUrl: "#", details: "Virtual internship completion." },
    { id: 11, priority: false, category: "Education", title: "Brain O Vision", provider: "Brain O Vision", date: "2022", image: "images/certificates/Brain_O_Vision_MERN_Workshop.jpg", verifyUrl: "#", details: "Technical workshop participation." },
    { id: 12, priority: false, category: "Education", title: "Cyber Security", provider: "Great Learning", date: "2022", image: "images/certificates/Great_Learning_Cyber_Security.jpg", verifyUrl: "#", details: "Fundamental cyber security concepts." },
    { id: 13, priority: false, category: "Education", title: "Digital Marketing", provider: "Google", date: "2021", image: "images/certificates/Google_Digital_Marketing.jpg", verifyUrl: "#", details: "Digital marketing fundamentals and strategy." },
    { id: 14, priority: false, category: "Education", title: "Generative AI", provider: "OutSkill", date: "2024", image: "images/certificates/Outskill_Generative_AI.jpg", verifyUrl: "#", details: "Foundations of Large Language Models." },
    { id: 15, priority: false, category: "Education", title: "Oasis Infobytes", provider: "Oasis Infobytes", date: "2023", image: "images/certificates/Oasis_Infobyte_Web_Dev.jpg", verifyUrl: "#", details: "Web development project work." },
    { id: 16, priority: false, category: "Education", title: "Sololearn C#", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_CSharp.jpg", verifyUrl: "#", details: "C# language proficiency." },
    { id: 17, priority: false, category: "Education", title: "Sololearn C", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_C.jpg", verifyUrl: "#", details: "C programming core skills." },
    { id: 18, priority: false, category: "Education", title: "Sololearn HTML", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_HTML.jpg", verifyUrl: "#", details: "Web structures and markup." },
    { id: 19, priority: false, category: "Education", title: "Sololearn Java", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Java.jpg", verifyUrl: "#", details: "Java programming and OOP." },
    { id: 20, priority: false, category: "Education", title: "Sololearn for Marketers", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Marketers.jpg", verifyUrl: "#", details: "Tech for marketing professionals." },
    { id: 21, priority: false, category: "Education", title: "Sololearn Python Beginners", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Python_Beginners.jpg", verifyUrl: "#", details: "Introductory Python skills." },
    { id: 22, priority: false, category: "Education", title: "Sololearn Python Core", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Python_Core.jpg", verifyUrl: "#", details: "Core Python logic and syntax." },
    { id: 23, priority: false, category: "Education", title: "Sololearn Python Data Structures", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Python_DataStructures.jpg", verifyUrl: "#", details: "Data structures in Python." },
    { id: 24, priority: false, category: "Education", title: "Sololearn Python Finance", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Python_Finance.jpg", verifyUrl: "#", details: "Financial data handling with Python." },
    { id: 25, priority: false, category: "Education", title: "Sololearn Python Intermediate", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Python_Intermediate.jpg", verifyUrl: "#", details: "Functional and object oriented Python." },
    { id: 26, priority: false, category: "Education", title: "Sololearn SQL", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_SQL.jpg", verifyUrl: "#", details: "Database querying fundamentals." },
    { id: 27, priority: false, category: "Education", title: "Sololearn Web Design", provider: "Sololearn", date: "2021", image: "images/certificates/SoloLearn_Web_Design.jpg", verifyUrl: "#", details: "Modern web design principles." },
    { id: 28, priority: false, category: "Education", title: "SriBalaji C", provider: "Sri Balaji", date: "2023", image: "images/certificates/SriBalaji_C.jpg", verifyUrl: "#", details: "C language certification." },
    { id: 29, priority: false, category: "Education", title: "SriBalaji Java", provider: "Sri Balaji", date: "2023", image: "images/certificates/SriBalaji_Java.jpg", verifyUrl: "#", details: "Java language certification." },
    { id: 30, priority: false, category: "Education", title: "SriBalaji MS Office", provider: "Sri Balaji", date: "2023", image: "images/certificates/SriBalaji_MS_Office.jpg", verifyUrl: "#", details: "MS Office productivity tools." },
    { id: 31, priority: false, category: "Education", title: "SriBalaji Python", provider: "Sri Balaji", date: "2023", image: "images/certificates/SriBalaji_Python.jpg", verifyUrl: "#", details: "Python language certification." },
    { id: 32, priority: false, category: "Education", title: "TCS iON", provider: "TCS", date: "2023", image: "images/certificates/TCS_iON_Presentation_Skills.jpg", verifyUrl: "#", details: "Industry readiness program." },
    { id: 33, priority: false, category: "Education", title: "BlackBucks", provider: "BlackBucks", date: "2023", image: "images/certificates/Blackbucks_Logistics_Portal.jpg", verifyUrl: "#", details: "Technical training certification." },
    { id: 34, priority: false, category: "Sports & Others", title: "Essay Writing", provider: "PSCMR", date: "2024", image: "images/certificates/PSCMRCET_Essay_Writing.jpg", verifyUrl: "#", details: "Academic writing competition." },
    { id: 35, priority: false, category: "Sports & Others", title: "NASA Quiz", provider: "NASA", date: "2024", image: "images/certificates/ISRO_Space_Day_Quiz.jpg", verifyUrl: "#", details: "Science and space knowledge quiz." },
    { id: 36, priority: false, category: "Sports & Others", title: "National Level Quiz", provider: "National", date: "2024", image: "images/certificates/KITS_English_Quiz.jpg", verifyUrl: "#", details: "General knowledge competition." },
    { id: 37, priority: false, category: "Sports & Others", title: "Red Cross", provider: "Red Cross", date: "2021", image: "images/certificates/Red_Cross_Appreciation.jpg", verifyUrl: "#", details: "Social service certification." },
    { id: 38, priority: false, category: "Sports & Others", title: "Rotaract", provider: "Rotaract", date: "2023", image: "images/certificates/Rotaract_Appreciation.jpg", verifyUrl: "#", details: "Leadership and social service." },
    { id: 39, priority: false, category: "Sports & Others", title: "Supraja Workshop", provider: "Supraja", date: "2022", image: "images/certificates/Supraja_Ethical_Hacking_Workshop.jpg", verifyUrl: "#", details: "Technical workshop completion." },
    { id: 40, priority: false, category: "Sports & Others", title: "Supraja Cert", provider: "Supraja", date: "2022", image: "images/certificates/Supraja_Ethical_Hacking_Internship.jpg", verifyUrl: "#", details: "Advanced certification." }
];

async function populateDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ MongoDB connected');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await Bio.deleteMany({});
    await Certificate.deleteMany({});
    await Project.deleteMany({});
    await Internship.deleteMany({});
    await Skill.deleteMany({});

    // Insert Bio
    console.log('Inserting bio data...');
    const bio = new Bio(initialBio);
    await bio.save();
    console.log('✓ Bio data inserted');

    // Insert Projects
    console.log('Inserting projects...');
    await Project.insertMany(initialProjects);
    console.log('✓ Projects inserted');

    // Insert Internships
    console.log('Inserting internships...');
    await Internship.insertMany(initialInternships);
    console.log('✓ Internships inserted');

    // Insert Skills
    console.log('Inserting skills...');
    await Skill.insertMany(initialTechSkills);
    console.log('✓ Skills inserted');

    // Insert Certificates (mapped to model fields)
    console.log('Inserting certificates...');
    const mappedCertificates = certificatesData.map(cert => ({
      title: cert.title,
      category: cert.category,
      description: cert.details,
      image: cert.image,
      issuer: cert.provider,
      issueDate: cert.date,
      priority: cert.priority
    }));
    await Certificate.insertMany(mappedCertificates);
    console.log('✓ Certificates inserted');

    console.log('\n🎉 Database populated successfully!');
    console.log('You can now start the backend server and access your data via the API.');

    process.exit(0);

  } catch (error) {
    console.error('✗ Error populating database:', error.message);
    process.exit(1);
  }
}

populateDatabase();