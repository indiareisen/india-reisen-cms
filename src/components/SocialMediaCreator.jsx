import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const SocialMediaCreator = () => {
  const LOGO_URL = 'https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png';
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    pictureDetails: '',
    tone: 'immersive',
    imageData: null,
    watermark: true,
    logoWatermark: false
  });
  const [preview, setPreview] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [alert, setAlert] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const genericTemplates = {
    immersive: [`Step into {location}'s soul with {title}. Immersive experiences. {pictureDetails}`],
    authentic: [`Experience authentic {location} through {title}. Responsible travel. {pictureDetails}`],
    responsible: [`{title} in {location} means sustainable travel. {pictureDetails}`],
    luxe: [`Indulge in {location}'s elegance with {title}. Luxury experiences. {pictureDetails}`]
  };

  const hashtagBank = {
    immersive: ['#ImmersiveIndia', '#CulturalJourney', '#AuthenticTravel', '#IndiaReisen', '#ExploreExperienceEnchant', '#TransformativeTravel', '#LocalConnections', '#HeritageTravel'],
    authentic: ['#AuthenticIndia', '#ResponsibleTravel', '#CulturalHeritage', '#LocalCommunities', '#SustainableTravel', '#IndiaReisen', '#HeritageConservation', '#CulturalExchange'],
    responsible: ['#ResponsibleTravel', '#SustainableTourism', '#CommunityTourism', '#CulturalPride', '#HeritageConservation', '#IndiaReisen', '#EcoTravel', '#SocialImpact'],
    luxe: ['#LuxuryTravel', '#BoutiqueTravel', '#ExclusiveIndia', '#CuratedExperience', '#IndiaReisen', '#RefinedTravel', '#DiscerningTraveler', '#PremiumJourney']
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'x', name: 'X', icon: '𝕏' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'youtube', name: 'YouTube', icon: '▶️' },
    { id: 'threads', name: 'Threads', icon: '🧵' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, imageData: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateContent = () => {
    const { title, location, tone, pictureDetails } = formData;
    if (!title || !location) {
      setAlert({ type: 'error', message: 'Fill Title & Location' });
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const selectedTemplate = genericTemplates[tone][0];
      const caption = selectedTemplate.replace(/{title}/g, title).replace(/{location}/g, location).replace(/{pictureDetails}/g, pictureDetails || '');
      const hashtags = hashtagBank[tone].sort(() => Math.random() - 0.5).slice(0, 8);
      setPreview({ caption, hashtags, title, location });
      setIsGenerating(false);
      setAlert({ type: 'success', message: '✨ Generated!' });
    }, 600);
  };

  const saveToMedia = async () => {
    if (!preview || !formData.imageData) {
      setAlert({ type: 'error', message: 'Generate & upload image first' });
      return;
    }
    setIsSaving(true);
    try {
      const fullContent = `${preview.caption}\n\n${preview.hashtags.join(' ')}\n\n✨ Explore | Experience | Enchant 🇮🇳\nwww.indiareisen.com`;
      await addDoc(collection(db, 'social_posts'), {
        title: preview.title,
        location: preview.location,
        caption: fullContent,
        tone: formData.tone,
        hashtags: preview.hashtags,
        imageUrl: formData.imageData,
        createdAt: Timestamp.now()
      });
      setAlert({ type: 'success', message: '✨ Saved!' });
      setIsSaving(false);
    } catch (error) {
      setAlert({ type: 'error', message: `Error: ${error.message}` });
      setIsSaving(false);
    }
  };

  const downloadPost = () => {
    if (!preview || !formData.imageData) {
      setAlert({ type: 'error', message: 'Generate first' });
      return;
    }
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      if (formData.logoWatermark) {
        const logo = new Image();
        logo.onload = () => {
          ctx.drawImage(logo, 20, canvas.height - 60, 50, 50);
          finishDownload();
        };
        logo.src = LOGO_URL;
      } else {
        finishDownload();
      }
      function finishDownload() {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `post-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    };
    img.src = formData.imageData;
  };

  const togglePlatform = (id) => {
    setSelectedPlatforms({ ...selectedPlatforms, [id]: !selectedPlatforms[id] });
  };

  const shareSelected = () => {
    const selected = Object.keys(selectedPlatforms).filter(p => selectedPlatforms[p]);
    if (!selected.length || !preview) return;
    const fullContent = `${preview.caption}\n\n${preview.hashtags.join(' ')}\n\n✨ Explore | Experience | Enchant 🇮🇳`;
    navigator.clipboard.writeText(fullContent);
    setAlert({ type: 'success', message: 'Copied!' });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%' }}>
      <div style={{ overflow: 'auto', paddingRight: '1rem' }}>
        <h2 style={{ color: '#d1356f', fontSize: '18px', fontWeight: '700', marginBottom: '1rem' }}>📱 Social Creator</h2>
        {alert && <div style={{ padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px', background: alert.type === 'error' ? '#fee' : '#efe', color: alert.type === 'error' ? '#c33' : '#3c3' }}>{alert.message}</div>}
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%' }} />
          {formData.imageData && <img src={formData.imageData} style={{ maxHeight: '150px', marginTop: '0.5rem', borderRadius: '6px' }} alt="Preview" />}
        </div>

        <input type="text" placeholder="Experience Title *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px' }} />
        <input type="text" placeholder="Location *" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px' }} />
        <textarea placeholder="Picture Details" value={formData.pictureDetails} onChange={e => setFormData({ ...formData, pictureDetails: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px', minHeight: '80px' }} />

        <select value={formData.tone} onChange={e => setFormData({ ...formData, tone: e.target.value })} style={{ width: '100%', padding: '10px', marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '6px' }}>
          <option value="immersive">✨ Immersive</option>
          <option value="authentic">🎭 Authentic</option>
          <option value="responsible">🌱 Responsible</option>
          <option value="luxe">💎 Luxe</option>
        </select>

        <div style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem', background: '#fafafa' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '0.75rem' }}>Settings</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.watermark} onChange={e => setFormData({ ...formData, watermark: e.target.checked })} style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '13px' }}>Add text watermark</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.logoWatermark} onChange={e => setFormData({ ...formData, logoWatermark: e.target.checked })} style={{ cursor: 'pointer' }} />
            <span style={{ fontSize: '13px' }}>Add logo branding</span>
          </label>
        </div>

        <button onClick={generateContent} disabled={isGenerating} style={{ width: '100%', padding: '12px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', opacity: isGenerating ? 0.6 : 1 }}>
          {isGenerating ? '✨ Creating...' : '✨ Generate'}
        </button>
      </div>

      <div style={{ overflow: 'auto', paddingRight: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid #ddd' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '1rem' }}>📱 Preview</h2>
          {!preview ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999', fontStyle: 'italic' }}>👈 Fill & Generate</div>
          ) : (
            <div>
              {formData.imageData && (
                <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: '6px', overflow: 'hidden', minHeight: '250px' }}>
                  <img src={formData.imageData} style={{ width: '100%', height: 'auto' }} alt="Post" />
                  {formData.logoWatermark && <img src={LOGO_URL} alt="Logo" style={{ position: 'absolute', bottom: '10px', left: '10px', height: '40px' }} />}
                  {formData.watermark && <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '6px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>© INDIA REISEN</div>}
                </div>
              )}
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#d1356f', marginBottom: '0.5rem' }}>{preview.title}</div>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '1rem' }}>📍 {preview.location}</div>
              <div style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '1rem', color: '#333' }}>{preview.caption}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                {preview.hashtags.map((tag, i) => <span key={i} style={{ background: '#f8f8f8', color: '#d1356f', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{tag}</span>)}
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                <button onClick={downloadPost} style={{ flex: 1, padding: '10px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>⬇️ Download</button>
                <button onClick={saveToMedia} disabled={isSaving} style={{ flex: 1, padding: '10px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', opacity: isSaving ? 0.6 : 1 }}>📤 Save</button>
              </div>
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '1rem' }}>
                  {platforms.map(p => <button key={p.id} onClick={() => togglePlatform(p.id)} style={{ padding: '8px', border: selectedPlatforms[p.id] ? '2px solid #d1356f' : '2px solid #ddd', borderRadius: '4px', background: selectedPlatforms[p.id] ? 'rgba(209,53,111,0.08)' : 'white', cursor: 'pointer', fontSize: '12px', fontWeight: selectedPlatforms[p.id] ? '600' : '400' }}>{p.icon} {p.name}</button>)}
                </div>
                <button onClick={shareSelected} style={{ width: '100%', padding: '10px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>📤 Share</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCreator;
