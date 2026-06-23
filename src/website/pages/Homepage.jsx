import React, { useState, useEffect } from 'react';
import { getItineraries, getBlogs, getTeamMembers, getReviews } from '../../services/firebaseService';

const Homepage = () => {
  const [featuredJourneys, setFeaturedJourneys] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const journeys = await getItineraries();
      const reviews = await getReviews();
      
      // Get featured journeys (first 3)
      setFeaturedJourneys(journeys.slice(0, 3));
      
      // Get testimonials (reviews)
      setTestimonials(reviews.slice(0, 6));
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#999' }}>Loading...</div>;
  }

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <div style={{ backgroundImage: 'linear-gradient(135deg, #d1356f 0%, #D4A574 100%)', color: 'white', padding: '6rem 2rem', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Explore. Experience. Enchant.</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '700px', lineHeight: '1.6' }}>Immersive journeys into the rich heritage and timeless charm of India</p>
        <button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'white', color: '#d1356f', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          Discover Journeys
        </button>
      </div>

      {/* Featured Journeys */}
      <div style={{ padding: '4rem 2rem', backgroundColor: '#f8f8f8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: '0.5rem' }}>🌍 Featured Journeys</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.1rem' }}>Curated experiences across India's most enchanting destinations</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {featuredJourneys.map(journey => (
              <div key={journey.id} style={{ backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                {journey.image && <img src={journey.image} alt={journey.title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#d1356f', marginBottom: '0.5rem' }}>{journey.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.6' }}>{journey.description?.substring(0, 100)}...</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#999' }}>
                    <span>📍 {journey.location}</span>
                    <span>⏱️ {journey.duration} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button style={{ padding: '1rem 2rem', fontSize: '1rem', backgroundColor: '#d1356f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
              View All Journeys →
            </button>
          </div>
        </div>
      </div>

      {/* Why Choose India Reisen */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: '3rem' }}>✨ Why Choose India Reisen?</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '🎯', title: 'Curated Experiences', desc: 'Handpicked itineraries designed for authentic cultural immersion' },
              { icon: '👥', title: 'Expert Guides', desc: 'Seasoned travel experts and local guides with deep knowledge' },
              { icon: '🌱', title: 'Responsible Travel', desc: 'Sustainable practices that benefit local communities' },
              { icon: '🏨', title: 'Premium Comfort', desc: 'Carefully selected accommodations blending heritage with modern amenities' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '2rem', backgroundColor: '#f8f8f8', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#333', marginBottom: '0.5rem' }}>{item.title}</h3>
                <p style={{ color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '4rem 2rem', backgroundColor: '#f8f8f8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: '3rem' }}>⭐ What Our Travelers Say</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {testimonials.map(review => (
              <div key={review.id} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '1.2rem', color: '#FFD700', marginBottom: '1rem' }}>{'⭐'.repeat(review.rating || 5)}</div>
                <p style={{ color: '#666', fontStyle: 'italic', marginBottom: '1.5rem', lineHeight: '1.6' }}>"{review.text}"</p>
                <div style={{ fontWeight: '700', color: '#333' }}>{review.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#999' }}>{review.location}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundImage: 'linear-gradient(135deg, #d1356f 0%, #D4A574 100%)', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Experience India?</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>Let us craft your perfect journey into the heart of India</p>
          <button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'white', color: '#d1356f', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Plan Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
