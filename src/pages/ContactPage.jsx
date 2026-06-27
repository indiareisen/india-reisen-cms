import { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us!');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div style={{ background: `linear-gradient(135deg, #d1356f 0%, #D4A574 100%)` }} className="text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl opacity-95">Have questions? We'd love to hear from you!</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 py-16">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <p className="text-4xl">📍</p>
              <div>
                <h3 className="font-bold text-gray-900">Address</h3>
                <p className="text-gray-600">Ghaziabad, Uttar Pradesh, India</p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-4xl">📧</p>
              <div>
                <h3 className="font-bold text-gray-900">Email</h3>
                <p className="text-gray-600">team@indiareisen.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-4xl">📱</p>
              <div>
                <h3 className="font-bold text-gray-900">Phone</h3>
                <p className="text-gray-600">+91 98108 27785</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your Email" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Your Message" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg" />
            <button type="submit" style={{ background: `linear-gradient(135deg, #d1356f, #D4A574)` }} className="w-full text-white font-bold py-3 rounded-lg hover:shadow-lg">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
