const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-950 to-black text-gray-400 border-t-2" style={{ borderTopColor: '#d1356f' }}>
      <div className="max-w-7xl mx-auto px-8 py-20">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">IR</span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">India Reisen</p>
                <p className="text-xs text-pink-500">Luxury Journeys</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Curated luxury journeys into the authentic heart of India's culture, heritage, and timeless beauty.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white text-xs font-bold mb-6 uppercase tracking-wider">Explore</h4>
            <ul className="text-sm space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Journeys</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-500 transition font-medium">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-bold mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="text-sm text-gray-500 space-y-4">
              <li className="hover:text-gray-300 transition cursor-pointer">📧 team@indiareisen.com</li>
              <li className="hover:text-gray-300 transition cursor-pointer">📱 +91 98108 27785</li>
              <li className="hover:text-gray-300 transition cursor-pointer">📍 New Delhi, India</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white text-xs font-bold mb-6 uppercase tracking-wider">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-pink-600 rounded-xl flex items-center justify-center transition transform hover:scale-110 text-sm font-bold text-white shadow-lg">f</a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-pink-600 rounded-xl flex items-center justify-center transition transform hover:scale-110 text-base shadow-lg">📷</a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-pink-600 rounded-xl flex items-center justify-center transition transform hover:scale-110 text-sm shadow-lg">𝕏</a>
              <a href="#" className="w-10 h-10 bg-gray-900 hover:bg-pink-600 rounded-xl flex items-center justify-center transition transform hover:scale-110 text-sm shadow-lg">▶</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-12"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-600">&copy; 2026 India Reisen. All rights reserved. Explore Experience Enchant.</p>
          <div className="flex gap-8 text-xs">
            <a href="#" className="text-gray-600 hover:text-pink-500 transition font-medium">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition font-medium">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition font-medium">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
