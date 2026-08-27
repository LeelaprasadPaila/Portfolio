import React, { useEffect, useState, useCallback } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { getBio, getProjects, getCertificates, getInternships } from '../services/api';
import NeuralBackground from './NeuralBackground';

const About = ({ isActive, onClose }) => {
  const [age, setAge] = useState('');
  const [aboutData, setAboutData] = useState({});
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAllAboutData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch everything in parallel
      const [bio, projects, certs, internships] = await Promise.all([
        getBio().catch(e => { console.warn('Bio fetch failed'); return null; }),
        getProjects().catch(e => []),
        getCertificates().catch(e => []),
        getInternships().catch(e => [])
      ]);

      if (bio && bio.title) {
        setAboutData(bio);
      } else {
        setAboutData(getData(STORAGE_KEYS.BIO));
      }

      // Calculate Dynamic Stats - ensure we have arrays even if API fails
      const projectsArray = Array.isArray(projects) ? projects : [];
      const certsArray = Array.isArray(certs) ? certs : [];
      const internshipsArray = Array.isArray(internships) ? internships : [];

      const dynamicStats = [
        { label: "Certificates", value: certsArray.length },
        { label: "Projects", value: projectsArray.length },
        { label: "Internships", value: internshipsArray.filter(i => i.type === 'Internship').length },
        { label: "Experience", value: internshipsArray.filter(i => i.type === 'Experience').length }
      ];
      setStats(dynamicStats);

      // Fallback for other data if needed
      setSkills(getData(STORAGE_KEYS.SKILLS));
      setInterests(getData(STORAGE_KEYS.INTERESTS));
      setTestimonials(getData(STORAGE_KEYS.TESTIMONIALS));

    } catch (err) {
      console.warn('Full Data Sync failed, using local storage fallback.', err);
      // Final fallback to localStorage
      setAboutData(getData(STORAGE_KEYS.BIO));
      setStats(getData(STORAGE_KEYS.STATS));
      setSkills(getData(STORAGE_KEYS.SKILLS));
      setInterests(getData(STORAGE_KEYS.INTERESTS));
      setTestimonials(getData(STORAGE_KEYS.TESTIMONIALS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      loadAllAboutData();
    }
  }, [isActive, loadAllAboutData]);

  useEffect(() => {
    const calculateAge = () => {
      if (!aboutData.birthday) return '';
      const birthDate = new Date(aboutData.birthday);
      if (isNaN(birthDate)) return '';
      const now = new Date();
      let years = now.getFullYear() - birthDate.getFullYear();
      let months = now.getMonth() - birthDate.getMonth();
      let days = now.getDate() - birthDate.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }
      return years;
    };

    setAge(calculateAge());
  }, [aboutData]);

  return (
    <section id="about" className={`section-overlay ${isActive ? 'active' : ''}`}>
      <NeuralBackground />
      
      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      <div className="container" style={{ paddingBottom: '5rem' }}>
        <h2 className="section-title">About Me</h2>

        <div className="about-content">
          <div className="about-image">
            <div className="image-frame">
              <img src={aboutData.profileImage || "/images/Portfolio_image.png"} alt="Profile" />
            </div>
            <div className="experience-badge">
              <span className="years">AI NATIVE</span>
              <span className="label">ENGINEER</span>
            </div>
          </div>

          <div className="about-text">
            <h3>{aboutData.title}</h3>
            <p className="bio-intro">
              {aboutData.intro}
            </p>

            <div className="info-grid-modern">
              <div className="info-col">
                <p><strong>Birthday:</strong> <span>{aboutData.birthday}</span></p>
                <p><strong>Website:</strong> <a href="#" className="highlight" style={{ color: 'var(--primary-color)' }}>Click here</a></p>
                <p><strong>Phone:</strong> <span>{aboutData.phone}</span></p>
                <p><strong>City:</strong> <span>{aboutData.city}</span></p>
              </div>
              <div className="info-col">
                <p><strong>Age:</strong> <span>{age}</span></p>
                <p><strong>Degree:</strong> <span>{aboutData.degree}</span></p>
                <p><strong>Email:</strong> <span>{aboutData.email}</span></p>
                <p><strong>Freelance:</strong> <span className="status-badge">{aboutData.freelance}</span></p>
              </div>
            </div>

            <div className="quote-box">
              <i className="fas fa-quote-left quote-icon"></i>
              <p>
                I evolved from traditional development to the frontier of 'Vibe Coding' where human intent meets AI Agentic intelligence. As an AI Native Engineer, my craft is no longer just about logic and syntax; it's about orchestrating agents to build the impossible at the speed of thought. In this new paradigm, the only limit is the clarity of our vision.
              </p>
            </div>
          </div>
        </div>

        <div className="stats-container-modern">
          {stats.map((stat, i) => (
            <div key={i} className="stat-box-modern">
              <span className="stat-num">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="about-details-grid">
          <div className="details-section">
            <h3 className="sub-section-title">Skill Mastery</h3>
            <div className="skills-progress-list">
              {skills.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-info-meta">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="details-section">
            <h3 className="sub-section-title">Interests</h3>
            <div className="interests-tags">
              {interests.map((interest, i) => (
                <span key={i} className="interest-tag">
                  <i className="fas fa-check-circle"></i> {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="testimonials-section">
          <h3 className="sub-section-title center">Kind Words</h3>
          <div className="testimonials-grid-modern">
            {testimonials.map((t, i) => (
              <div key={i} className=" testimonial-card-modern">
                <i className="fas fa-quote-right card-quote"></i>
                <p>"{t.text}"</p>
                <div className="testi-author">
                  <h5>{t.author}</h5>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default About;
