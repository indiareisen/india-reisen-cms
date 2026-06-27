import React, { useState } from 'react';
import useCompanySettings from '../hooks/useCompanySettings.js';

const ContactPage = () => {
  const settings = useCompanySettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    destination: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', destination: '', message: '' });
  };

  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ backgroundImage: `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.accentColor} 100%)`, color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>Get In Touch</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>Have questions about our journeys? We'd love to hear from you and help craft your perfect India experience.</p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          {/* Contact Form */}
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#333', marginBottom: '2rem' }}>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Interested Destination</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g., Varanasi, Jaipur, Udaipur..." style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>Message *</label>
                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '1rem', backgroundColor: settings.primaryColor, color: 'white', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer' }}>Send Message</button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#333', marginBottom: '2rem' }}>Contact Information</h2>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: settings.primaryColor, marginBottom: '0.5rem' }}>📧 Email</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>{settings.email}</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: settings.primaryColor, marginBottom: '0.5rem' }}>📞 Phone</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>{settings.phone}</p>
              <p style={{ color: '#999', fontSize: '0.85rem', marginTop: '0.5rem' }}>Monday - Friday, 9:00 AM - 6:00 PM IST</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: settings.primaryColor, marginBottom: '0.5rem' }}>📍 Address</h3>
              <p style={{ color: '#666', fontSize: '0.95rem' }}>{settings.address}</p>
            </div>

            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: settings.primaryColor, marginBottom: '1rem' }}>📱 Follow Us</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', textDecoration: 'none' }}>📸</a>
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', textDecoration: 'none' }}>👥</a>
                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', textDecoration: 'none' }}>𝕏</a>
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" style={{ fontSize: '2rem', textDecoration: 'none' }}>▶️</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
