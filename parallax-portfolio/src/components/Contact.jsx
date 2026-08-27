import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import NeuralBackground from './NeuralBackground';
import '../styles/Contact.css';

const Contact = ({ isActive, onClose }) => {
  const [state, handleSubmit] = useForm("xeeyvwjy");

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
                <a href="mailto:pailaleelaprasad@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                  pailaleelaprasad@gmail.com
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
            {state.succeeded ? (
              <div className="form-success">
                <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                <h3>Thank you!</h3>
                <p>Your message has been sent successfully. I'll get back to you soon!</p>
                <button className="form-submit" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Name and Email Row */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      required
                    />
                    <ValidationError prefix="Name" field="name" errors={state.errors} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      required
                    />
                    <ValidationError prefix="Email" field="email" errors={state.errors} />
                  </div>
                </div>

                {/* Subject */}
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Share your thoughts, questions, or project ideas..."
                    required
                  ></textarea>
                  <ValidationError prefix="Message" field="message" errors={state.errors} />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="form-submit"
                  disabled={state.submitting}
                >
                  {state.submitting ? (
                    <><i className="fas fa-spinner fa-spin"></i> Sending...</>
                  ) : (
                    <><i className="fas fa-paper-plane"></i> Send Message</>
                  )}
                </button>

                {/* Error Message */}
                {state.errors && state.errors.length > 0 && (
                  <div className="form-status" style={{ color: '#ff6b6b', marginTop: '1rem' }}>
                    <i className="fas fa-exclamation-circle"></i> Something went wrong. Please try again.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;