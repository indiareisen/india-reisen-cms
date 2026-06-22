import React, { useState, useEffect } from 'react';

const TeamManager = () => {
  const [team, setTeam] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', email: '', image: '' });

  useEffect(() => {
    const saved = localStorage.getItem('team');
    if (saved) setTeam(JSON.parse(saved));
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updated = [...team, { ...formData, id: Date.now() }];
    localStorage.setItem('team', JSON.stringify(updated));
    setTeam(updated);
    setFormData({ name: '', role: '', bio: '', email: '', image: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = team.filter(m => m.id !== id);
    localStorage.setItem('team', JSON.stringify(updated));
    setTeam(updated);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#d1356f', marginBottom: '24px' }}>👥 Team Manager</h1>
      
      <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '24px' }}>+ Add Member</button>

      {showForm && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
          <h3>Add Team Member</h3>
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <textarea placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' }} />
          
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>📸 Team Member Photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
            {formData.image && <img src={formData.image} alt="Preview" style={{ maxWidth: '150px', marginTop: '8px', borderRadius: '4px' }} />}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '10px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {team.map(member => (
          <div key={member.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
            {member.image ? (
              <img src={member.image} alt={member.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', display: 'block' }} />
            ) : (
              <div style={{ width: '120px', height: '120px', backgroundColor: '#d1356f', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '48px' }}>👤</div>
            )}
            <h3 style={{ margin: '8px 0', color: '#d1356f' }}>{member.name}</h3>
            <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>{member.role}</p>
            <p style={{ margin: '8px 0', fontSize: '13px', textAlign: 'justify', lineHeight: '1.6' }}>{member.bio}</p>
            <p style={{ margin: '8px 0', fontSize: '12px', color: '#999' }}>{member.email}</p>
            <button onClick={() => handleDelete(member.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%', marginTop: '8px' }}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamManager;
