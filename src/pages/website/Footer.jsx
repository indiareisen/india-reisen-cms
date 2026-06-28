const Footer = () => {
  const logoUrl = 'https://res.cloudinary.com/dl1q4dw72/image/upload/w_28,h_28,c_scale/v1781181114/final-logo_fqu772.png';

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-400 border-t-2" style={{ borderTopColor: '#d1356f' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <img src={logoUrl} alt="India Reisen" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">India Reisen</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Luxury bespoke journeys into authentic Indian culture, heritage, and timeless charm.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold mb-4 uppercase tracking-widest">Explore</h4>
            <ul className="text-xs space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Journeys</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold mb-4 uppercase tracking-widest">Contact</h4>
            <ul className="text-xs text-gray-500 space-y-3">
              <li className="hover:text-gray-300 transition">📧 team@indiareisen.com</li>
              <li className="hover:text-gray-300 transition">📱 +91 98108 27785</li>
              <li className="hover:text-gray-300 transition">📍 New Delhi, India</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white text-xs font-bold mb-4 uppercase tracking-widest">Follow Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-xs transition transform hover:scale-110">f</a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-xs transition transform hover:scale-110">📷</a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-xs transition transform hover:scale-110">𝕏</a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center text-xs transition transform hover:scale-110">▶</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-600">&copy; 2026 India Reisen. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <a href="#" className="text-gray-600 hover:text-pink-500 transition">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
