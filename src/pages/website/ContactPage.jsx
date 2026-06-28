import { useState } from 'react';
import WebsiteLayout from './WebsiteLayout';

const ContactPage = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send via Web3Forms (free, no signup needed)
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '3d1e8f82-8b9c-4c3f-9e2a-5c7d9b1f4e6a', // Public key
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          from_name: 'India Reisen Contact Form',
          to_email: 'team@indiareisen.com'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: '✅ Message sent! We\'ll reply within 24 hours.' });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setMessage(''), 4000);
      } else {
        setMessage({ type: 'error', text: '❌ Failed to send message.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error sending message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WebsiteLayout setActiveTab={setActiveTab}>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get In Touch</h1>
          <p className="text-gray-600 text-center mb-12">We'd love to hear from you. Send us a message!</p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  rows="6" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 resize-none"
                  placeholder="Tell us about your travel plans..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ backgroundColor: '#d1356f' }} 
                className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>📧 team@indiareisen.com</p>
                <p>📱 +91 98108 27785</p>
                <p>📍 New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default ContactPage;
