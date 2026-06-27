const AboutPage = () => (
  <div className="min-h-screen bg-white">
    <div style={{ background: `linear-gradient(135deg, #d1356f 0%, #D4A574 100%)` }} className="text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">About India Reisen</h1>
        <p className="text-xl opacity-95">Redefining luxury travel through authentic cultural immersion</p>
      </div>
    </div>

    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h2>
        <div className="space-y-6 text-gray-700 text-lg">
          <p>Founded on the belief that travel should be transformative, India Reisen creates authentic journeys through genuine local connections.</p>
          <p>Every journey is curated to immerse you in the rich heritage and culture of India, Nepal, Bhutan, Tibet, and Sri Lanka.</p>
          <p><strong>"Every journey is more than just a trip—it's an immersive experience into rich heritage and timeless charm."</strong></p>
        </div>
      </div>
    </section>

    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🌍', title: 'Responsible Tourism', desc: 'Sustainable practices & local support' },
            { icon: '❤️', title: 'Authentic Experiences', desc: 'Real connections & genuine encounters' },
            { icon: '🤝', title: 'Trusted Partners', desc: '50+ vetted local experts' },
          ].map((v, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg text-center">
              <p className="text-5xl mb-4">{v.icon}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{v.title}</h3>
              <p className="text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ background: `linear-gradient(135deg, #d1356f 0%, #D4A574 100%)` }} className="text-white py-16 px-4 text-center">
      <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
      <button className="bg-white text-pink-600 font-bold px-8 py-4 rounded-lg text-lg hover:shadow-xl">
        Get in Touch
      </button>
    </section>
  </div>
);

export default AboutPage;
