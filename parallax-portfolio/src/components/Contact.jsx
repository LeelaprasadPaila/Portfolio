import React, { useState } from 'react';
import NeuralBackground from './NeuralBackground';
import { submitContactForm } from '../services/api';
import '../styles/Contact.css';

const Contact = ({ isActive, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState('Send Message');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('Please fill in all required fields');
      setTimeout(() => setFormStatus('Send Message'), 3000);
      return;
    }

    setIsSubmitting(true);
    setFormStatus('Sending...');

    try {
      await submitContactForm(formData);
      
      setFormStatus('Message Sent Successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setFormStatus('Send Message');
        setIsSubmitting(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('Send Failed. Try again.');
      
      setTimeout(() => {
        setFormStatus('Send Message');
        setIsSubmitting(false);
      }, 3000);
    }
  };

  return (
    <section id="contact" className={`section-overlay ${isActive ? 'active' : ''}`}>
      <NeuralBackground />
      
      <button className="close-btn" onClick={onClose} aria-label="Close contact section">
        <i className="fas fa-times"></i>
      </button>

      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">Let's collaborate and create something amazing together</p>
        </div>

        {/* Contact Content - Info Cards + Form */}
        <div className="contact-content">
          {/* Contact Info Cards */}
          <div className="contact-info">
            {/* Email Card */}
            <div className="info-card">
              <i className="fas fa-envelope"></i>
              <h3>Email</h3>
              <p>
                <a href="mailto:pailalee99@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  pailalee99@gmail.com
                </a>
              </p>
            </div>

            {/* LinkedIn Card */}
            <div className="info-card">
              <i className="fab fa-linkedin"></i>
              <h3>LinkedIn</h3>
              <p>
                <a href="https://linkedin.com/in/leelaprasadpaila" target="_blank" rel="noopener noreferrer" 
                   style={{ color: 'inherit', textDecoration: 'none' }}>
                  leelaprasadpaila
                </a>
              </p>
            </div>

            {/* GitHub Card */}
            <div className="info-card">
              <i className="fab fa-github"></i>
              <h3>GitHub</h3>
              <p>
                <a href="https://github.com/leelaprasadpaila" target="_blank" rel="noopener noreferrer"
                   style={{ color: 'inherit', textDecoration: 'none' }}>
                  leelaprasadpaila
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <form onSubmit={handleSubmit}>
              {/* Name and Email Row */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Share your thoughts, questions, or project ideas..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="form-submit"
                disabled={isSubmitting}
              >
                <i className="fas fa-paper-plane"></i>
                {formStatus}
              </button>

              {/* Status Message */}
              {formStatus !== 'Send Message' && (
                <div className="form-status">
                  {formStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
