import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getProjects, getSkills, getInternships, getCertificates, getBio, getAIStatus, queryAI } from '../services/api';
import './AIAssistant.css';

/**
 * JARVIS - AI Portfolio Assistant
 * A sophisticated assistant with a Jarvis-like persona.
 * Trained on all portfolio data with daily updates and admin sync capability.
 */

const JARVIS_PERSONA = {
  title: "JARVIS",
  subtitle: "Portfolio Intelligence System",
  status: "Online",
  greeting: "At your service. I'm JARVIS — Leela Prasad's digital intelligence system. I've been trained on the full portfolio knowledge base and can help you explore projects, skills, experience, and more. How may I assist you today?",
  offlineGreeting: "Good day. I'm running in local mode with limited data. You can still ask me anything, but for the full experience, request the admin to sync the knowledge base.",
};

const ASSISTANT_COLORS = {
  primary: '#00f2ff',
  secondary: '#0088cc',
  text: '#f1f5f9',
  muted: '#94a3b8',
  glass: 'rgba(15, 23, 42, 0.85)',
  border: 'rgba(0, 242, 255, 0.15)',
};

const suggestedQuestionsPool = [
  "Who is Leela Prasad?",
  "Show me all projects",
  "What technologies does he use?",
  "Tell me about ML projects",
  "What experience does he have?",
  "How can I contact him?",
  "Show certificates and achievements",
  "What skills does he have?",
  "Recommend projects for recruiters",
  "What domains has he explored?"
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [knowledgeTrained, setKnowledgeTrained] = useState(false);
  const [knowledgeVersion, setKnowledgeVersion] = useState(null);
  const [localKnowledge, setLocalKnowledge] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check AI knowledge base status on mount
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await getAIStatus();
        if (status.trained) {
          setKnowledgeTrained(true);
          setKnowledgeVersion(status.version);
        }
      } catch (e) {
        console.log('[JARVIS] Knowledge base not available, using local mode');
      }
    };
    checkStatus();
  }, []);

  // Listen for keyboard shortcut (Cmd+J) to toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for custom event from navbar
  useEffect(() => {
    const handleOpenAI = () => setIsOpen(true);
    window.addEventListener('openAIAssistant', handleOpenAI);
    return () => window.removeEventListener('openAIAssistant', handleOpenAI);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSuggestedQuestions(suggestedQuestionsPool.slice(0, 4));
      setTimeout(() => inputRef.current?.focus(), 100);
      if (messages.length === 0) {
        const greeting = knowledgeTrained ? JARVIS_PERSONA.greeting : JARVIS_PERSONA.offlineGreeting;
        addBotMessage(greeting, { type: 'system' });
      }
    }
  }, [isOpen, knowledgeTrained]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text, options = {}) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'bot',
      text,
      ...options
    }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      text
    }]);
  };

  /**
   * Knowledge-aware search using the trained backend knowledge base
   */
  const queryKnowledgeBase = async (question) => {
    try {
      const result = await queryAI(question);
      return result;
    } catch (e) {
      console.warn('[JARVIS] Knowledge base query failed:', e.message);
      return null;
    }
  };

  /**
   * Fallback local search using direct API calls
   */
  const searchLocalContent = async (query) => {
    const q = query.toLowerCase();
    const results = { projects: [], skills: [], internships: [], certificates: [], bio: null };

    try {
      const [projects, skills, internships, certificates, bio] = await Promise.allSettled([
        getProjects(),
        getSkills(),
        getInternships(),
        getCertificates(),
        getBio()
      ]);

      if (projects.status === 'fulfilled') {
        results.projects = projects.value.filter(p =>
          p.title?.toLowerCase().includes(q) ||
          p.desc?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.meta?.toLowerCase().includes(q)
        );
      }

      if (skills.status === 'fulfilled') {
        results.skills = skills.value.filter(s =>
          s.name?.toLowerCase().includes(q) ||
          s.title?.toLowerCase().includes(q) ||
          s.skills?.some(skill => skill.toLowerCase().includes(q))
        );
      }

      if (internships.status === 'fulfilled') {
        results.internships = internships.value.filter(i =>
          i.role?.toLowerCase().includes(q) ||
          i.company?.toLowerCase().includes(q) ||
          i.desc?.toLowerCase().includes(q)
        );
      }

      if (certificates.status === 'fulfilled') {
        results.certificates = certificates.value.filter(c =>
          c.title?.toLowerCase().includes(q) ||
          c.issuer?.toLowerCase().includes(q)
        );
      }

      if (bio.status === 'fulfilled') {
        results.bio = bio.value;
      }

      return results;
    } catch (error) {
      console.error('[JARVIS] Local search error:', error);
      return results;
    }
  };

  /**
   * Generate a Jarvis-style response
   */
  const generateJarvisResponse = (query, data, source) => {
    const q = query.toLowerCase();

    // Priority 1: If FAQ match found, return the 100% accurate answer
    if (data?.faqMatch?.answer) {
      return {
        text: `${data.faqMatch.answer}\n\n_This information is verified directly from Leela's portfolio knowledge base._`,
        quick: true,
      };
    }

    // Build contextual acknowledgments
    const acknowledgments = [
      "Processing your query through my knowledge base...",
      "Scanning portfolio data systems...",
      "Accessing Leela Prasad's neural archives...",
      "Running diagnostic on available data...",
      "Consulting the intelligence lattice...",
      "Initiating cross-reference analysis...",
    ];

    // Greeting/intro detection
    if (q.match(/^(hi|hello|hey|greetings|good\s(morning|afternoon|evening))/)) {
      return {
        text: `Good day. I'm operating at peak efficiency. How may I be of service? You can ask me about projects, skills, experience, or any aspect of Leela Prasad's professional profile.`,
        quick: true,
      };
    }

    // Who is / about
    if (q.includes('who') || q.includes('about') || q.includes('tell me')) {
      const bio = data?.bio || data?.knowledge?.bio;
      const personal = data?.knowledge?.personal || {};
      const name = bio?.name || personal?.name || 'Leela Prasad Paila';
      const title = bio?.title || personal?.title || 'AI Native Engineer';
      const intro = bio?.intro || personal?.intro || 'An AI Native Engineer dedicated to pioneering intelligent systems.';
      const email = bio?.email || personal?.email || 'pailaleelaprasad@gmail.com';
      const city = bio?.city || personal?.city || 'Vijayawada, Andhra Pradesh';
      const degree = bio?.degree || personal?.degree || 'B.Tech CSE(AI & ML)';
      const phone = bio?.phone || personal?.phone || '+91 9700651322';
      const birthday = bio?.birthday || personal?.birthday || '22 October 2002';
      const github = personal?.github || 'LeelaprasadPaila';
      
      return {
        text: `**${name}** — ${title}\n\n${intro}\n\n**Key Details:**\n• 📧 Email: ${email}\n• 📱 Phone: ${phone}\n• 📍 Location: ${city}\n• 🎓 Degree: ${degree}\n• 🎂 Birthday: ${birthday}\n• 🐙 GitHub: ${github}\n\nI have full access to his professional portfolio. What specific area would you like to explore?`,
      };
    }

    // Projects
    if (q.includes('project')) {
      const projects = data?.projects || data?.knowledge?.projects || [];
      const filtered = projects.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.desc?.toLowerCase().includes(q)
      );

      const relevant = filtered.length > 0 ? filtered : projects;

      if (relevant.length > 0) {
        const projectList = relevant.slice(0, 6).map(p =>
          `🎯 **${p.title}** — *${p.category}*\n   ${p.desc || ''}`
        ).join('\n\n');

        return {
          text: `Accessing project database... I've located ${relevant.length} project(s):\n\n${projectList}\n\n${relevant.length > 6 ? `\n_Plus ${relevant.length - 6} more projects._` : ''}\n\nShall I elaborate on any particular project?`,
          projects: relevant.slice(0, 6),
        };
      }

      return {
        text: `I've scanned the project archives but couldn't find a direct match. Leela has developed ${projects.length} projects across various domains. Try asking about specific categories like ML/AI, Web Development, or Data Science.`,
      };
    }

    // ML/AI specific
    if (q.includes('machine learning') || q.includes('ml') || q.includes('ai') || q.includes('artificial intelligence')) {
      const projects = data?.projects || data?.knowledge?.projects || [];
      const mlProjects = projects.filter(p =>
        p.category?.toLowerCase().includes('machine learning') ||
        p.category?.toLowerCase().includes('ai') ||
        p.meta?.toLowerCase().includes('ml') ||
        p.meta?.toLowerCase().includes('ai')
      );

      if (mlProjects.length > 0) {
        const list = mlProjects.slice(0, 5).map(p =>
          `🔬 **${p.title}**\n   ${p.desc}\n   Tech Stack: ${p.meta || 'Various'}`
        ).join('\n\n');

        return {
          text: `Initiating ML/AI module scan... I've identified ${mlProjects.length} projects in this domain:\n\n${list}\n\nLeela's expertise spans deep learning, computer vision, NLP, and recommendation systems.`,
          projects: mlProjects,
        };
      }

      return {
        text: `Leela Prasad has extensive experience in Machine Learning and AI, including deep learning frameworks like PyTorch and TensorFlow, NLP with Transformers, and computer vision systems. Check the Projects section for the full catalog.`,
      };
    }

    // Skills
    if (q.includes('skill') || q.includes('technology') || q.includes('tech stack') || q.includes('know') || q.includes('expertise') || q.includes('proficient')) {
      const skills = data?.skills || data?.knowledge?.skills || [];
      const techSkills = data?.knowledge?.derived?.technologies || data?.derived?.technologies || [];

      if (skills.length > 0) {
        const skillCategories = skills.map(s =>
          `**${s.title || s.category || s.name}**: ${(s.skills || []).join(', ')}`
        ).join('\n');

        return {
          text: `Running skills assessment... Here's Leela's technical proficiency:\n\n${skillCategories}\n\n**Total Technologies Mastered:** ${techSkills.length || 'Various'}\n\nAll skills are catalogued and indexed in my knowledge base.`,
        };
      }

      return {
        text: `Leela's technical arsenal includes Python, Machine Learning, Deep Learning, NLP, Computer Vision, FastAPI, React, and many more. The complete skill matrix is available in the Skills section.`,
      };
    }

    // Experience / Internships
    if (q.includes('experience') || q.includes('internship') || q.includes('work') || q.includes('career') || q.includes('job')) {
      const internships = data?.internships || data?.knowledge?.internships || [];
      const experience = data?.knowledge?.derived?.experience;

      if (internships.length > 0) {
        const expList = internships.map(i =>
          `💼 **${i.role}** at **${i.company}**\n   ${i.duration || ''}\n   ${i.desc || ''}`
        ).join('\n\n');

        return {
          text: `Accessing career archive...\n\n${expList}\n\n${experience ? `📊 **Years of Active Development:** ${experience.yearsOfExperience || 1}+` : ''}\n${experience?.companies?.length ? `🏢 **Organizations:** ${experience.companies.join(', ')}` : ''}`,
          internships,
        };
      }

      return {
        text: `Leela has practical experience through internships at Bharat Intern (ML) and Oasis Infobytes (Web Dev), plus ongoing AI experimentation. Check the Experience section for full details.`,
      };
    }

    // Certificates
    if (q.includes('certificate') || q.includes('achievement') || q.includes('certification') || q.includes('credential') || q.includes('accomplish')) {
      const certs = data?.certificates || data?.knowledge?.certificates || [];

      if (certs.length > 0) {
        const certList = certs.slice(0, 8).map(c =>
          `📜 **${c.title}** — ${c.issuer || 'Verified'}`
        ).join('\n');

        return {
          text: `Querying achievements database... Found ${certs.length} certifications:\n\n${certList}\n\n${certs.length > 8 ? `\n_Plus ${certs.length - 8} more credentials._` : ''}\n\nAll certificates are verified and documented.`,
        };
      }

      return {
        text: `Leela holds multiple industry certifications. The complete list is available in the Certificates section of this portfolio.`,
      };
    }

    // Contact
    if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('message') || q.includes('hire') || q.includes('get in touch')) {
      const bio = data?.bio || data?.knowledge?.bio;

      return {
        text: `Establishing communication channel...\n\n📧 **Email:** ${bio?.email || 'pailaleelaprasad@gmail.com'}\n📱 **Phone:** ${bio?.phone || '+91 9700651322'}\n📍 **Location:** ${bio?.city || 'Vijayawada, Andhra Pradesh'}\n🌐 **Freelance:** ${bio?.freelance || 'Available'}\n\nYou can also use the contact form on this website to send a direct message. I'll ensure it reaches the right destination.`,
      };
    }

    // Resume / CV
    if (q.includes('resume') || q.includes('cv') || q.includes('curriculum')) {
      return {
        text: `The complete professional dossier is available in the Resume section. It contains Leela's full work history, educational background, technical skills, and project highlights. I recommend reviewing the featured projects for the most impactful demonstrations of capability.`,
      };
    }

    // Domains
    if (q.includes('domain') || q.includes('area') || q.includes('field') || q.includes('sector')) {
      const domains = data?.knowledge?.derived?.domains || data?.derived?.domains || [];

      if (domains.length > 0) {
        return {
          text: `Mapping knowledge domains... Leela has explored ${domains.length} distinct domains:\n\n${domains.map(d => `• ${d}`).join('\n')}\n\nHis expertise spans across AI/ML, web development, data science, and automation.\n\nTotal technologies indexed: ${(data?.stats?.totalTechnologies || data?.knowledge?.derived?.technologies?.length) || 'Various'}`,
        };
      }

      return {
        text: `Leela's expertise spans Machine Learning & AI, Web Development, Data Science, and Automation. Each domain is backed by practical projects and experience.`,
      };
    }

    // Stats / overview
    if (q.includes('stat') || q.includes('overview') || q.includes('summary') || q.includes('dashboard')) {
      const stats = data?.stats || data?.knowledge?.stats;

      if (stats) {
        return {
          text: `Generating portfolio overview...\n\n📊 **Knowledge Base Statistics:**\n• 🎯 Projects: ${stats.totalProjects || 0}\n• 📜 Certificates: ${stats.totalCertificates || 0}\n• 💼 Internships/Experience: ${stats.totalInternships || 0}\n• 🛠 Skills Categories: ${stats.totalSkills || 0}\n• 🔧 Technologies: ${stats.totalTechnologies || 0}\n• 🌐 Domains: ${stats.totalDomains || 0}\n\n${knowledgeVersion ? `\n_Knowledge base v${knowledgeVersion}_` : ''}\n${knowledgeTrained ? '_All data synchronized and indexed._' : '_Running in local mode._'}`,
        };
      }

      return {
        text: `Leela's portfolio showcases multiple projects, certifications, and skills across AI/ML, web development, and data science. Check the respective sections for detailed metrics.`,
      };
    }

    // Default: comprehensive search
    if (data?.results?.length > 0 || data?.projects?.length > 0 || data?.skills?.length > 0 || data?.internships?.length > 0) {
      let response = `${acknowledgments[Math.floor(Math.random() * acknowledgments.length)]}\n\nI've scanned my knowledge base and found relevant data:\n\n`;
      
      const projects = data.projects || data?.knowledge?.projects || [];
      const skills = data.skills || data?.knowledge?.skills || [];
      const internships = data.internships || data?.knowledge?.internships || [];

      if (projects.length > 0) {
        response += `**Projects:** ${projects.length} found\n`;
        projects.slice(0, 3).forEach(p => {
          response += `• ${p.title} — ${p.category || ''}\n`;
        });
        response += '\n';
      }

      if (skills.length > 0) {
        response += `**Skills:** ${skills.length} categories\n`;
      }

      if (internships.length > 0) {
        response += `**Experience:** ${internships.length} entries\n`;
      }

      response += `\nWould you like me to elaborate on any of these areas?`;

      return { text: response };
    }

    // Fallback
    return {
      text: `I've searched my knowledge base but didn't find a specific match for that query, sir. I can assist with:\n\n• 🔍 **Projects** — All portfolio projects with details\n• 🛠 **Skills** — Complete technology stack\n• 💼 **Experience** — Work history and internships\n• 📜 **Certificates** — Achievements and credentials\n• 📧 **Contact** — How to reach Leela\n• 📊 **Overview** — Portfolio statistics\n\nWhat would you like to explore?`,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addUserMessage(userMessage);
    setInput('');
    setIsTyping(true);
    setSuggestedQuestions([]);

    // Typing delay for natural feel
    setTimeout(async () => {
      try {
        let response;

        // Try knowledge base first if trained
        if (knowledgeTrained) {
          const kbResult = await queryKnowledgeBase(userMessage);
          if (kbResult && kbResult.trained) {
            response = generateJarvisResponse(userMessage, kbResult, 'knowledge');
          } else {
            // Fallback to local search
            const localData = await searchLocalContent(userMessage);
            response = generateJarvisResponse(userMessage, localData, 'local');
          }
        } else {
          // Local mode
          const localData = await searchLocalContent(userMessage);
          response = generateJarvisResponse(userMessage, localData, 'local');
        }

        setIsTyping(false);
        addBotMessage(response.text, response);
      } catch (error) {
        setIsTyping(false);
        addBotMessage(`I encountered an error while processing your request. Please try again or rephrase your question. \n\n_Error: ${error.message}_`);
      }
    }, 600 + Math.random() * 400);
  };

  const handleSuggestedClick = (question) => {
    setInput(question);
    setSuggestedQuestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="ai-assistant-widget">
      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-assistant-panel" role="dialog" aria-modal="true" aria-label="JARVIS Assistant">
          <div className="ai-assistant-header">
            <div className="ai-assistant-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                <circle cx="9" cy="14" r="1.5" fill="currentColor" />
                <circle cx="15" cy="14" r="1.5" fill="currentColor" />
                <path d="M8 18h8" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="ai-assistant-title">
              <h3>{JARVIS_PERSONA.title}</h3>
              <span className="ai-assistant-status">
                {knowledgeTrained ? `Online • v${knowledgeVersion}` : 'Local Mode'}
              </span>
            </div>
            <button className="ai-assistant-close" onClick={() => setIsOpen(false)} aria-label="Close assistant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div className="ai-assistant-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ai-message-${msg.type}`}>
                {msg.type === 'bot' && (
                  <div className="ai-message-avatar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                    </svg>
                  </div>
                )}
                <div className="ai-message-content">
                  <div className="ai-message-text" dangerouslySetInnerHTML={{
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br />')
                      .replace(/•/g, '<span class="ai-bullet">•</span>')
                  }} />
                  {msg.projects && msg.projects.length > 0 && (
                    <div className="ai-message-projects">
                      {msg.projects.map((project, idx) => (
                        <div key={idx} className="ai-project-card">
                          <div className="ai-project-title">{project.title}</div>
                          <div className="ai-project-meta">{project.category} {project.meta ? `• ${project.meta}` : ''}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="ai-message ai-message-bot">
                <div className="ai-message-avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
                  </svg>
                </div>
                <div className="ai-message-content">
                  <div className="ai-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {suggestedQuestions.length > 0 && (
            <div className="ai-suggested-questions">
              {suggestedQuestions.map((question, idx) => (
                <button
                  key={idx}
                  className="ai-suggested-question"
                  onClick={() => handleSuggestedClick(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form className="ai-assistant-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask JARVIS anything..."
              aria-label="Ask JARVIS assistant"
            />
            <button type="submit" disabled={!input.trim()} aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        className="ai-assistant-fab"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? "Close JARVIS" : "Open JARVIS"}
        title="JARVIS AI Assistant (Cmd+J)"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z" />
            <circle cx="9" cy="14" r="1.5" fill="currentColor" />
            <circle cx="15" cy="14" r="1.5" fill="currentColor" />
            <path d="M8 18h8" strokeWidth="1.5" />
          </svg>
        )}
        <span className={`ai-assistant-fab-badge ${knowledgeTrained ? 'trained' : ''}`} />
      </button>
    </div>
  );
};

export default AIAssistant;
