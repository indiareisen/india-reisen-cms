import { useState } from 'react';

const Header = ({ setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('website-home')}
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <img
            src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png"
            alt="India Reisen"
            className="h-7 object-contain"
          />
          <span className="hidden sm:inline text-sm font-semibold text-gray-900">India Reisen</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-12">
          <button onClick={() => setActiveTab('website-home')} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition">Home</button>
          <button onClick={() => setActiveTab('website-journeys')} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition">Journeys</button>
          <button onClick={() => setActiveTab('website-blog')} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition">Blog</button>
          <button onClick={() => setActiveTab('website-contact')} className="text-sm font-medium text-gray-700 hover:text-pink-600 transition">Contact</button>
        </nav>

        {/* CTA */}
        <button style={{ backgroundColor: '#d1356f' }} className="hidden md:block px-6 py-2 text-white text-sm rounded-lg font-semibold hover:opacity-90">Book Now</button>

        {/* Mobile Menu */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700 text-lg">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 p-4 space-y-2 border-t">
          <button onClick={() => {setActiveTab('website-home'); setMobileMenuOpen(false);}} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded">Home</button>
          <button onClick={() => {setActiveTab('website-journeys'); setMobileMenuOpen(false);}} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded">Journeys</button>
          <button onClick={() => {setActiveTab('website-blog'); setMobileMenuOpen(false);}} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded">Blog</button>
          <button onClick={() => {setActiveTab('website-contact'); setMobileMenuOpen(false);}} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded">Contact</button>
        </div>
      )}
    </header>
  );
};

export default Header;
