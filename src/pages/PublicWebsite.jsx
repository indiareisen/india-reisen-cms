import { useState } from 'react';
import HomePage from './HomePage';
import JourneysPage from './JourneysPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';

const PublicWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'journeys': return <JourneysPage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png" alt="India Reisen" className="h-10" />
            <span className="text-2xl font-bold text-pink-600">India Reisen</span>
          </div>

          <nav className="hidden md:flex gap-8">
            {[
              { id: 'home', label: 'Home' },
              { id: 'journeys', label: 'Journeys' },
              { id: 'about', label: 'About' },
              { id: 'contact', label: 'Contact' },
            ].map(item => (
              <button key={item.id} onClick={() => setCurrentPage(item.id)} className={`font-semibold transition ${currentPage === item.id ? 'text-pink-600' : 'text-gray-700 hover:text-pink-600'}`}>
                {item.label}
              </button>
            ))}
          </nav>

          <a href="https://wa.me/919810827785" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600 transition">
            💬 WhatsApp
          </a>
        </div>
      </header>

      <main className="flex-1">
        {renderPage()}
      </main>

      <footer style={{ background: `linear-gradient(135deg, #1a1a1a 0%, #333 100%)` }} className="text-white py-12 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">India Reisen</h3>
            <p className="text-gray-400">Authentic journeys. Immersive experiences.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><button onClick={() => setCurrentPage('journeys')} className="hover:text-white">Journeys</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-white">About</button></li>
              <li><button onClick={() => setCurrentPage('contact')} className="hover:text-white">Contact</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <p className="text-gray-400">📧 team@indiareisen.com</p>
            <p className="text-gray-400">📱 +91 98108 27785</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Follow</h3>
            <div className="flex gap-3">
              {['f', '📷', '🐦'].map((icon, idx) => (
                <button key={idx} className="w-10 h-10 rounded-full bg-pink-600 hover:bg-pink-700">
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2026 India Reisen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicWebsite;
