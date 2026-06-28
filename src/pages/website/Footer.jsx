const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <img
              src="https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png"
              alt="India Reisen"
              className="h-12 mb-4"
            />
            <p className="text-sm">Explore Experience Enchant - Your journey into authentic Indian culture</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-pink-600 transition">Home</a></li>
              <li><a href="#" className="hover:text-pink-600 transition">Journeys</a></li>
              <li><a href="#" className="hover:text-pink-600 transition">Blog</a></li>
              <li><a href="#" className="hover:text-pink-600 transition">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 team@indiareisen.com</li>
              <li>📱 +91 98108 27785</li>
              <li>📍 Delhi, India</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-pink-600 transition">📘</a>
              <a href="#" className="hover:text-pink-600 transition">📷</a>
              <a href="#" className="hover:text-pink-600 transition">𝕏</a>
              <a href="#" className="hover:text-pink-600 transition">▶️</a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Copyright */}
        <div className="text-center text-sm">
          <p>&copy; 2026 India Reisen. All rights reserved. | Explore Experience Enchant</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
