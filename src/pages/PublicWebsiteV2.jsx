import { useState } from 'react';
import HomePage from './HomePage';
import JourneysPageWithBooking from './JourneysPageWithBooking';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import Footer from '../components/public/Footer';

const PublicWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'journeys': return <JourneysPageWithBooking />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'journeys', label: 'Journeys' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER - CLEAN & MINIMAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6" style={{ height: '60px', display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
          
          {/* LOGO + BRANDING */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => handleNavClick('home')}>
            <img 
              src="https://res.cloudinary.com/dl1q4dw72/image/upload/c_scale,w_28/v1781181114/final-logo_fqu772.png" 
              alt="India Reisen"
              style={{ height: '28px', width: '28px', objectFit: 'contain' }}
            />
            <span className="hidden sm:inline text-sm font-bold text-slate-900">India Reisen</span>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex gap-8 ml-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="text-sm font-medium transition bg-none border-none cursor-pointer"
                style={{
                  color: currentPage === item.id ? '#d1356f' : '#64748b'
                }}
                onMouseOver={(e) => e.target.style.color = '#d1356f'}
                onMouseOut={(e) => e.target.style.color = currentPage === item.id ? '#d1356f' : '#64748b'}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA BUTTONS */}
          <div className="flex gap-2 items-center">
            <a 
              href="https://wa.me/919810827785" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:block px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition"
            >
              💬
            </a>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-900 bg-none border-none cursor-pointer text-xl"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-3 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block w-full text-left px-3 py-2 rounded text-sm font-medium bg-none border-none cursor-pointer"
                style={{
                  background: currentPage === item.id ? '#fce7f3' : 'transparent',
                  color: currentPage === item.id ? '#d1356f' : '#64748b'
                }}
              >
                {item.label}
              </button>
            ))}
            <a 
              href="https://wa.me/919810827785" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center bg-green-600 text-white px-3 py-2 rounded text-xs font-bold hover:bg-green-700 transition mt-2"
            >
              💬 WhatsApp
            </a>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* FOOTER */}
      <Footer onNavClick={handleNavClick} />
    </div>
  );
};

export default PublicWebsite;
