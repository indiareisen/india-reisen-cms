import { useState } from 'react';

const Header = ({ setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setActiveTab('website-home')}
          className="flex items-center gap-0 hover:opacity-80 transition"
        >
          <img
            src="https://res.cloudinary.com/dl1q4dw72/image/upload/c_scale,w_120/v1781181114/final-logo_fqu772.png"
            alt="India Reisen"
            className="h-12"
          />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => setActiveTab('website-home')} className="text-gray-700 font-medium hover:text-pink-600">Home</button>
          <button onClick={() => setActiveTab('website-journeys')} className="text-gray-700 font-medium hover:text-pink-600">Journeys</button>
          <button onClick={() => setActiveTab('website-blog')} className="text-gray-700 font-medium hover:text-pink-600">Blog</button>
          <button onClick={() => setActiveTab('website-contact')} className="text-gray-700 font-medium hover:text-pink-600">Contact</button>
        </nav>

        {/* CTA */}
        <button style={{ backgroundColor: '#d1356f' }} className="hidden md:block px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90">
          Book Now
        </button>

        {/* Mobile */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-700 text-2xl">
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 p-4 space-y-2 border-t">
          <button onClick={() => {setActiveTab('website-home'); setMobileMenuOpen(false);}} className="block w-full text-left p-2 hover:bg-gray-200 rounded">Home</button>
          <button onClick={() => {setActiveTab('website-journeys'); setMobileMenuOpen(false);}} className="block w-full text-left p-2 hover:bg-gray-200 rounded">Journeys</button>
          <button onClick={() => {setActiveTab('website-blog'); setMobileMenuOpen(false);}} className="block w-full text-left p-2 hover:bg-gray-200 rounded">Blog</button>
          <button onClick={() => {setActiveTab('website-contact'); setMobileMenuOpen(false);}} className="block w-full text-left p-2 hover:bg-gray-200 rounded">Contact</button>
        </div>
      )}
    </header>
  );
};

export default Header;
