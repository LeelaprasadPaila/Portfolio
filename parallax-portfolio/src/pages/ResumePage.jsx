import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/ResumePage.css';

const ResumePage = () => {
  const navigate = useNavigate();

  const careerSummary = 'AI Native Engineer focused on building intelligent, scalable solutions that blend machine learning, automation, and modern product engineering. I turn complex technical ideas into practical systems that create measurable business value, from recommendation engines and computer vision models to full-stack experiences that are fast, reliable, and user-centered.';

  const briefBiography = 'I am a Computer Science graduate with a specialization in AI and Machine Learning, driven by a passion for solving real-world problems through technology. My work combines hands-on product thinking with strong engineering fundamentals, helping me design and deliver systems that are both technically rigorous and genuinely useful for people and businesses.';

  const skills = [
    { category: 'Languages', items: ['Python', 'Java', 'C', 'JavaScript', 'TypeScript', 'HTML/CSS', 'PHP', 'SQL'] },
    { category: 'ML & AI', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Computer Vision', 'NLP', 'Recommendation Systems', 'Generative AI'] },
    { category: 'Web Development', items: ['React', 'Next.js', 'Node.js', 'Flask', 'FastAPI', 'REST APIs', 'Responsive Design'] },
    { category: 'Tools & Platforms', items: ['Git', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'CI/CD', 'MLflow'] }
  ];

  const accomplishments = [
    'Designed and implemented AI-driven systems across recommendation, computer vision, and conversational interfaces.',
    'Converted research concepts into practical, production-minded solutions with a clear focus on usability and impact.',
    'Built modern web experiences and backend workflows that improve product reliability, performance, and business efficiency.',
    'Worked in fast-moving technical environments where experimentation, iteration, and continuous learning were key to delivery.'
  ];

  const workSamples = [
    { name: 'Recommendation System', tech: 'Python, Scikit-learn', description: 'A collaborative filtering approach designed to personalize experiences and predict user preferences with strong relevance.' },
    { name: 'Deepfake Detection', tech: 'PyTorch, OpenCV', description: 'A deep learning application for detecting manipulated media using computer vision and pattern analysis.' },
    { name: 'NLP Chatbot', tech: 'TensorFlow, Transformers', description: 'An intelligent conversational system built to engage users and support automation through contextual reasoning.' },
    { name: 'Face Emotion Recognition', tech: 'Keras, CNN', description: 'A real-time emotion classification model that analyzes visual cues to interpret human sentiment and response.' }
  ];

  const awards = [
    'AWS Certified Cloud Practitioner',
    'Google Data Analytics Professional Certificate',
    'Machine Learning Specialization credentials from DeepLearning.AI and Stanford',
    'Recognized for strong applied learning, technical execution, and continuous development across emerging AI and full-stack domains.'
  ];

  const experience = [
    {
      role: 'AI/ML Engineer',
      company: 'A2Z Company',
      duration: '2024 - Present',
      description: 'Working across AI-driven product development, scalable backend systems, and intelligent workflow automation for real-world business impact.'
    },
    {
      role: 'Machine Learning Intern',
      company: 'Bharat Intern',
      duration: 'Jan 2024 - Feb 2024',
      description: 'Specialized in Python-based ML models. Developed predictive algorithms and analyzed data trends using scikit-learn and pandas.'
    },
    {
      role: 'Web Development Intern',
      company: 'Oasis Infobytes',
      duration: 'Dec 2023 - Jan 2024',
      description: 'Full-stack development focus. Implemented responsive UI components and optimized backend logic for web applications.'
    },
    {
      role: 'Technical Analyst',
      company: 'Technical Analyst',
      duration: '2024 - Present',
      description: 'Analyzing technical requirements, evaluating solutions, and supporting AI-driven product and systems decisions with a strong focus on implementation quality and business impact.'
    }
  ];

  const projects = [
    { name: 'Recommendation System', tech: 'Python, Scikit-learn', description: 'Collaborative filtering model using Matrix Factorization' },
    { name: 'Deepfake Detection', tech: 'PyTorch, OpenCV', description: 'CNN-based model for identifying manipulated content' },
    { name: 'NLP Chatbot', tech: 'TensorFlow, Transformers', description: 'Transformer-based conversational agent' },
    { name: 'Face Emotion Recognition', tech: 'Keras, CNN', description: 'Real-time emotion detection system' }
  ];

  const education = [
    { degree: 'B.Tech in Computer Science (AI & ML)', school: 'KL University', year: '2021 - 2025', description: 'Specialized in Artificial Intelligence and Machine Learning' }
  ];

  const certifications = [
    { name: 'AWS Certified Cloud Practitioner', provider: 'Amazon Web Services', date: '2024' },
    { name: 'Google Data Analytics Professional', provider: 'Google', date: '2024' },
    { name: 'Machine Learning Specialization', provider: 'Stanford / DeepLearning.AI', date: '2023' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="resume-page">
      {/* Hero */}
      <section className="resume-hero">
        <ScrollReveal>
          <span className="section-label">Resume</span>
          <h1 className="resume-hero-title">Professional Profile</h1>
          <p className="resume-hero-subtitle">A comprehensive overview of my skills, experience, and achievements.</p>
          <div className="resume-hero-actions">
            <button className="btn-premium btn-premium-primary" onClick={handlePrint}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="6,9 6,2 18,2 18,9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print / Save PDF
            </button>
            <button className="btn-premium btn-premium-secondary" onClick={() => navigate('/contact')}>
              Contact Me
            </button>
          </div>
        </ScrollReveal>
      </section>

      <div className="resume-container">
        {/* Career Summary */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Career Summary</h2>
            <div className="resume-summary glass-card">
              <p>{careerSummary}</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Brief Biography */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Brief Biography</h2>
            <div className="resume-summary glass-card">
              <p>{briefBiography}</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Marketable Skills */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Marketable Skills</h2>
            <div className="resume-skills-grid">
              {skills.map((group, i) => (
                <div key={i} className="resume-skill-group glass-card">
                  <h3>{group.category}</h3>
                  <div className="resume-skill-tags">
                    {group.items.map((skill, j) => (
                      <span key={j} className="tech-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Professional Accomplishments */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Professional Accomplishments</h2>
            <div className="resume-summary glass-card">
              <ul className="resume-list">
                {accomplishments.map((item, index) => (
                  <li key={index} className="resume-list-item">{item}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </section>

        {/* Work Samples */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Work Samples</h2>
            <div className="resume-projects-grid">
              {workSamples.map((project, i) => (
                <div key={i} className="resume-project-card glass-card">
                  <h3>{project.name}</h3>
                  <span className="resume-project-tech">{project.tech}</span>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Awards or Honors */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Awards or Honors</h2>
            <div className="resume-summary glass-card">
              <ul className="resume-list">
                {awards.map((award, index) => (
                  <li key={index} className="resume-list-item">{award}</li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </section>

        {/* Experience */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Experience</h2>
            <div className="resume-timeline">
              {experience.map((exp, i) => (
                <div key={i} className="resume-timeline-item">
                  <div className="resume-timeline-marker"></div>
                  <div className="resume-timeline-content glass-card">
                    <div className="resume-timeline-header">
                      <h3>{exp.role}</h3>
                      <span className="resume-timeline-date">{exp.duration}</span>
                    </div>
                    <p className="resume-timeline-company">{exp.company}</p>
                    <p className="resume-timeline-desc">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Projects */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Key Projects</h2>
            <div className="resume-projects-grid">
              {projects.map((project, i) => (
                <div key={i} className="resume-project-card glass-card">
                  <h3>{project.name}</h3>
                  <span className="resume-project-tech">{project.tech}</span>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Education */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Education</h2>
            <div className="resume-education-list">
              {education.map((edu, i) => (
                <div key={i} className="resume-education-item glass-card">
                  <div className="resume-edu-header">
                    <h3>{edu.degree}</h3>
                    <span className="resume-edu-year">{edu.year}</span>
                  </div>
                  <p className="resume-edu-school">{edu.school}</p>
                  <p className="resume-edu-desc">{edu.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Certifications */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Certifications</h2>
            <div className="resume-certs-list">
              {certifications.map((cert, i) => (
                <div key={i} className="resume-cert-item glass-card">
                  <div className="resume-cert-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <div className="resume-cert-info">
                    <h3>{cert.name}</h3>
                    <p>{cert.provider}</p>
                    <span className="resume-cert-date">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Contact Information */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Contact Information</h2>
            <div className="resume-info-grid">
              <div className="resume-info-card glass-card">
                <h3>Email</h3>
                <a href="mailto:pailaleelaprasad@gmail.com">pailaleelaprasad@gmail.com</a>
              </div>
              <div className="resume-info-card glass-card">
                <h3>Phone</h3>
                <a href="tel:+919700651322">+91 9700651322</a>
              </div>
              <div className="resume-info-card glass-card">
                <h3>Location</h3>
                <p>Vijayawada, Andhra Pradesh, India</p>
              </div>
              <div className="resume-info-card glass-card">
                <h3>Portfolio</h3>
                <a href="https://leelaprasad.dev" target="_blank" rel="noreferrer">leelaprasad.dev</a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Languages */}
        <section className="resume-section">
          <ScrollReveal>
            <h2 className="resume-section-title">Languages</h2>
            <div className="resume-languages">
              <span className="tech-tag">English (Professional)</span>
              <span className="tech-tag">Telugu (Native)</span>
              <span className="tech-tag">Hindi (Conversational)</span>
            </div>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
};

export default ResumePage;