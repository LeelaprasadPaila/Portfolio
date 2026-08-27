/**
 * Leela Prasad's Core Knowledge (100% from portfolio source data)
 * Data sourced from: dataStore.js, certificatesData.js, About.jsx
 */

export const personalIdentity = {
  name: 'Leela Prasad Paila',
  fullName: 'Leelaprasad Paila',
  title: 'AI Native Engineer',
  email: 'pailaleelaprasad@gmail.com',
  phone: '+91 9700651322',
  city: 'Vijayawada, Andhra Pradesh',
  birthday: '22 October 2002',
  age: '21',
  degree: 'B.tech CSE(AI & ML)',
  freelance: 'Available',
  github: 'LeelaprasadPaila',
  intro:
    "I am an AI Native Engineer dedicated to pioneering the next generation of intelligent systems. By mastering 'Vibe Coding' and AI Agentic workflows, I bridge the gap between high-level architectural intent and machine execution.",
  quote:
    "I evolved from traditional development to the frontier of 'Vibe Coding' where human intent meets AI Agentic intelligence. As an AI Native Engineer, my craft is no longer just about logic and syntax; it's about orchestrating agents to build the impossible at the speed of thought. In this new paradigm, the only limit is the clarity of our vision.",
};

export const coreSkills = [
  { name: 'Python', level: 80 },
  { name: 'Java', level: 80 },
  { name: 'C language', level: 80 },
  { name: 'HTML', level: 100 },
  { name: 'CSS', level: 90 },
  { name: 'JavaScript', level: 75 },
  { name: 'PHP', level: 80 },
];

export const interests = [
  'Data Science', 'Machine Learning', 'Git/Github', 'Software Engineer',
  'Open Source', 'Photography', 'Open world Games', 'Chess'
];

export const testimonials = [
  { text: 'Leelaprasad consistently delivers exceptional results with their innovative approach and attention to detail.', author: 'Ravi Kiran', role: 'Data Science Enthusiast' },
  { text: "Leelaprasad's creative solutions and strong work ethic have been invaluable to our team's success.", author: 'Sonu Sandeep', role: 'Blockchain Enthusiast' },
  { text: "Leela's creativity and dedication have significantly enhanced our projects' success. They are a true professional.", author: 'Amala', role: 'Freelancer' }
];

/**
 * FAQ Knowledge Base - Direct accurate answers
 * Every answer is 100% sourced from portfolio data
 */
export const faqEntries = [
  {
    id: 'who-is-leela',
    patterns: ['who is', 'about leela', 'about him', 'who are you', 'introduce', 'introduction', 'tell me about'],
    answer: "Leela Prasad Paila is an AI Native Engineer from Vijayawada, Andhra Pradesh. He is currently pursuing B.Tech CSE (AI & ML) and specializes in Deep Learning, AI Agentic workflows, and 'Vibe Coding'. He's building autonomous, context-aware applications that push the boundaries of Deep Learning and AI Agency.",
    category: 'identity'
  },
  {
    id: 'contact-details',
    patterns: ['contact', 'email', 'phone', 'reach', 'message', 'hire', 'get in touch', 'connect'],
    answer: "You can reach Leela Prasad Paila at:\n• Email: pailaleelaprasad@gmail.com\n• Phone: +91 9700651322\n• Location: Vijayawada, Andhra Pradesh\n• Freelance: Available\n\nYou can also use the contact form on this website to send a direct message.",
    category: 'contact'
  },
  {
    id: 'education-details',
    patterns: ['education', 'degree', 'college', 'university', 'b.tech', 'btech', 'studying', 'academic'],
    answer: 'Leela Prasad is pursuing a B.Tech in Computer Science & Engineering with specialization in Artificial Intelligence & Machine Learning (B.tech CSE(AI & ML)).',
    category: 'education'
  },
  {
    id: 'birthday-age',
    patterns: ['birthday', 'born', 'age', 'date of birth', 'how old'],
    answer: 'Leela Prasad was born on 22 October 2002. He is 21 years old.',
    category: 'identity'
  },
  {
    id: 'github-profile',
    patterns: ['github', 'git hub', 'code repository', 'open source', 'repos'],
    answer: "Leela Prasad's GitHub username is LeelaprasadPaila. He actively works on open source projects related to Machine Learning, AI, and web development.",
    category: 'identity'
  },
  {
    id: 'interests-hobbies',
    patterns: ['interest', 'hobby', 'hobbies', 'passion', 'like to do', 'free time', 'games', 'chess', 'photography'],
    answer: "Leela Prasad's interests include:\n• Data Science\n• Machine Learning\n• Git/GitHub\n• Software Engineering\n• Open Source\n• Photography\n• Open World Games\n• Chess",
    category: 'personal'
  },
  {
    id: 'experience-overview',
    patterns: ['experience', 'work', 'career', 'job', 'internship', 'professional'],
    answer: "Leela Prasad has the following professional experience:\n\n• AI/ML Engineer at A2Z Company (2024 - Present)\n• Machine Learning Intern at Bharat Intern (Jan 2024 - Feb 2024)\n• Web Development Intern at Oasis Infobytes (Dec 2023 - Jan 2024)\n• Business Analyst (2024 - Present)",
    category: 'experience'
  },
  {
    id: 'technologies-stack',
    patterns: ['technology', 'tech stack', 'tools', 'languages', 'programming', 'stack'],
    answer: "Leela Prasad's technical arsenal includes:\n\n• Programming: Python, Java, C, JavaScript, PHP\n• ML/AI: Supervised Learning, Feature Engineering, Recommendation Systems, Computer Vision\n• Generative AI: Prompt Engineering, LLM Automation, AI Agents, Context Logic\n• Backend: Flask & FastAPI, Auth & Roles, ML API Deployment\n• Databases: MySQL/Postgres, Pandas & NumPy, Schema Design\n• Web: HTML5, CSS3, ES6, Admin Dashboards, Interactive UI",
    category: 'skills'
  },
  {
    id: 'certifications-list',
    patterns: ['certificate', 'certification', 'achievement', 'credential', 'accomplishment', 'award'],
    answer: "Leela Prasad holds numerous certifications including:\n\nLicensed/Professional:\n• AI & ML - APSCHE\n• AWS Skill Builder\n• Advanced Google Analytics - Google\n• HackerRank Python\n• Cyber Security Professional - Great Learning\n• Digital Marketing - Google\n• TCS iON Professional\n• Kung-Fu & Karate Black Belt\n\nPlus many more course completions from Sololearn, NxtWave, Bolt IoT, OutSkill, Bharat Intern, Brain O Vision, Oasis Infobytes, Sri Balaji, NSS, PSCMR, ISRO, Red Cross, Rotaract, and Supraja.",
    category: 'certifications'
  },
  {
    id: 'projects-overview',
    patterns: ['project', 'portfolio work', 'built', 'developed', 'created'],
    answer: "Leela Prasad has developed 12 projects across Machine Learning & AI, Web Development & Automation, and Data Science & Analytics.\n\nMachine Learning & AI:\n• Recommendation System\n• Deepfake Detection\n• NLP Chatbot\n• Face Emotion Recognition\n• Stock Price Predictor\n• Object Segmentation\n\nWeb Development:\n• Adventure World\n• AI Portfolio Engine\n• Smart Home Dashboard\n• DevOps Pipeline\n\nData Science:\n• Marketing Insights Hub\n• Healthcare Analytics",
    category: 'projects'
  },
  {
    id: 'ml-projects',
    patterns: ['machine learning', 'ml project', 'artificial intelligence', 'ai project', 'deep learning', 'neural', 'nlp', 'computer vision'],
    answer: "Leela Prasad has 6 Machine Learning & AI projects:\n\n1. Recommendation System - Collaborative filtering using Matrix Factorization\n2. Deepfake Detection - CNN-based model for facial manipulation detection\n3. NLP Chatbot - Transformer-based conversational agent\n4. Face Emotion Recognition - Real-time emotion detection\n5. Stock Price Predictor - LSTM-based forecasting\n6. Object Segmentation - Mask R-CNN for pixel-level classification",
    category: 'projects'
  },
  {
    id: 'web-projects',
    patterns: ['web development', 'web project', 'react project', 'frontend', 'website'],
    answer: "Leela Prasad has 4 Web Development & Automation projects:\n\n1. Adventure World - Full-stack travel platform\n2. AI Portfolio Engine - Dynamic portfolio framework\n3. Smart Home Dashboard - IoT control center\n4. DevOps Pipeline - Automated CI/CD workflows",
    category: 'projects'
  },
  {
    id: 'data-projects',
    patterns: ['data science', 'analytics', 'data analysis', 'big data', 'data project'],
    answer: "Leela Prasad has 2 Data Science & Analytics projects:\n\n1. Marketing Insights Hub - Big data platform for consumer behavior analysis\n2. Healthcare Analytics - Predictive modeling for patient outcomes",
    category: 'projects'
  },
  {
    id: 'freelance-status',
    patterns: ['freelance', 'freelancer', 'available for work', 'hiring', 'hire him'],
    answer: 'Yes, Leela Prasad is available for freelance work. You can reach him at pailaleelaprasad@gmail.com or +91 9700651322.',
    category: 'contact'
  },
  {
    id: 'recommended-projects',
    patterns: ['recommend', 'best project', 'top project', 'featured', 'highlight'],
    answer: "The highest priority (featured) projects in Leela's portfolio are:\n\n1. Recommendation System\n2. Deepfake Detection\n3. NLP Chatbot\n4. Adventure World\n5. AI Portfolio Engine\n6. Marketing Insights Hub\n\nThese demonstrate his strongest capabilities in ML/AI and full-stack development.",
    category: 'projects'
  },
  {
    id: 'quote-philosophy',
    patterns: ['quote', 'philosophy', 'vision', 'mission', 'vibe coding', 'agentic', 'agentic workflow'],
    answer: "Leela Prasad's philosophy: 'I evolved from traditional development to the frontier of Vibe Coding where human intent meets AI Agentic intelligence. As an AI Native Engineer, my craft is no longer just about logic and syntax; it's about orchestrating agents to build the impossible at the speed of thought. In this new paradigm, the only limit is the clarity of our vision.'",
    category: 'identity'
  },
  {
    id: 'stats-overview',
    patterns: ['statistics', 'stats', 'overview', 'summary', 'dashboard', 'numbers', 'count'],
    answer: "Leela Prasad's portfolio statistics:\n• 12 Projects\n• 30+ Certifications\n• 4 Experience/Internship entries\n• 7 Core coding skills\n• 6 Technical skill categories\n• 8 Interests\n• 3 Testimonials",
    category: 'stats'
  },
  {
    id: 'skills-list',
    patterns: ['skills', 'abilities', 'competencies', 'capabilities', 'what can he do'],
    answer: "Leela Prasad's core programming skills:\n\n• Python: 80%\n• Java: 80%\n• C Language: 80%\n• HTML: 100%\n• CSS: 90%\n• JavaScript: 75%\n• PHP: 80%\n\nTechnical Categories:\n• Programming & Core Engineering\n• Machine Learning & AI\n• Generative AI\n• Backend (Python)\n• Databases\n• Web Development",
    category: 'skills'
  },
  {
    id: 'resume-cv',
    patterns: ['resume', 'cv', 'curriculum', 'profile summary'],
    answer: 'Leela Prasad Paila is an AI Native Engineer with expertise in Machine Learning, Deep Learning, Generative AI, and web development. He has 4 professional experience entries including AI/ML Engineer at A2Z Company, internships at Bharat Intern and Oasis Infobytes, and a Business Analyst role. His portfolio features 12 projects, 30+ certifications, and 6 technical skill domains.',
    category: 'identity'
  }
];

export default {
  personalIdentity,
  coreSkills,
  interests,
  testimonials,
  faqEntries,
};