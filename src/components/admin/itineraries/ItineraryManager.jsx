import React, { useState, useEffect } from 'react';
import { addItinerary, getItineraries, deleteItinerary } from '../../../services/firebaseService';

const ItineraryManager = () => {
  const [itineraries, setItineraries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', duration: '', destinations: [], price: '', image: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    setLoading(true);
    const data = await getItineraries();
    setItineraries(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!formData.title) { alert('Title required'); return; }
    setLoading(true);
    try {
      await addItinerary(formData);
      setFormData({ title: '', description: '', duration: '', destinations: [], price: '', image: '' });
      setShowForm(false);
      loadItineraries();
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this itinerary?')) {
      setLoading(true);
      try {
        await deleteItinerary(id);
        loadItineraries();
      } catch (error) {
        alert('Error: ' + error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#d1356f', marginBottom: '24px' }}>🗺️ Itinerary Manager</h1>
      
      <button onClick={() => setShowForm(true)} disabled={loading} style={{ padding: '12px 24px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginBottom: '24px', opacity: loading ? 0.6 : 1 }}>+ Add Itinerary</button>

      {showForm && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
          <h3>Create New Itinerary</h3>
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' }} />
          <input type="text" placeholder="Duration (e.g., 5 days)" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: '10px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: loading ? 0.6 : 1 }}>{loading ? '⏳...' : 'Save'}</button>
            <button onClick={() => setShowForm(false)} disabled={loading} style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {itineraries.map(item => (
            <div key={item.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#d1356f' }}>{item.title}</h3>
              <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>{item.duration} • ₹{item.price}</p>
              <p style={{ margin: '8px 0', fontSize: '14px' }}>{item.description}</p>
              <button onClick={() => handleDelete(item.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItineraryManager;
