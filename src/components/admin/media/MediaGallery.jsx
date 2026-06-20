import React, { useState, useEffect } from 'react';

const MediaGallery = () => {
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mediaGallery');
    if (saved) setMedia(JSON.parse(saved));
  }, []);

  const handleUpload = async (file) => {
    setUploading(true);
    // TODO: Upload to Cloudinary
    setUploading(false);
  };

  const handleDelete = (id) => {
    const updated = media.filter(m => m.id !== id);
    localStorage.setItem('mediaGallery', JSON.stringify(updated));
    setMedia(updated);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#d1356f', marginBottom: '24px' }}>📷 Media Gallery</h1>
      
      <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3>Upload Images/Videos</h3>
        <input type="file" multiple onChange={(e) => handleUpload(e.target.files[0])} disabled={uploading} />
        {uploading && <p>⏳ Uploading...</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {media.map(item => (
          <div key={item.id} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <img src={item.url} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
            <p style={{ margin: '8px 0', fontWeight: 'bold' }}>{item.name}</p>
            <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaGallery;
