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
    immersive: [`Step into {location}'s soul with {title}. Immersive experiences blending heritage with comfort. {pictureDetails}`],
    authentic: [`Experience authentic {location} through {title}. Responsible travel rooted in cultural wisdom. {pictureDetails}`],
    responsible: [`{title} in {location} means sustainable travel. Community-aligned tourism. {pictureDetails}`],
    luxe: [`Indulge in {location}'s elegance with {title}. Luxury meets authentic culture. {pictureDetails}`]
  };

  const hashtagBank = {
    immersive: ['#ImmersiveIndia', '#CulturalJourney', '#AuthenticTravel', '#IndiaReisen', '#ExploreExperienceEnchant', '#TransformativeTravel', '#LocalConnections', '#HeritageTravel', '#SoulfulAdventure', '#ExperienceIndia'],
    authentic: ['#AuthenticIndia', '#ResponsibleTravel', '#CulturalHeritage', '#LocalCommunities', '#SustainableTravel', '#IndiaReisen', '#HeritageConservation', '#CulturalExchange', '#RealIndia', '#AuthenticExperience'],
    responsible: ['#ResponsibleTravel', '#SustainableTourism', '#CommunityTourism', '#CulturalPride', '#HeritageConservation', '#IndiaReisen', '#EcoTravel', '#SocialImpact', '#TravelWithPurpose', '#ConsciousTourism'],
    luxe: ['#LuxuryTravel', '#BoutiqueTravel', '#ExclusiveIndia', '#CuratedExperience', '#IndiaReisen', '#RefinedTravel', '#DiscerningTraveler', '#PremiumJourney', '#SophisticatedTravel', '#CulturalLuxury']
  };

  const platforms = [{ id: 'instagram', name: 'Instagram', icon: '📸' }, { id: 'facebook', name: 'Facebook', icon: '👥' }, { id: 'x', name: 'X', icon: '𝕏' }, { id: 'linkedin', name: 'LinkedIn', icon: '💼' }, { id: 'youtube', name: 'YouTube', icon: '▶️' }, { id: 'threads', name: 'Threads', icon: '🧵' }];

  const handleImageUpload = (e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => { setFormData({ ...formData, imageData: event.target.result }); }; reader.readAsDataURL(file); } };

  const generateContent = () => { const { title, location, tone, pictureDetails } = formData; if (!title || !location) { setAlert({ type: 'error', message: 'Please fill in Experience Title and Location' }); return; } setIsGenerating(true); setTimeout(() => { const selectedTemplate = genericTemplates[tone][0]; const caption = selectedTemplate.replace(/{title}/g, title).replace(/{location}/g, location).replace(/{pictureDetails}/g, pictureDetails || ''); const hashtags = hashtagBank[tone].sort(() => Math.random() - 0.5).slice(0, 8); setPreview({ caption, hashtags, title, location }); setIsGenerating(false); setAlert({ type: 'success', message: '✨ Content generated! Ready to share.' }); }, 600); };

  const saveToMedia = async () => {
    if (!preview || !formData.imageData) {
      setAlert({ type: 'error', message: 'Generate content and upload image first' });
      return;
    }

    setIsSaving(true);
    try {
      const fullContent = `${preview.caption}\n\n${preview.hashtags.join(' ')}\n\n✨ Explore | Experience | Enchant 🇮🇳\nwww.indiareisen.com | team@indiareisen.com | +91 98108 27785`;
      
      await addDoc(collection(db, 'social_posts'), {
        title: preview.title,
        location: preview.location,
        caption: fullContent,
        tone: formData.tone,
        hashtags: preview.hashtags,
        imageUrl: formData.imageData,
        createdAt: Timestamp.now(),
        type: 'social_media_post'
      });

      setAlert({ type: 'success', message: '✨ Post saved to Media! Check your Media dashboard.' });
      setIsSaving(false);
    } catch (error) {
      setAlert({ type: 'error', message: `Error saving: ${error.message}` });
      setIsSaving(false);
    }
  };

  const downloadPost = () => {
    if (!preview || !formData.imageData) {
      setAlert({ type: 'error', message: 'Generate content first' });
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
          downloadCanvas();
        };
        logo.src = LOGO_URL;
      } else {
        downloadCanvas();
      }

      function downloadCanvas() {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${preview.title.replace(/\s+/g, '-')}-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    };
    img.src = formData.imageData;
  };

  const togglePlatform = (id) => { setSelectedPlatforms({ ...selectedPlatforms, [id]: !selectedPlatforms[id] }); };

  const shareSelected = () => { const selected = Object.keys(selectedPlatforms).filter(p => selectedPlatforms[p]); if (selected.length === 0) { setAlert({ type: 'error', message: 'Select at least one platform' }); return; } if (!preview) { setAlert({ type: 'error', message: 'Generate content first' }); return; } const fullContent = `${preview.caption}\n\n${preview.hashtags.join(' ')}\n\n✨ Explore | Experience | Enchant 🇮🇳\nwww.indiareisen.com | team@indiareisen.com | +91 98108 27785`; selected.forEach(platform => { const urls = { facebook: `https://www.facebook.com/sharer/sharer.php?u=www.indiareisen.com&quote=${encodeURIComponent(fullContent)}`, x: `https://x.com/intent/tweet?text=${encodeURIComponent(fullContent)}`, linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=www.indiareisen.com`, threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(fullContent)}` }; if (urls[platform]) { window.open(urls[platform], '_blank', 'width=600,height=400'); } else { navigator.clipboard.writeText(fullContent); setAlert({ type: 'success', message: `Content copied! Open ${platform} and paste.` }); } }); };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', height: '100%' }}>
      <div style={{ overflow: 'auto', paddingRight: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <img src={LOGO_URL} alt="India Reisen" style={{ height: '50px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />
          <div>
            <h2 style={{ color: '#d1356f', margin: 0, fontSize: '18px', fontWeight: '700' }}>📱 Social Creator</h2>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Generate platform-ready posts</p>
          </div>
        </div>
        {alert && <div style={{ padding: '10px 12px', borderRadius: '6px', marginBottom: '1rem', fontSize: '13px', borderLeft: '3px solid', background: alert.type === 'error' ? '#fee' : '#efe', color: alert.type === 'error' ? '#c33' : '#3c3', borderLeftColor: alert.type === 'error' ? '#c33' : '#3c3' }}>{alert.message}</div>}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Image</label>
          <label style={{ border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', padding: '2rem', textAlign: 'center', cursor: 'pointer', display: 'block' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#D4A574'; e.currentTarget.style.background = 'rgba(212,165,116,0.05)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'transparent'; }}>
            {formData.imageData ? <img src={formData.imageData} style={{ maxHeight: '150px', borderRadius: '6px' }} alt="Preview" /> : <div><div style={{ fontSize: '24px', marginBottom: '0.5rem' }}>☁️</div><p style={{ fontSize: '13px', color: '#666' }}>Click to upload image</p></div>}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>Experience Title *</label>
          <input type="text" placeholder="e.g., Sacred Ganges Sunrise Ritual" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>Location *</label>
          <input type="text" placeholder="e.g., Varanasi, Uttar Pradesh" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>Picture Details</label>
          <textarea placeholder="Describe what's in the photo..." value={formData.pictureDetails} onChange={e => setFormData({ ...formData, pictureDetails: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical' }} />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '0.5rem' }}>Content Tone</label>
          <select value={formData.tone} onChange={e => setFormData({ ...formData, tone: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', cursor: 'pointer' }}>
            <option value="immersive">✨ Immersive & Transformative</option>
            <option value="authentic">🎭 Authentic & Cultural</option>
            <option value="responsible">🌱 Responsible & Sustainable</option>
            <option value="luxe">💎 Luxe & Curated</option>
          </select>
        </div>
        <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1rem' }}>Settings</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.watermark} onChange={e => setFormData({ ...formData, watermark: e.target.checked })} style={{ cursor: 'pointer', accentColor: '#D4A574' }} />
            <span style={{ fontSize: '13px' }}>Add text watermark</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.logoWatermark} onChange={e => setFormData({ ...formData, logoWatermark: e.target.checked })} style={{ cursor: 'pointer', accentColor: '#D4A574' }} />
            <span style={{ fontSize: '13px' }}>Add logo branding</span>
          </label>
        </div>
        <button onClick={generateContent} disabled={isGenerating} style={{ width: '100%', padding: '12px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: isGenerating ? 'not-allowed' : 'pointer', opacity: isGenerating ? 0.6 : 1 }}>
          {isGenerating ? '✨ Creating...' : '✨ Generate Content'}
        </button>
      </div>
      <div style={{ overflow: 'auto', paddingRight: '1rem' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '1rem' }}>📱 Post Preview</h2>
          {!preview ? <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#666', fontStyle: 'italic', fontSize: '13px' }}>👈 Fill details and click Generate</div> : <div>{formData.imageData && <div style={{ position: 'relative', marginBottom: '1rem', borderRadius: '6px', overflow: 'hidden', minHeight: '300px' }}><img src={formData.imageData} style={{ width: '100%', height: 'auto' }} alt="Post preview" />{formData.logoWatermark && <img src={LOGO_URL} alt="India Reisen" style={{ position: 'absolute', bottom: '16px', left: '16px', height: '40px', width: 'auto' }} onError={(e) => { e.target.style.display = 'none'; }} />}{formData.watermark && <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '6px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>© INDIA REISEN</div>}</div>}<div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '0.25rem', color: '#d1356f' }}>{preview.title}</div><div style={{ fontSize: '12px', color: '#666', marginBottom: '1rem' }}>📍 {preview.location}</div><div style={{ fontSize: '14px', lineHeight: '1.7', marginBottom: '1rem', color: '#333' }}>{preview.caption}</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>{preview.hashtags.map((tag, i) => <span key={i} style={{ background: '#f8f8f8', color: '#d1356f', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{tag}</span>)}</div><div style={{ fontSize: '11px', color: '#999', marginBottom: '1.5rem', lineHeight: '1.6', background: '#fafafa', padding: '1rem', borderRadius: '4px' }}>✨ Explore | Experience | Enchant 🇮🇳<br />www.indiareisen.com | team@indiareisen.com | +91 98108 27785</div><div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}><button onClick={downloadPost} style={{ flex: 1, padding: '10px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={e => e.target.style.background = '#c99560'} onMouseLeave={e => e.target.style.background = '#D4A574'}>⬇️ Download Post</button><button onClick={saveToMedia} disabled={isSaving} style={{ flex: 1, padding: '10px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1 }} onMouseEnter={e => !isSaving && (e.target.style.background = '#b8245f')} onMouseLeave={e => e.target.style.background = '#d1356f'}>📤 Post to Media</button></div><div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1.5rem' }}><h3 style={{ fontSize: '13px', fontWeight: '600', marginBottom: '1rem' }}>📤 Share to Platforms</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1rem' }}>{platforms.map(p => <button key={p.id} onClick={() => togglePlatform(p.id)} style={{ padding: '10px', border: selectedPlatforms[p.id] ? `2px solid #d1356f` : '2px solid rgba(0,0,0,0.1)', borderRadius: '6px', background: selectedPlatforms[p.id] ? 'rgba(209, 53, 111, 0.08)' : 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><span>{p.icon} {p.name}</span>{selectedPlatforms[p.id] && <span style={{ color: '#d1356f' }}>✓</span>}</button>)}</div><button onClick={shareSelected} style={{ width: '100%', padding: '12px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} onMouseEnter={e => e.target.style.background = '#c99560'} onMouseLeave={e => e.target.style.background = '#D4A574'}>📤 Post to Selected</button></div></div>}</div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaCreator;
