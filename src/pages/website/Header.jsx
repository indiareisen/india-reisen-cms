import { useState } from 'react';

const Header = ({ setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoUrl = 'https://res.cloudinary.com/dl1q4dw72/image/upload/w_32,h_32,c_scale/v1781181114/final-logo_fqu772.png';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2" style={{ borderBottomColor: '#d1356f' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <button
          onClick={() => setActiveTab('website-home')}
          className="flex items-center gap-3 hover:opacity-90 transition flex-shrink-0 group"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition">
            <img src={logoUrl} alt="India Reisen" className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900">India Reisen</p>
            <p className="text-xs text-pink-600 font-semibold">Explore • Experience • Enchant</p>
          </div>
        </button>

        {/* Desktop Nav */}
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
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <button
          style={{ backgroundColor: '#d1356f', boxShadow: '0 4px 12px rgba(209, 53, 111, 0.3)' }}
          className="hidden md:block px-6 py-2 text-white text-sm font-bold rounded-lg hover:opacity-90 hover:shadow-lg transition flex-shrink-0"
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
        <div className="md:hidden bg-gray-50 border-t-2" style={{ borderTopColor: '#d1356f' }}>
          <div className="px-6 py-4 space-y-3">
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
                className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-pink-600 hover:bg-white rounded-lg transition"
              >
                {item.label}
              </button>
            ))}
            <button
              style={{ backgroundColor: '#d1356f' }}
              className="w-full px-4 py-2 text-white text-sm font-bold rounded-lg hover:opacity-90 transition mt-2"
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
