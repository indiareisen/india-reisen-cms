import { useState } from 'react';

const Header = ({ setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'website-home' },
    { label: 'Journeys', id: 'website-journeys' },
    { label: 'Blog', id: 'website-blog' },
    { label: 'Contact', id: 'website-contact' }
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('website-home')}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png"
            alt="India Reisen"
            className="h-12 object-contain"
          />
          <span className="font-bold text-lg text-gray-800 hidden sm:inline">India Reisen</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className="text-gray-700 font-medium hover:text-pink-600 transition"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <button
          style={{ backgroundColor: '#d1356f' }}
          className="hidden md:block px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Book Now
        </button>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 text-2xl"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-50 p-4 space-y-2 border-t">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              {link.label}
            </button>
          ))}
          <button
            style={{ backgroundColor: '#d1356f' }}
            className="w-full px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition mt-4"
          >
            Book Now
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
