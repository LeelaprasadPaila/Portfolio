import React, { useState, useEffect, useCallback } from 'react';
import { getData, STORAGE_KEYS } from '../data/dataStore';
import { getSkills } from '../services/api';
import NeuralBackground from './NeuralBackground';

const Skills = ({ isActive, onClose }) => {
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSkills = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSkills();
      if (Array.isArray(data) && data.length > 0) {
        setSkillCategories(data);
      } else {
        throw new Error('No skills found');
      }
    } catch (err) {
      console.warn('Skills API load failed, falling back to local data.', err);
      setSkillCategories(getData(STORAGE_KEYS.TECH_SKILLS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      loadSkills();
    }
  }, [isActive, loadSkills]);

  return (
    <section id="skills" className={`section-overlay ${isActive ? 'active' : ''}`}>
      <NeuralBackground />
      
      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>

      <div className="container" style={{ marginTop: '100px', paddingBottom: '3rem' }}>
        <h2 className="section-title">Specialized Expertise</h2>

        <div className="skills-grid">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="skill-category">
              <h3><i className={cat.icon || "fas fa-code"}></i> {cat.title}</h3>
              <ul className="skill-list">
                {cat.skills && cat.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="skill-item">
                    <span className="dot"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
