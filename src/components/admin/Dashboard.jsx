import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState({ itineraries: 0, blogs: 0, team: 0, reviews: 0 });

  useEffect(() => {
    const itins = JSON.parse(localStorage.getItem('itineraries') || '[]');
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const team = JSON.parse(localStorage.getItem('team') || '[]');
    const revs = JSON.parse(localStorage.getItem('reviews') || '[]');
    setStats({ itineraries: itins.length, blogs: blogs.length, team: team.length, reviews: revs.length });
  }, []);

  const StatCard = ({ icon, label, count, color }) => (
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', border: `3px solid ${color}`, textAlign: 'center' }}>
      <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
      <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{label}</p>
      <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color }}>{count}</p>
    </div>
  );

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#d1356f', marginBottom: '32px' }}>📊 Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <StatCard icon="🗺️" label="Itineraries" count={stats.itineraries} color="#d1356f" />
        <StatCard icon="📝" label="Blog Posts" count={stats.blogs} color="#D4A574" />
        <StatCard icon="👥" label="Team Members" count={stats.team} color="#d1356f" />
        <StatCard icon="⭐" label="Reviews" count={stats.reviews} color="#D4A574" />
      </div>

      <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '8px' }}>
        <h2 style={{ color: '#333', marginBottom: '16px' }}>📌 Quick Stats</h2>
        <p style={{ margin: '8px 0', color: '#666' }}>Total Content Items: <strong>{stats.itineraries + stats.blogs}</strong></p>
        <p style={{ margin: '8px 0', color: '#666' }}>Team Members: <strong>{stats.team}</strong></p>
        <p style={{ margin: '8px 0', color: '#666' }}>Customer Reviews: <strong>{stats.reviews}</strong></p>
      </div>
    </div>
  );
};

export default Dashboard;
