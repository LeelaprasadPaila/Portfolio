import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, ValidationError } from '@formspree/react';
import ScrollReveal from '../components/ScrollReveal';
import '../styles/ContactPage.css';
import { assetUrl } from '../config/env';

const ContactPage = () => {
  const navigate = useNavigate();
  const [state, handleSubmitFormspree] = useForm('xeeyvwjy');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (state.succeeded) {
      setFormStatus('success');
      setStatusMessage('Thanks for reaching out. Your message was sent successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      return;
    }

    if (state.errors && state.errors.length > 0) {
      setFormStatus('error');
      setStatusMessage('Something went wrong while sending your message. Please try again or email me directly.');
    }
  }, [state.succeeded, state.errors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus('error');
      setStatusMessage('Please fill in your name, email, and message.');
      return;
    }

    setFormStatus('sending');
    setStatusMessage('Sending your message...');
    handleSubmitFormspree(e);
  };

  const currentTime = new Date();
  const timezone = 'Asia/Kolkata (IST)';
  const timeStr = currentTime.toLocaleTimeString('en-US', { 
    timeZone: 'Asia/Kolkata',
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const faqs = [
    { q: 'What is your availability?', a: 'I\'m currently open to freelance projects, collaborations, and full-time opportunities.' },
    { q: 'How quickly do you respond?', a: 'I typically respond within 24 hours during business days.' },
    { q: 'Do you work remotely?', a: 'Yes, I\'m fully set up for remote collaboration across any timezone.' },
    { q: 'What technologies do you work with?', a: 'Python, ML/DL frameworks, React, Node.js, and cloud platforms.' }
  ];

  return (
    <div className="contact-page">
      {/* Hero */}
      <section className="contact-hero">
        <ScrollReveal>
          <span className="section-label">Contact</span>
          <h1 className="contact-hero-title">Let's Work Together</h1>
          <p className="contact-hero-subtitle">
            Have a project in mind? Looking for a collaborator? 
            I'm always interested in hearing about new opportunities and ideas.
          </p>
        </ScrollReveal>
      </section>

      <div className="contact-container">
        <div className="contact-grid">
          {/* Left - Info */}
          <div className="contact-info-side">
            <ScrollReveal direction="left">
              <div className="contact-intro glass-card">
                <div className="contact-avatar">
                  <img src={assetUrl('images/Portfolio_image.png')} alt="Leela Prasad" />
                </div>
                <h3>Leela Prasad Paila</h3>
                <p>AI Native Engineer & Full-Stack Developer</p>
                <div className="contact-status">
                  <span className="status-dot"></span>
                  Available for opportunities
                </div>
              </div>

              <div className="contact-details">
                <div className="contact-detail-card glass-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <div>
                    <span className="detail-label">Email</span>
                    <a href="mailto:pailaleelaprasad@gmail.com">pailaleelaprasad@gmail.com</a>
                  </div>
                </div>

                <div className="contact-detail-card glass-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  <div>
                    <span className="detail-label">Current Time</span>
                    <span className="detail-time">{timeStr} {timezone}</span>
                  </div>
                </div>

                <div className="contact-detail-card glass-card">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <span className="detail-label">Location</span>
                    <span>Vijayawada, Andhra Pradesh, India</span>
                  </div>
                </div>
              </div>

              <div className="contact-social glass-card">
                <h4>Connect With Me</h4>
                <div className="contact-social-links">
                  <a href="https://github.com/leelaprasadpaila" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/leelaprasadpaila" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="mailto:pailaleelaprasad@gmail.com" className="social-link" aria-label="Email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </a>
                </div>
                <button className="btn-premium btn-premium-secondary" onClick={() => navigate('/resume')} style={{ width: '100%', marginTop: '1rem' }}>
                  Download Resume
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Right - Form */}
          <div className="contact-form-side">
            <ScrollReveal direction="right">
              <div className="contact-form-container glass-card">
                <h3>Send a Message</h3>
                <p className="contact-form-intro">
                  Fill out the form below and I'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
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
                        disabled={formStatus === 'sending' || state.submitting}
                      />
                      <ValidationError prefix="Name" field="name" errors={state.errors} />
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
                        disabled={formStatus === 'sending' || state.submitting}
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      disabled={formStatus === 'sending' || state.submitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts, questions, or project ideas..."
                      rows="5"
                      required
                      disabled={formStatus === 'sending' || state.submitting}
                    ></textarea>
                    <ValidationError prefix="Message" field="message" errors={state.errors} />
                  </div>

                  <button
                    type="submit"
                    className={`btn-premium btn-premium-primary contact-submit-btn ${formStatus === 'sending' || state.submitting ? 'sending' : ''}`}
                    disabled={formStatus === 'sending' || state.submitting}
                  >
                    {(formStatus === 'sending' || state.submitting) ? (
                      <>
                        <span className="sending-spinner"></span>
                        Sending...
                      </>
                    ) : state.succeeded ? (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                          <polyline points="22,4 12,14.01 9,11.01" />
                        </svg>
                        Message Sent!
                      </>
                    ) : (
                      <>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22,2 15,22 11,13 2,9 22,2" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>

                  {state.succeeded && (
                    <div className="contact-form-status success">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-emerald)" strokeWidth="2" width="20" height="20">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22,4 12,14.01 9,11.01" />
                      </svg>
                      <span>Message sent successfully! I&apos;ll get back to you soon.</span>
                    </div>
                  )}

                  {statusMessage && !state.succeeded && formStatus !== 'idle' && (
                    <div className={`contact-form-status ${formStatus}`}>
                      {formStatus === 'error' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--color-pink)" strokeWidth="2" width="20" height="20">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="15" y1="9" x2="9" y2="15" />
                          <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                      )}
                      <span>{statusMessage}</span>
                    </div>
                  )}
                </form>
              </div>

              {/* FAQ */}
              <div className="contact-faq">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-list">
                  {faqs.map((faq, i) => (
                    <details key={i} className="faq-item glass-card">
                      <summary>
                        {faq.q}
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="6,9 12,15 18,9" />
                        </svg>
                      </summary>
                      <p>{faq.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
