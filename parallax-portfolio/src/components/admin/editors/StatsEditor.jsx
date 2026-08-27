import React from 'react';

const StatsEditor = ({ stats }) => {
  return (
    <div className="admin-section-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0 }}>Portfolio Metrics</h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center',
            transition: 'all 0.3s'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #00f2ff, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.5rem'
            }}>
              {stat.value}
            </div>
            <div style={{
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsEditor;