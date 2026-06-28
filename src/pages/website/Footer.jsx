const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <img src="https://res.cloudinary.com/dl1q4dw72/image/upload/c_scale,w_100/v1781181114/final-logo_fqu772.png" alt="India Reisen" className="h-10 mb-4" />
            <p className="text-sm text-gray-500">Luxury bespoke journeys into authentic India</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-4">Explore</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Journeys</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>team@indiareisen.com</li>
              <li>+91 98108 27785</li>
              <li>New Delhi, India</li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-4">Follow</p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600">f</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600">📷</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600">𝕏</a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center hover:bg-pink-600">▶</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 India Reisen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
