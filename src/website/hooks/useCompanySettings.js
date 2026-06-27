import { useState, useEffect } from 'react';
import { getSetting } from '../../services/firebaseService';

const useCompanySettings = () => {
  const [settings, setSettings] = useState({
    companyName: 'India Reisen',
    email: 'team@indiareisen.com',
    phone: '+91 98108 27785',
    address: 'Ghaziabad, Uttar Pradesh, India',
    website: 'www.indiareisen.com',
    instagram: 'https://instagram.com/indiareisen',
    facebook: 'https://facebook.com/indiareisen',
    twitter: 'https://twitter.com/indiareisen',
    youtube: 'https://youtube.com/indiareisen',
    logo: 'https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png',
    primaryColor: '#d1356f',
    accentColor: '#D4A574'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSetting('companySettings');
      if (data) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  return settings;
};

export default useCompanySettings;
