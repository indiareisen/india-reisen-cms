import React from 'react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '4rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem', paddingBottom: '3rem', borderBottom: '1px solid #333' }}>
          {/* Company Info */}
          <div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', color: '#D4A574' }}>India Reisen</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#ccc', marginBottom: '1rem' }}>Crafting immersive journeys into the rich heritage and timeless charm of India through authentic, responsible travel experiences.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://instagram.com/indiareisen" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>📸</a>
              <a href="https://facebook.com/indiareisen" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>👥</a>
              <a href="https://twitter.com/indiareisen" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>𝕏</a>
              <a href="https://youtube.com/indiareisen" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '50%', color: 'white', textDecoration: 'none', fontSize: '1.2rem' }}>▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#D4A574' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>🏠 Home</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>🌍 Journeys</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>📝 Blog</a></li>
              <li style={{ marginBottom: '0.75rem' }}><a href="#" style={{ color: '#ccc', textDecoration: 'none' }}>👥 About Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#D4A574' }}>Contact Us</h4>
            <div style={{ fontSize: '0.9rem', lineHeight: '1.8', color: '#ccc' }}>
              <p>📧 team@indiareisen.com</p>
              <p>📞 +91 98108 27785</p>
              <p>📍 Ghaziabad, Uttar Pradesh, India</p>
              <p style={{ marginTop: '1rem' }}>🌐 www.indiareisen.com</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.5rem', color: '#D4A574' }}>Newsletter</h4>
            <p style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '1rem' }}>Subscribe for travel tips and exclusive offers</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email" style={{ flex: 1, padding: '0.75rem', border: '1px solid #333', borderRadius: '4px', backgroundColor: '#222', color: 'white' }} />
              <button style={{ padding: '0.75rem 1rem', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}>Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid #333', color: '#999', fontSize: '0.9rem' }}>
          <p>© 2024 India Reisen. All rights reserved. | Crafting Immersive Journeys into India's Heart</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
