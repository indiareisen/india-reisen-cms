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
      setFeaturedJourneys(journeys.slice(0, 3));
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
      <div style={{ backgroundImage: 'linear-gradient(135deg, #d1356f 0%, #D4A574 100%)', color: 'white', padding: '8rem 2rem', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>Explore. Experience. Enchant.</h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem', maxWidth: '800px', lineHeight: '1.8', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>Every journey is more than just a trip—it's an immersive experience into the rich heritage and timeless charm of India</p>
        <button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'white', color: '#d1356f', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          Discover Journeys
        </button>
      </div>

      {/* About Us Section */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: '2rem' }}>🪷 Who We Are</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#666', marginBottom: '1.5rem' }}>
                At India Reisen, we believe every journey is more than just a trip—it's an immersive experience into the rich heritage and timeless charm of India. Our team of seasoned travel experts and local guides curates personalized itineraries that combine the best of India's cultural treasures with modern comforts.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#666', marginBottom: '1.5rem' }}>
                Whether you are travelling solo or as part of a group, our services are designed to match your interests, from exploring historic forts and palaces to enjoying local markets and culinary delights.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#666' }}>
                We are passionate about our country and the destinations we offer, and we strive to make every travel experience a memorable adventure into India's heart and soul.
              </p>
            </div>
            <div style={{ backgroundColor: 'linear-gradient(135deg, #d1356f 0%, #D4A574 100%)', borderRadius: '12px', padding: '2.5rem', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>Our Mission</h3>
              <p style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>To offer journeys that delight, inspire, and contribute positively to local culture and economy through authentic, responsible travel experiences.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Approach */}
      <div style={{ padding: '4rem 2rem', backgroundColor: '#f8f8f8' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: '1rem' }}>✨ Our Approach to Travel</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto 3rem' }}>We offer exclusive travel experiences that reveal the true essence of India with careful planning and authentic engagement</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #d1356f' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#333', marginBottom: '0.75rem' }}>Private Heritage Access</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>Exclusive visits to heritage sites and guided explorations of cultural landmarks with expert local guides</p>
            </div>

            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #d1356f' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#333', marginBottom: '0.75rem' }}>Local Community Connection</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>Opportunities to interact with local artisans and communities, supporting authentic cultural exchange</p>
            </div>

            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #d1356f' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#333', marginBottom: '0.75rem' }}>Responsible Tourism</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>Sustainable practices that benefit people and preserve the environment for future generations</p>
            </div>

            <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #d1356f' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#333', marginBottom: '0.75rem' }}>Culinary Immersion</h3>
              <p style={{ color: '#666', lineHeight: '1.6', fontSize: '0.95rem' }}>Explore local markets, taste authentic cuisine, and directly support local artisans and businesses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Journeys */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#333', textAlign: 'center', marginBottom: '0.5rem' }}>🌍 Featured Journeys</h2>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '3rem', fontSize: '1.05rem' }}>Curated experiences across India's most enchanting destinations</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {featuredJourneys.map(journey => (
              <div key={journey.id} style={{ backgroundColor: '#f8f8f8', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', transition: 'transform 0.3s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
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
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>Let us craft your perfect journey into the heart of India's heritage, culture, and natural beauty</p>
          <button style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'white', color: '#d1356f', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
            Plan Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
