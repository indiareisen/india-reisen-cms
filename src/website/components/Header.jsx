import React from 'react';

const Header = ({ setCurrentPage }) => {
  return (
    <header style={{ 
      backgroundColor: 'white', 
      padding: '1.5rem 2rem', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setCurrentPage('home')}>
          <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png" alt="India Reisen" style={{ height: '40px' }} />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#d1356f' }}>India Reisen</div>
            <div style={{ fontSize: '0.7rem', color: '#D4A574', fontWeight: '600', letterSpacing: '0.5px' }}>EXPLORE EXPERIENCE ENCHANT</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <button onClick={() => setCurrentPage('home')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#333', fontWeight: '500' }}>Home</button>
          <button onClick={() => setCurrentPage('journeys')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#333', fontWeight: '500' }}>Journeys</button>
          <button onClick={() => setCurrentPage('contact')} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#333', fontWeight: '500' }}>Contact</button>
          <button style={{ padding: '0.75rem 1.5rem', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Get Started</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
