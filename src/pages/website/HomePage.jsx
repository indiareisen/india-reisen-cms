import { useState, useEffect } from 'react';
import { getSetting } from '../../services/firebaseService';
import WebsiteLayout from './WebsiteLayout';

const HomePage = ({ setActiveTab }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSetting('websiteSettings');
      setSettings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '3d1e8f82-8b9c-4c3f-9e2a-5c7d9b1f4e6a',
          email: newsletterEmail,
          subject: 'Newsletter Signup',
          message: `New newsletter subscriber: ${newsletterEmail}`,
          from_name: 'India Reisen Newsletter',
          to_email: 'team@indiareisen.com'
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewsletterMessage({ type: 'success', text: '✅ Subscribed! Check your email.' });
        setNewsletterEmail('');
        setTimeout(() => setNewsletterMessage(''), 3000);
      } else {
        setNewsletterMessage({ type: 'error', text: '❌ Failed to subscribe.' });
      }
    } catch (error) {
      setNewsletterMessage({ type: 'error', text: '❌ Error subscribing.' });
    } finally {
      setNewsletterLoading(false);
    }
  };

  if (loading) return <WebsiteLayout setActiveTab={setActiveTab}><div className="text-center py-20">Loading...</div></WebsiteLayout>;
  if (!settings) return <WebsiteLayout setActiveTab={setActiveTab}><div className="text-center py-20">No data</div></WebsiteLayout>;

  return (
    <WebsiteLayout setActiveTab={setActiveTab}>
      {/* Hero */}
      <div className="relative w-full bg-gray-900 overflow-hidden">
        <img src={settings.heroImage} alt="Hero" className="w-full h-96 object-cover opacity-60" />
        <div className="absolute inset-0 flex flex-col justify-center items-start px-6 md:px-12">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{settings.heroTitle}</h1>
            <p className="text-lg text-gray-200 mb-6">{settings.heroDescription}</p>
            <button style={{ backgroundColor: '#d1356f' }} className="px-8 py-3 rounded-lg text-white font-semibold hover:opacity-90">
              {settings.ctaButton}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Offers */}
      {settings.banners?.length > 0 && (
        <div className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Featured Offers</h2>
              <p className="text-gray-600 text-sm mt-2">Curated travel experiences</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.banners.map((banner) => (
                <div key={banner.id} className="relative h-64 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition group">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent flex items-end p-6 text-white">
                    <div>
                      <h3 className="text-xl font-bold">{banner.title}</h3>
                      <p className="text-sm text-gray-200">{banner.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div style={{ background: 'linear-gradient(135deg, #d1356f 0%, #e84a7f 100%)' }} className="py-16 px-6 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg mb-8 text-pink-100">Get travel tips, exclusive offers, and journey inspiration</p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 mb-4">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              disabled={newsletterLoading}
              style={{ backgroundColor: '#D4A574' }}
              className="px-6 py-3 rounded-lg text-gray-900 font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {newsletterLoading ? '...' : 'Subscribe'}
            </button>
          </form>

          {newsletterMessage.text && (
            <p className={`text-sm ${newsletterMessage.type === 'success' ? 'text-green-100' : 'text-red-100'}`}>
              {newsletterMessage.text}
            </p>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(to right, #d1356f, #e84a7f)' }} className="py-16 px-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore India?</h2>
          <p className="text-lg mb-6">Experience authentic culture and heritage</p>
          <button style={{ backgroundColor: '#D4A574' }} className="px-8 py-3 rounded-lg text-gray-900 font-semibold hover:opacity-90">
            Start Your Journey
          </button>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default HomePage;
