import { useState } from 'react';

const Header = ({ setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => setActiveTab('website-home')}
          className="flex items-center gap-3 hover:opacity-90 transition flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">IR</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-4">India Reisen</p>
            <p className="text-xs text-pink-600 font-semibold">Luxury Journeys</p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Home', id: 'website-home' },
            { label: 'Journeys', id: 'website-journeys' },
            { label: 'Blog', id: 'website-blog' },
            { label: 'Contact', id: 'website-contact' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="px-5 py-2 text-sm font-semibold text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <button
          style={{ background: 'linear-gradient(135deg, #d1356f 0%, #e84a7f 100%)', boxShadow: '0 4px 15px rgba(209, 53, 111, 0.3)' }}
          className="hidden md:block px-7 py-2.5 text-white text-sm font-bold rounded-lg hover:shadow-lg transition transform hover:scale-105 flex-shrink-0"
        >
          Book Now
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 text-2xl flex-shrink-0 hover:text-pink-600 transition"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="px-6 py-6 space-y-3">
            {[
              { label: 'Home', id: 'website-home' },
              { label: 'Journeys', id: 'website-journeys' },
              { label: 'Blog', id: 'website-blog' },
              { label: 'Contact', id: 'website-contact' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:text-pink-600 hover:bg-white rounded-lg transition"
              >
                {item.label}
              </button>
            ))}
            <button
              style={{ background: 'linear-gradient(135deg, #d1356f 0%, #e84a7f 100%)' }}
              className="w-full px-4 py-3 text-white text-sm font-bold rounded-lg hover:shadow-lg transition mt-4"
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
