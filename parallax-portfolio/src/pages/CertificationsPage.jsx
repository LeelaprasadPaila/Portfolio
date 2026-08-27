import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getCertificates, getFileUrl } from '../services/api';
import { certificatesData } from '../data/certificatesData';
import ScrollReveal from '../components/ScrollReveal';
import FilterBar from '../components/FilterBar';
import '../styles/CertificationsPage.css';

const CertificationsPage = () => {
  const [allCerts, setAllCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'All', search: '' });
  const [selectedCert, setSelectedCert] = useState(null);

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCertificates();
      if (Array.isArray(data) && data.length > 0) {
        setAllCerts(data);
      } else {
        throw new Error('No data');
      }
    } catch (err) {
      setAllCerts(certificatesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(allCerts.map(c => c.category || 'Other'))];
    return cats;
  }, [allCerts]);

  const filteredCerts = useMemo(() => {
    let filtered = allCerts;

    if (filters.category !== 'All') {
      filtered = filtered.filter(c => c.category === filters.category);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(c =>
        c.title?.toLowerCase().includes(query) ||
        c.issuer?.toLowerCase().includes(query) ||
        c.description?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allCerts, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="certifications-page">
      {/* Hero */}
      <section className="certifications-hero">
        <ScrollReveal>
          <span className="section-label">Credentials</span>
          <h1 className="certifications-hero-title">Certifications & Licenses</h1>
          <p className="certifications-hero-subtitle">
            Verified professional credentials, technical certifications, and continuous learning achievements.
          </p>
        </ScrollReveal>
      </section>

      {/* Stats */}
      <section className="certifications-stats">
        <div className="cert-stats-grid">
          <div className="cert-stat-card glass-card">
            <span className="cert-stat-value">{allCerts.length}</span>
            <span className="cert-stat-label">Total Certifications</span>
          </div>
          <div className="cert-stat-card glass-card">
            <span className="cert-stat-value">{allCerts.filter(c => c.category === 'Licensed').length}</span>
            <span className="cert-stat-label">Licensed Credentials</span>
          </div>
          <div className="cert-stat-card glass-card">
            <span className="cert-stat-value">{allCerts.filter(c => c.category === 'Normal').length}</span>
            <span className="cert-stat-label">Course Certificates</span>
          </div>
        </div>
      </section>

      {/* Filter & Grid */}
      <section className="certifications-grid-section">
        <FilterBar
          items={allCerts}
          categories={categories}
          onFilterChange={handleFilterChange}
          searchPlaceholder="Search certifications..."
        />

        {loading ? (
          <div className="cert-loading-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton" style={{ height: '280px' }}></div>
            ))}
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="cert-empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h3>No certifications found</h3>
            <p>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="cert-grid">
            {filteredCerts.map((cert, index) => (
              <ScrollReveal key={cert._id || index} delay={index * 50}>
                <div
                  className={`cert-card glass-card ${cert.category === 'Licensed' ? 'licensed' : ''}`}
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="cert-card-image">
                    {cert.image ? (
                      <img src={getFileUrl(cert.image)} alt={cert.title} />
                    ) : (
                      <div className="cert-card-no-image">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                      </div>
                    )}
                    {cert.category === 'Licensed' && (
                      <div className="cert-card-ribbon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Licensed
                      </div>
                    )}
                  </div>
                  <div className="cert-card-body">
                    <h3 className="cert-card-title">{cert.title}</h3>
                    <p className="cert-card-issuer">{cert.issuer}</p>
                    {cert.issueDate && (
                      <span className="cert-card-date">Issued: {cert.issueDate}</span>
                    )}
                    <div className="cert-card-footer">
                      <span className={`cert-card-badge ${cert.category === 'Licensed' ? 'licensed' : ''}`}>
                        {cert.category}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedCert && (
        <div className="cert-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedCert(null)}>
          <div className="cert-modal glass-card">
            <button className="cert-modal-close" onClick={() => setSelectedCert(null)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="cert-modal-content">
              <div className="cert-modal-image">
                {selectedCert.image ? (
                  <img src={getFileUrl(selectedCert.image)} alt={selectedCert.title} />
                ) : (
                  <div className="cert-modal-no-image">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="cert-modal-info">
                <div className="cert-modal-badges">
                  <span className={`badge ${selectedCert.category === 'Licensed' ? 'badge-licensed' : ''}`}>
                    {selectedCert.category}
                  </span>
                  {selectedCert.priority && <span className="badge">Featured</span>}
                </div>
                <h2 className="cert-modal-title">{selectedCert.title}</h2>
                {selectedCert.description && (
                  <p className="cert-modal-desc">{selectedCert.description}</p>
                )}
                <div className="cert-modal-details">
                  <div className="cert-modal-detail">
                    <span className="detail-label">Issued By</span>
                    <span className="detail-value">{selectedCert.issuer}</span>
                  </div>
                  {selectedCert.issueDate && (
                    <div className="cert-modal-detail">
                      <span className="detail-label">Issue Date</span>
                      <span className="detail-value">{selectedCert.issueDate}</span>
                    </div>
                  )}
                  {selectedCert.expiryDate && (
                    <div className="cert-modal-detail">
                      <span className="detail-label">Expiry Date</span>
                      <span className="detail-value">{selectedCert.expiryDate}</span>
                    </div>
                  )}
                  {selectedCert.key && (
                    <div className="cert-modal-detail">
                      <span className="detail-label">Credential ID</span>
                      <span className="detail-value credential-id">{selectedCert.key}</span>
                    </div>
                  )}
                </div>
                {selectedCert.certLink && selectedCert.certLink !== '#' && (
                  <a
                    href={selectedCert.certLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium btn-premium-primary cert-modal-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Verify Credential
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationsPage;