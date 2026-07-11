import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit, doc, getDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import MediaCarousel from '../../components/MediaCarousel'
import useScrollAnimation from '../../hooks/useScrollAnimation'
import { collection as fbCollection, getDocs as fbGetDocs, query as fbQuery, orderBy as fbOrderBy } from 'firebase/firestore'

const DEFAULT_GRADIENTS = [
  ['#d1356f', '#f2789f'],
  ['#5b7fbd', '#8fb3e8'],
  ['#4c8c6b', '#7fc79b'],
  ['#a3703c', '#D4A574'],
  ['#2a9d8f', '#6fc9bc']
]

const FALLBACK_DESTINATIONS = [
  { name: 'India', icon: '🕌', tagline: 'Palaces, deserts & timeless heritage' },
  { name: 'Nepal', icon: '🏔️', tagline: 'Himalayan peaks & spiritual valleys' },
  { name: 'Bhutan', icon: '🙏', tagline: 'The last Himalayan kingdom' },
  { name: 'Tibet', icon: '⛩️', tagline: 'Sacred monasteries & high plateaus' },
  { name: 'Sri Lanka', icon: '🌴', tagline: 'Beaches, tea hills & ancient ruins' }
]

const FALLBACK_WHY_CHOOSE = [
  { icon: '✨', title: 'Bespoke Itineraries', text: 'Every journey is designed around you — no cookie-cutter packages, ever.' },
  { icon: '🧭', title: 'Local Expertise', text: '50+ trusted local partners across 15+ destinations who know the terrain.' },
  { icon: '🌿', title: 'Responsible Tourism', text: 'Immersive travel that respects communities, culture, and the environment.' },
  { icon: '🤝', title: 'White-Glove Support', text: 'Dedicated support before, during, and after your journey — always.' }
]

export default function HomePage() {
  const [journeys, setJourneys] = useState([])
  const [reviews, setReviews] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [faqs, setFaqs] = useState([])
  const [openFaqIndex, setOpenFaqIndex] = useState(null)

  // Scroll animations
  const aboutSection = useScrollAnimation()
  const statsSection = useScrollAnimation()
  const gallerySection = useScrollAnimation()
  const journeysSection = useScrollAnimation()
  const trustBarSection = useScrollAnimation()
  const whyChooseSection = useScrollAnimation()
  const destinationsSection = useScrollAnimation()
  const testimonialsSection = useScrollAnimation()
  const instagramSection = useScrollAnimation()
  const faqSection = useScrollAnimation()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) {
        setSettings(settingsDoc.data())
      }

      const journeysQuery = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'), limit(3))
      const journeysSnap = await getDocs(journeysQuery)
      setJourneys(journeysSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))

      const reviewsSnap = await getDocs(collection(db, 'reviews'))
      const allReviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReviews(allReviews.slice(0, 3))

      const faqsQuery = fbQuery(fbCollection(db, 'faqs'), fbOrderBy('order', 'asc'))
      const faqsSnap = await fbGetDocs(faqsQuery)
      setFaqs(faqsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const hp = settings?.homePage || {}
  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'
  const heroImage = hp.heroImage || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop'

  const trustStats = (hp.showStats && hp.stats && hp.stats.length > 0) ? hp.stats : [
    { value: '200+', label: 'Happy Travelers' },
    { value: '15+', label: 'Destinations' },
    { value: '50+', label: 'Local Partners' },
    { value: '7', label: 'Curated Journeys' }
  ]

  const destinations = (hp.destinations && hp.destinations.length > 0)
    ? hp.destinations.map((d, i) => ({ ...d, gradient: DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length] }))
    : FALLBACK_DESTINATIONS.map((d, i) => ({ ...d, gradient: DEFAULT_GRADIENTS[i % DEFAULT_GRADIENTS.length] }))

  const whyChoose = (hp.whyChoose && hp.whyChoose.length > 0) ? hp.whyChoose : FALLBACK_WHY_CHOOSE
  const instagramHandle = hp.instagramHandle || 'indiareisen'

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        color: 'white',
        padding: '140px 20px',
        textAlign: 'center',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('${heroImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 1
        }}></div>

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(209, 53, 111, ${settings?.homePage?.heroOverlayOpacity || 0.4}), rgba(212, 165, 116, ${settings?.homePage?.heroOverlayOpacity || 0.4}))`,
          zIndex: 2
        }}></div>

        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 3, animation: 'fadeInUp 0.8s ease' }}>
          <h1 style={{
            fontSize: '56px',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
          }}>
            {hp.heroTitle}
          </h1>
          <p style={{
            fontSize: '28px',
            margin: '0 0 20px 0',
            textShadow: '2px 2px 6px rgba(0,0,0,0.5)'
          }}>
            {hp.heroSubtitle}
          </p>
          <p style={{
            fontSize: '18px',
            margin: '0 0 30px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
            textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
          }}>
            {hp.heroDescription}
          </p>
          <a href="/journeys" style={{
            background: 'white',
            color: primaryColor,
            padding: '15px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {hp.heroCTA || 'Explore Journeys'} →
          </a>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutSection.ref}
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '80px 20px',
          opacity: aboutSection.isVisible ? 1 : 0,
          transform: aboutSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <h2 style={{ fontSize: '36px', marginBottom: '20px', color: primaryColor, textAlign: 'center' }}>
          {hp.aboutHeading || 'Why Choose India Reisen?'}
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#666', maxWidth: '800px', margin: '0 auto 40px auto', textAlign: 'center' }}>
          {hp.aboutContent || settings?.aboutText}
        </p>
      </section>

      {/* Media Carousel Section */}
      <section
        ref={gallerySection.ref}
        style={{
          background: 'white',
          padding: '60px 20px',
          opacity: gallerySection.isVisible ? 1 : 0,
          transform: gallerySection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            marginBottom: '30px',
            color: primaryColor,
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            📸 Gallery
          </h2>
          <MediaCarousel />
        </div>
      </section>

      {/* Featured Journeys */}
      <section
        ref={journeysSection.ref}
        style={{
          background: '#f9f9f9',
          padding: '80px 20px',
          opacity: journeysSection.isVisible ? 1 : 0,
          transform: journeysSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '50px', color: primaryColor, textAlign: 'center' }}>
            Featured Journeys
          </h2>
          {loading ? (
            <div>Loading...</div>
          ) : journeys.length === 0 ? (
            <p>No journeys yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
              {journeys.map((journey, idx) => (
                <a key={journey.id} href={`/journey/${journey.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    animation: journeysSection.isVisible ? `fadeInUp 0.8s ease ${idx * 0.1}s backwards` : 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                  >
                    <div style={{
                      background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                      height: '220px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      Journey Image
                    </div>
                    <div style={{ padding: '25px' }}>
                      <h3 style={{ margin: '0 0 10px 0', color: primaryColor, fontSize: '20px' }}>
                        {journey.title}
                      </h3>
                      <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                        {journey.description}
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '20px', color: '#666' }}>
                        <div>📍 {journey.destination}</div>
                        <div>⏱️ {journey.duration} days</div>
                        <div>📈 {journey.difficulty}</div>
                        <div>💰 ${journey.price}</div>
                      </div>
                      <button style={{
                        width: '100%',
                        padding: '10px',
                        background: primaryColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        textAlign: 'center'
                      }}>
                        Learn More
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== NEW: Trust Stats Bar ===== */}
      <section
        ref={trustBarSection.ref}
        style={{
          background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          padding: '50px 20px',
          opacity: trustBarSection.isVisible ? 1 : 0,
          transform: trustBarSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <div style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '20px',
          textAlign: 'center'
        }}>
          {trustStats.map((stat, idx) => (
            <div key={idx} style={{
              color: 'white',
              animation: trustBarSection.isVisible ? `fadeInUp 0.7s ease ${idx * 0.12}s backwards` : 'none'
            }}>
              <h3 style={{ fontSize: '40px', margin: '0 0 5px 0', fontWeight: 'bold', textShadow: '1px 1px 6px rgba(0,0,0,0.2)' }}>
                {stat.value}
              </h3>
              <p style={{ margin: 0, fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.95 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEW: Why Choose Us ===== */}
      <section
        ref={whyChooseSection.ref}
        style={{
          background: 'white',
          padding: '90px 20px',
          opacity: whyChooseSection.isVisible ? 1 : 0,
          transform: whyChooseSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center',
            color: secondaryColor,
            fontWeight: 'bold',
            letterSpacing: '3px',
            fontSize: '13px',
            marginBottom: '10px',
            textTransform: 'uppercase'
          }}>
            🪷 Our Promise
          </p>
          <h2 style={{ fontSize: '36px', marginBottom: '60px', color: primaryColor, textAlign: 'center' }}>
            The India Reisen Difference
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '35px' }}>
            {whyChoose.map((item, idx) => (
              <div key={idx} style={{
                textAlign: 'center',
                padding: '10px',
                animation: whyChooseSection.isVisible ? `fadeInUp 0.8s ease ${idx * 0.12}s backwards` : 'none'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 20px auto',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${primaryColor}22, ${secondaryColor}33)`,
                  border: `2px solid ${secondaryColor}`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '34px'
                }}>
                  {item.icon}
                </div>
                <h3 style={{ margin: '0 0 10px 0', color: primaryColor, fontSize: '18px' }}>
                  {item.title}
                </h3>
                <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NEW: Destinations Showcase ===== */}
      <section
        ref={destinationsSection.ref}
        style={{
          background: '#f9f9f9',
          padding: '90px 20px',
          opacity: destinationsSection.isVisible ? 1 : 0,
          transform: destinationsSection.isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'all 0.8s ease'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{
            textAlign: 'center',
            color: secondaryColor,
            fontWeight: 'bold',
            letterSpacing: '3px',
            fontSize: '13px',
            marginBottom: '10px',
            textTransform: 'uppercase'
          }}>
            🗺️ Where We Go
          </p>
          <h2 style={{ fontSize: '36px', marginBottom: '50px', color: primaryColor, textAlign: 'center' }}>
            Five Countries, Endless Stories
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px' }}>
            {destinations.map((dest, idx) => (
              <a key={dest.name} href="/journeys" style={{ textDecoration: 'none' }}>
                <div style={{
                  position: 'relative',
                  height: '260px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: `linear-gradient(160deg, ${dest.gradient[0]}, ${dest.gradient[1]})`,
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '25px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.35s',
                  animation: destinationsSection.isVisible ? `fadeInUp 0.8s ease ${idx * 0.1}s backwards` : 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 14px 30px rgba(0,0,0,0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)'
                }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    fontSize: '40px',
                    opacity: 0.4
                  }}>
                    {dest.icon}
                  </div>
                  <h3 style={{ color: 'white', fontSize: '24px', margin: '0 0 8px 0', textShadow: '1px 1px 4px rgba(0,0,0,0.3)' }}>
                    {dest.name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', margin: 0, lineHeight: '1.4' }}>
                    {dest.tagline}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {reviews.length > 0 && (
        <section
          ref={testimonialsSection.ref}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '80px 20px'
          }}
        >
          <h2 style={{ fontSize: '36px', marginBottom: '50px', color: primaryColor, textAlign: 'center' }}>
            What Our Travelers Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {reviews.slice(0, 3).map((review, idx) => (
              <div key={review.id} style={{
                background: '#f9f9f9',
                padding: '30px',
                borderRadius: '12px',
                border: `2px solid ${primaryColor}`,
                animation: testimonialsSection.isVisible ? `fadeInUp 0.8s ease ${idx * 0.1}s backwards` : 'none'
              }}>
                <div style={{ color: primaryColor, fontSize: '20px', marginBottom: '10px' }}>
                  {'⭐'.repeat(review.rating)}
                </div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  {review.title}
                </p>
                <p style={{ color: '#666', margin: '0 0 15px 0', lineHeight: '1.6' }}>
                  "{review.content}"
                </p>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0' }}>
                  {review.name}
                </p>
                <p style={{ color: '#999', margin: 0, fontSize: '14px' }}>
                  {review.country} • {review.journey}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== NEW: Instagram / Social Strip ===== */}
      <section
        ref={instagramSection.ref}
        style={{
          background: 'white',
          padding: '70px 20px'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', color: primaryColor }}>
            📷 Follow the Journey
          </h2>
          <p style={{ color: '#666', marginBottom: '35px' }}>
            <a href={`https://www.instagram.com/${instagramHandle}`} target="_blank" rel="noopener noreferrer" style={{ color: secondaryColor, fontWeight: 'bold', textDecoration: 'none' }}>
              @indiareisen
            </a> on Instagram
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px'
          }}>
            {[...Array(6)].map((_, idx) => (
              
                <a key={idx}
                href={`https://www.instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: idx % 2 === 0
                    ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                    : `linear-gradient(135deg, ${secondaryColor}, ${primaryColor})`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '22px',
                  textDecoration: 'none',
                  transition: 'transform 0.3s, opacity 0.3s',
                  animation: instagramSection.isVisible ? `fadeInUp 0.6s ease ${idx * 0.08}s backwards` : 'none'
                }}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; e.currentTarget.style.opacity = '0.85' }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.opacity = '1' }}
              >
                🪷
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section
          ref={faqSection.ref}
          style={{
            background: '#f9f9f9',
            padding: '90px 20px'
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{
              textAlign: 'center',
              color: secondaryColor,
              fontWeight: 'bold',
              letterSpacing: '3px',
              fontSize: '13px',
              marginBottom: '10px',
              textTransform: 'uppercase'
            }}>
              💬 Got Questions?
            </p>
            <h2 style={{ fontSize: '36px', marginBottom: '50px', color: primaryColor, textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx
                return (
                  <div key={faq.id} style={{
                    background: 'white',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: `2px solid ${isOpen ? primaryColor : '#eee'}`,
                    transition: 'border-color 0.3s',
                    animation: faqSection.isVisible ? `fadeInUp 0.6s ease ${idx * 0.06}s backwards` : 'none'
                  }}>
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '20px 25px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '15px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#333'
                      }}
                    >
                      <span>{faq.question}</span>
                      <span style={{
                        color: primaryColor,
                        fontSize: '20px',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }}>+</span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 25px 22px 25px',
                        color: '#666',
                        fontSize: '14px',
                        lineHeight: '1.7'
                      }}>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: 'white',
        padding: '80px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'fadeInUp 0.8s ease' }}>
          <h2 style={{ fontSize: '36px', margin: '0 0 20px 0' }}>
            {hp.ctaHeading || 'Ready to Explore India?'}
          </h2>
          <p style={{ fontSize: '16px', margin: '0 0 30px 0', lineHeight: '1.6' }}>
            {hp.ctaText || 'Start your journey with us today.'}
          </p>
          <a href="/journeys" style={{
            background: 'white',
            color: primaryColor,
            padding: '15px 40px',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '18px',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
          >
            {hp.ctaButtonText || 'Browse All Journeys'}
          </a>
        </div>
      </section>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
