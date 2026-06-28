const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img
              src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png"
              alt="India Reisen"
              className="h-8 mb-4"
            />
            <p className="text-xs leading-relaxed text-gray-500 max-w-xs">
              Explore Experience Enchant - Curated luxury journeys into the heart of authentic Indian culture and heritage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="text-gray-500 hover:text-pink-600 transition">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-600 transition">Journeys</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-600 transition">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-600 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li>team@indiareisen.com</li>
              <li>+91 98108 27785</li>
              <li>New Delhi, India</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Follow</h4>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm hover:bg-pink-600 transition">f</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm hover:bg-pink-600 transition">📷</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm hover:bg-pink-600 transition">𝕏</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm hover:bg-pink-600 transition">▶</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright & Legal */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; 2026 India Reisen. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400 transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
