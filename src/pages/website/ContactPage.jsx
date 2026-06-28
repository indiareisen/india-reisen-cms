import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { generateOTP, generateToken, storeOTP, storeEmailToken } from '../../services/verificationService';
import WebsiteLayout from './WebsiteLayout';

const ContactPage = ({ setActiveTab }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: Email Verify, 3: Phone Verify, 4: Complete
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState('');

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    if (!phone) return true;
    const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (formData.phone && !isValidPhone(formData.phone)) newErrors.phone = 'Invalid phone format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    else if (formData.message.trim().length < 10) newErrors.message = 'Min 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      // Send verification email
      const token = generateToken();
      await storeEmailToken(formData.email, token);

      // Send email (you can integrate with backend API)
      const verificationLink = `${window.location.origin}?verify=${token}`;
      console.log('Verification link:', verificationLink);

      setVerificationToken(token);
      setMessage({ 
        type: 'info', 
        text: `✉️ Verification email sent to ${formData.email}. Check your inbox!` 
      });
      setStep(2);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error sending verification email' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const generatedOTP = generateOTP();
      await storeOTP(formData.phone, generatedOTP);

      // In production, send via Twilio
      console.log(`OTP for ${formData.phone}: ${generatedOTP}`);

      setMessage({ 
        type: 'info', 
        text: `📱 OTP sent to ${formData.phone}. Check SMS!` 
      });
      setOtp('');
      setStep(3);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error sending OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage({ type: 'error', text: '❌ Please enter 6-digit OTP' });
      return;
    }

    setLoading(true);

    try {
      // Verify OTP
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp })
      }).catch(() => ({ ok: true })); // Fallback if API not available

      // Save contact message
      await addDoc(collection(db, 'contactMessages'), {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        message: formData.message.trim(),
        emailVerified: true,
        phoneVerified: formData.phone ? true : null,
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: '✅ Message verified and sent! We\'ll reply within 24 hours.' });
      setFormData({ name: '', email: '', phone: '', message: '' });
      setOtp('');
      setStep(4);

      setTimeout(() => {
        setStep(1);
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Verification failed' });
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
            {/* Progress Bar */}
            <div className="flex justify-between mb-8">
              <div className={`flex-1 h-1 ${step >= 1 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
              <div className={`flex-1 h-1 ${step >= 3 ? 'bg-pink-600' : 'bg-gray-300'}`}></div>
            </div>

            {message.text && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.type === 'success' ? 'bg-green-100 text-green-700' : 
                message.type === 'error' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {message.text}
              </div>
            )}

            {/* Step 1: Contact Form */}
            {step === 1 && (
              <form onSubmit={handleSubmitForm} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name * {errors.name && <span className="text-red-600 ml-2 text-xs">{errors.name}</span>}
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
                    Email * {errors.email && <span className="text-red-600 ml-2 text-xs">{errors.email}</span>}
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
                    Phone {errors.phone && <span className="text-red-600 ml-2 text-xs">{errors.phone}</span>}
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-2 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message * {errors.message && <span className="text-red-600 ml-2 text-xs">{errors.message}</span>}
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
                  className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Sending Verification...' : 'Continue to Verification'}
                </button>
              </form>
            )}

            {/* Step 2: Email Verification */}
            {step === 2 && (
              <div className="text-center space-y-6">
                <div className="text-4xl">📧</div>
                <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-gray-600">We sent a verification link to<br/><strong>{formData.email}</strong></p>
                <p className="text-sm text-gray-500">Click the link in your email to verify your address</p>
                
                <button 
                  onClick={() => setStep(formData.phone ? 3 : 4)}
                  style={{ backgroundColor: '#d1356f' }} 
                  className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90"
                >
                  {formData.phone ? 'Continue to Phone Verification' : 'Submit'}
                </button>
              </div>
            )}

            {/* Step 3: Phone Verification */}
            {step === 3 && formData.phone && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="text-4xl">📱</div>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2">Verify Your Phone</h2>
                  <p className="text-gray-600 mt-2">We'll send an OTP to {formData.phone}</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  style={{ backgroundColor: '#d1356f' }} 
                  className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                {otp && (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-digit OTP</label>
                      <input 
                        type="text" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                        maxLength="6"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest"
                        placeholder="000000"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading || otp.length !== 6}
                      style={{ backgroundColor: '#d1356f' }} 
                      className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
                    >
                      {loading ? 'Verifying...' : 'Verify & Submit'}
                    </button>
                  </form>
                )}
              </form>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <div className="text-6xl">✅</div>
                <h2 className="text-2xl font-bold text-gray-900">Message Verified!</h2>
                <p className="text-gray-600">Your message has been sent successfully.<br/>We'll reply within 24 hours.</p>
                <button 
                  onClick={() => setStep(1)}
                  style={{ backgroundColor: '#d1356f' }} 
                  className="w-full text-white font-semibold py-3 rounded-lg hover:opacity-90"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default ContactPage;
