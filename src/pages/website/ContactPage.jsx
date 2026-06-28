import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import WebsiteLayout from './WebsiteLayout';

const ContactPage = ({ setActiveTab }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => phone.replace(/\D/g, '').length >= 10;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.email.trim()) newErrors.email = 'Email required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email';
    if (formData.phone && !isValidPhone(formData.phone)) newErrors.phone = 'Invalid phone';
    if (!formData.message.trim() || formData.message.trim().length < 10) newErrors.message = 'Min 10 chars';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOTP);

      // Send SMS via Twilio
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: formData.phone.startsWith('+') ? formData.phone : `+91${formData.phone.replace(/\D/g, '')}`,
          otp: newOTP 
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: `✅ OTP sent to ${formData.phone}` });
      } else {
        setMessage({ type: 'error', text: '❌ Failed to send OTP' });
      }
      setStep(2);
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: '❌ Error sending OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (otp !== generatedOTP) {
      setMessage({ type: 'error', text: '❌ Wrong OTP' });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        emailVerified: true,
        phoneVerified: true,
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: '✅ Message sent!' });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setOtp('');
      setStep(3);

      setTimeout(() => {
        setStep(1);
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <WebsiteLayout setActiveTab={setActiveTab}>
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Get In Touch</h1>
          <p className="text-gray-600 text-center mb-12">We'd love to hear from you!</p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={handleSubmitForm} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name * {errors.name && <span className="text-red-600 text-xs ml-2">{errors.name}</span>}
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email * {errors.email && <span className="text-red-600 text-xs ml-2">{errors.email}</span>}
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone * {errors.phone && <span className="text-red-600 text-xs ml-2">{errors.phone}</span>}
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="+91 98108 27785"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message * {errors.message && <span className="text-red-600 text-xs ml-2">{errors.message}</span>}
                  </label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows="6" 
                    className={`w-full px-4 py-2 border rounded-lg ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{ backgroundColor: '#d1356f' }} 
                  className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">📱</div>
                  <h2 className="text-2xl font-bold">Verify Your Phone</h2>
                  <p className="text-gray-600 mt-2">OTP sent to {formData.phone}</p>
                </div>

                <div>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    maxLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-3xl tracking-widest font-mono"
                    placeholder="000000"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                  style={{ backgroundColor: '#d1356f' }} 
                  className="w-full text-white font-semibold py-3 rounded-lg disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify & Submit'}
                </button>

                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg"
                >
                  Back
                </button>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-6 py-8">
                <div className="text-6xl">✅</div>
                <h2 className="text-2xl font-bold">Message Sent!</h2>
                <p className="text-gray-600">We'll reply within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default ContactPage;
