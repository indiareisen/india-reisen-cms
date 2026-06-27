const Footer = ({ onNavClick }) => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6 border-t-2 border-gray-800">
      <div className="max-w-5xl mx-auto">
        {/* FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* ABOUT */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">India Reisen</h3>
            <p className="text-sm leading-relaxed">Authentic, immersive journeys across India, Nepal, Bhutan & Sri Lanka</p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => onNavClick('home')} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => onNavClick('journeys')} className="hover:text-white transition">Journeys</button></li>
              <li><button onClick={() => onNavClick('about')} className="hover:text-white transition">About</button></li>
              <li><button onClick={() => onNavClick('contact')} className="hover:text-white transition">Contact</button></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 team@indiareisen.com</li>
              <li>📱 +91 98108 27785</li>
              <li>
                <a href="https://wa.me/919810827785" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                  💬 WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white transition">f</a>
              <a href="#" className="w-10 h-10 rounded-lg bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white transition">📷</a>
              <a href="#" className="w-10 h-10 rounded-lg bg-pink-600 hover:bg-pink-700 flex items-center justify-center text-white transition">🐦</a>
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; 2026 India Reisen. All rights reserved. | Explore. Experience. Enchant.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
