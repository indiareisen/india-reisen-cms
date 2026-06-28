import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import WebsiteLayout from './WebsiteLayout';

const ContactPage = ({ setActiveTab }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Validate email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Validate phone format (India)
  const isValidPhone = (phone) => {
    if (!phone) return true; // Optional field
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number (at least 10 digits)';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message should be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ type: 'error', text: '❌ Please fix the errors above' });
      return;
    }

    setLoading(true);

    try {
      // Save to Firebase with verification status
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
        emailVerified: false,
        phoneVerified: formData.phone ? false : null,
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: '✅ Message sent! We\'ll reply within 24 hours.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setMessage(''), 4000);
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: '❌ Error sending message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WebsiteLayout setActiveTab={setActiveTab}>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get In Touch</h1>
          <p className="text-gray-600 text-center mb-12">We'd love to hear from you. Send us a message!</p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name * 
                  {errors.name && <span className="text-red-600 ml-2 text-xs">{errors.name}</span>}
                </label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address * 
                  {errors.email && <span className="text-red-600 ml-2 text-xs">{errors.email}</span>}
                </label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">✓ Must be a valid email format</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                  {errors.phone && <span className="text-red-600 ml-2 text-xs">{errors.phone}</span>}
                </label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="+91 98108 27785"
                />
                <p className="text-xs text-gray-500 mt-1">✓ At least 10 digits (optional)</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message * 
                  {errors.message && <span className="text-red-600 ml-2 text-xs">{errors.message}</span>}
                </label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows="6" 
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Tell us about your travel plans... (minimum 10 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">✓ Minimum 10 characters</p>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                style={{ backgroundColor: '#d1356f' }} 
                className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Validation Checks</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Email format validation</li>
                <li>✓ Phone number format (10+ digits)</li>
                <li>✓ Message length check (min 10 chars)</li>
                <li>✓ All required fields checked</li>
              </ul>
            </div>

            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">Other Ways to Reach Us</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>📧 team@indiareisen.com</p>
                <p>📱 +91 98108 27785</p>
                <p>📍 New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default ContactPage;
