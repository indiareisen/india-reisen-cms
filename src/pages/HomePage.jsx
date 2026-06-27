import { useState } from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* ============ HERO ============ */}
      <div className="px-6 py-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-pink-400 font-semibold text-sm mb-4">PREMIUM TRAVEL EXPERIENCES</p>
            <h1 className="text-6xl md:text-7xl font-black leading-tight mb-6">
              Journey Beyond Ordinary
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mb-8">
              Authentic cultural immersion across India, Nepal, Bhutan, and Sri Lanka. Designed for travelers who seek meaning, not just memories.
            </p>
          </div>
          
          <div className="flex gap-4 flex-wrap">
            <a href="#journeys" className="px-8 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition">
              Explore Journeys
            </a>
            <a href="mailto:team@indiareisen.com" className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              Book a Call
            </a>
          </div>
        </div>
      </div>

      {/* ============ STATS ============ */}
      <div className="px-6 py-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-4xl font-bold text-slate-900">200+</p>
            <p className="text-sm text-slate-600 mt-2">Satisfied Travelers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900">15+</p>
            <p className="text-sm text-slate-600 mt-2">Unique Destinations</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900">50+</p>
            <p className="text-sm text-slate-600 mt-2">Local Partnerships</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-slate-900">4.9★</p>
            <p className="text-sm text-slate-600 mt-2">Avg. Rating</p>
          </div>
        </div>
      </div>

      {/* ============ WHY US ============ */}
      <div className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Why Choose Us?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 border border-slate-200 hover:border-pink-300 hover:shadow-md transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Authentic Design</h3>
              <p className="text-slate-600">Every journey is hand-curated by locals who truly know their regions.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 border border-slate-200 hover:border-pink-300 hover:shadow-md transition">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Community Impact</h3>
              <p className="text-slate-600">Your travel directly supports local economies and cultural preservation.</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 border border-slate-200 hover:border-pink-300 hover:shadow-md transition">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Guidance</h3>
              <p className="text-slate-600">Passionate guides provide deep cultural insights and personal attention.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============ JOURNEYS ============ */}
      <div id="journeys" className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Our Journeys</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Golden Triangle', location: 'Delhi • Agra • Jaipur', duration: '5 Days', price: '₹45,000', desc: 'Iconic monuments and royal history' },
              { title: 'Nepal Adventure', location: 'Kathmandu • Pokhara', duration: '7 Days', price: '₹55,000', desc: 'Mountains, temples, and adventure' },
              { title: 'Kerala Backwaters', location: 'Kochi • Alleppey', duration: '4 Days', price: '₹35,000', desc: 'Serene waterways and spice routes' },
            ].map((journey, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="h-40 bg-gradient-to-br from-slate-300 to-slate-400"></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{journey.title}</h3>
                  <p className="text-sm text-slate-600 mb-4">{journey.location}</p>
                  <p className="text-sm text-slate-600 mb-6">{journey.desc}</p>
                  
                  <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-200">
                    <span className="text-sm font-semibold text-slate-600">{journey.duration}</span>
                    <span className="text-2xl font-bold text-pink-600">{journey.price}</span>
                  </div>
                  
                  <button className="w-full bg-pink-600 text-white font-bold py-2 rounded-lg hover:bg-pink-700 transition">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ TESTIMONIALS ============ */}
      <div className="px-6 py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12">Traveler Reviews</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Sarah Johnson', text: 'Best travel experience. The guides were knowledgeable and the itinerary was perfectly balanced.' },
              { name: 'Rajesh Kumar', text: 'Authentic experiences, wonderful people, and perfect planning. Highly recommended!' },
            ].map((review, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 border border-slate-200">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-slate-700 mb-6">"{review.text}"</p>
                <p className="font-bold text-slate-900">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ CTA ============ */}
      <div className="px-6 py-20 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-lg text-slate-300 mb-8">Contact us for a personalized itinerary</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="mailto:team@indiareisen.com" className="px-8 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 transition">
              Email Us
            </a>
            <a href="https://wa.me/919810827785" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
