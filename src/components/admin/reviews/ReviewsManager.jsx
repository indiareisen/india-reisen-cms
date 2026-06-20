import React, { useState, useEffect } from 'react';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', journey: '', location: '', rating: 5, quote: '' });

  useEffect(() => {
    const saved = localStorage.getItem('reviews');
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const updated = [...reviews, { ...formData, id: Date.now() }];
    localStorage.setItem('reviews', JSON.stringify(updated));
    setReviews(updated);
    setFormData({ name: '', journey: '', location: '', rating: 5, quote: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const updated = reviews.filter(r => r.id !== id);
    localStorage.setItem('reviews', JSON.stringify(updated));
    setReviews(updated);
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#d1356f', marginBottom: '24px' }}>⭐ Reviews Manager</h1>
      
      <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '24px' }}>+ Add Review</button>

      {showForm && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e0e0e0' }}>
          <h3>Add Customer Review</h3>
          <input type="text" placeholder="Customer Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Journey" value={formData.journey} onChange={(e) => setFormData({ ...formData, journey: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', marginBottom: '8px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} />
          <div style={{ marginBottom: '8px' }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Rating (1-5)</label>
            <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <option value={1}>⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={5}>⭐⭐⭐⭐⭐</option>
            </select>
          </div>
          <textarea placeholder="Review Quote" value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} style={{ width: '100%', marginBottom: '12px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box', minHeight: '80px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ flex: 1, padding: '10px', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {reviews.map(review => (
          <div key={review.id} style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <div style={{ marginBottom: '8px' }}>
              {'⭐'.repeat(review.rating)}
            </div>
            <p style={{ margin: '8px 0', fontWeight: 'bold', color: '#d1356f' }}>{review.name}</p>
            <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{review.journey} • {review.location}</p>
            <p style={{ margin: '8px 0', fontSize: '14px', fontStyle: 'italic' }}>"{review.quote}"</p>
            <button onClick={() => handleDelete(review.id)} style={{ padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', width: '100%' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsManager;
