import React, { useState, useEffect } from 'react';
import { getItineraries } from '../../services/firebaseService';

const JourneysPage = () => {
  const [journeys, setJourneys] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [filterType, setFilterType] = useState('all'); // 'all' or 'featured'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourneys();
  }, []);

  const loadJourneys = async () => {
    try {
      const data = await getItineraries();
      setJourneys(data);
      // Featured journeys - first 4
      setFeatured(data.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Error loading journeys:', error);
      setLoading(false);
    }
  };

  const filteredJourneys = () => {
    let list = filterType === 'featured' ? featured : journeys;
    
    if (searchQuery) {
      list = list.filter(j => 
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return list;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>Loading journeys...</div>;
  }

  const displayed = filteredJourneys();

  return (
    <div style={{ backgroundColor: '#f8f8f8', minHeight: '100vh', paddingTop: '2rem' }}>
      {/* Header */}
      <div style={{ padding: '3rem 2rem', backgroundColor: 'white', borderBottom: '1px solid #ddd' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#333', marginBottom: '1rem' }}>🌍 Our Journeys</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px' }}>Explore our curated collection of transformative travel experiences across India</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ padding: '2rem', backgroundColor: 'white', maxWidth: '1200px', margin: '2rem auto 0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>🔍 Search</label>
            <input type="text" placeholder="Search by location or title..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#666', marginBottom: '0.5rem' }}>⭐ Filter</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setFilterType('all')} style={{ flex: 1, padding: '0.75rem', border: filterType === 'all' ? '2px solid #d1356f' : '1px solid #ddd', backgroundColor: filterType === 'all' ? '#fff5f8' : 'white', color: filterType === 'all' ? '#d1356f' : '#666', borderRadius: '6px', cursor: 'pointer', fontWeight: filterType === 'all' ? '700' : '500' }}>All Journeys</button>
              <button onClick={() => setFilterType('featured')} style={{ flex: 1, padding: '0.75rem', border: filterType === 'featured' ? '2px solid #d1356f' : '1px solid #ddd', backgroundColor: filterType === 'featured' ? '#fff5f8' : 'white', color: filterType === 'featured' ? '#d1356f' : '#666', borderRadius: '6px', cursor: 'pointer', fontWeight: filterType === 'featured' ? '700' : '500' }}>⭐ Featured</button>
            </div>
          </div>
        </div>
      </div>

      {/* Journeys Grid */}
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>No journeys found. Try a different search.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {displayed.map(journey => (
              <div key={journey.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'all 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}>
                <div style={{ position: 'relative' }}>
                  {journey.image && <img src={journey.image} alt={journey.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                  {featured.some(f => f.id === journey.id) && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: '#d1356f', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700' }}>⭐ Featured</div>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#d1356f', marginBottom: '0.5rem' }}>{journey.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6', minHeight: '45px' }}>{journey.description?.substring(0, 100)}...</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.85rem', color: '#999' }}>
                    <span>📍 {journey.location}</span>
                    <span>⏱️ {journey.duration} days</span>
                  </div>
                  
                  {journey.price && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#d1356f' }}>₹{journey.price}</span>
                      <button style={{ padding: '0.5rem 1rem', backgroundColor: '#D4A574', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>Explore</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneysPage;
