const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-8">
          <div>
            <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png" alt="India Reisen" className="h-6 mb-3" />
            <p className="text-xs text-gray-500">Explore Experience Enchant - Authentic Indian journeys</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold mb-3 uppercase">Explore</h4>
            <ul className="text-xs space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-pink-600">Home</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-600">Journeys</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-600">Blog</a></li>
              <li><a href="#" className="text-gray-500 hover:text-pink-600">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold mb-3 uppercase">Contact</h4>
            <ul className="text-xs text-gray-500 space-y-2">
              <li>team@indiareisen.com</li>
              <li>+91 98108 27785</li>
              <li>New Delhi, India</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold mb-3 uppercase">Follow</h4>
            <div className="flex gap-2">
              <a href="#" className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-xs hover:bg-pink-600">f</a>
              <a href="#" className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-xs hover:bg-pink-600">📷</a>
              <a href="#" className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-xs hover:bg-pink-600">𝕏</a>
              <a href="#" className="w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center text-xs hover:bg-pink-600">▶</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-600">
          <p>&copy; 2026 India Reisen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
