import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, limit } from 'firebase/firestore'
import { db } from '../../services/firebaseService'
import useWishlist from '../../hooks/useWishlist'

const INK = '#2b2320'
const MUTE = '#8a7a6d'
const BORDER = '#e8dfd7'
const CANVAS = '#faf6f2'
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const DEFAULT_INCLUSIONS = [
  'Professional local guides',
  'Accommodation in luxury hotels',
  'All meals and refreshments',
  'Transportation and transfers',
  'Entry to all attractions',
  'Travel insurance included'
]

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'HI' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'pt', label: 'PT' }
]

export default function JourneyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [journey, setJourney] = useState(null)
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxImg, setLightboxImg] = useState(null)
  const [lang, setLang] = useState('en')
  const [related, setRelated] = useState([])
  const [openFaq, setOpenFaq] = useState(null)
  const { toggleWishlist, isWishlisted: checkWishlisted } = useWishlist()

  useEffect(() => { fetchData() }, [id])

  useEffect(() => {
    if (!journey) return
    fetchRelated()
  }, [journey?.id])

  const fetchRelated = async () => {
    try {
      const snap = await getDocs(query(collection(db, 'journeys'), limit(12)))
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(j => j.id !== journey.id)
      const destWords = (journey.destination || '').toLowerCase().split(/,\s*/)
      const scored = all.map(j => {
        const jWords = (j.destination || '').toLowerCase().split(/,\s*/)
        const overlap = destWords.filter(w => jWords.includes(w)).length
        const sameDifficulty = j.difficulty === journey.difficulty ? 1 : 0
        return { j, score: overlap * 2 + sameDifficulty }
      })
      scored.sort((a, b) => b.score - a.score)
      setRelated(scored.slice(0, 3).map(s => s.j))
    } catch (error) {
      console.error('Error fetching related journeys:', error)
    }
  }

  const fetchData = async () => {
    try {
      const journeyDoc = await getDoc(doc(db, 'journeys', id))
      if (journeyDoc.exists()) setJourney({ id: journeyDoc.id, ...journeyDoc.data() })
      const settingsDoc = await getDoc(doc(db, 'settings', 'general'))
      if (settingsDoc.exists()) setSettings(settingsDoc.data())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: SANS, color: MUTE }}>Loading journey…</div>
  )
  if (!journey) return (
    <div style={{ padding: '80px 20px', textAlign: 'center', fontFamily: SANS, color: MUTE }}>Journey not found</div>
  )

  const primaryColor = settings?.primaryColor || '#d1356f'
  const secondaryColor = settings?.secondaryColor || '#D4A574'

  const t = journey.translations?.[lang]
  const displayTitle = (lang !== 'en' && t?.title) ? t.title : journey.title
  const displayDescription = (lang !== 'en' && t?.description) ? t.description : journey.description
  const highlights = (lang !== 'en' && t?.highlights?.length) ? t.highlights : (journey.highlights || [])
  const inclusions = (lang !== 'en' && t?.inclusions?.length) ? t.inclusions
    : (journey.inclusions?.length ? journey.inclusions : DEFAULT_INCLUSIONS)
  const exclusions = (lang !== 'en' && t?.exclusions?.length) ? t.exclusions : (journey.exclusions || [])
  // Itinerary days: translate title/description per day where available, falling
  // back to the English day for anything not translated.
  const days = (journey.itineraryDays || []).map((d, idx) => {
    const trDay = (lang !== 'en') ? t?.itineraryDays?.[idx] : null
    return {
      day: d.day,
      title: trDay?.title || d.title,
      description: trDay?.description || d.description,
      location: d.location
    }
  })
  const gallery = journey.gallery || []
  const practicalInfo = journey.practicalInfo || {}
  const faqs = journey.faqs || []

  return (
    <div style={{ fontFamily: SANS, color: INK, background: '#fff' }}>

      {/* Utility bar: back link + translation controls */}
      <div style={{
        maxWidth: '1180px', margin: '0 auto', padding: '18px 24px 0 24px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
      }}>
        <button
          onClick={() => navigate('/journeys')}
          style={{ background: 'none', border: 'none', color: MUTE, fontSize: '13.5px', fontWeight: 600, cursor: 'pointer', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ← All Journeys
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Manual translation for title/description, only shown if the journey has any */}
          {journey.translations && Object.keys(journey.translations).length > 0 && (
            <div style={{ display: 'flex', gap: '4px', background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '999px', padding: '3px' }}>
              {LANGUAGES.filter(l => l.code === 'en' || journey.translations[l.code]).map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  style={{
                    border: 'none', borderRadius: '999px', padding: '5px 11px', fontSize: '12px', fontWeight: 700,
                    cursor: 'pointer', background: lang === l.code ? primaryColor : 'transparent',
                    color: lang === l.code ? '#fff' : MUTE
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section style={{ position: 'relative', color: 'white', padding: '90px 24px 70px 24px', textAlign: 'center', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', overflow: 'hidden', marginTop: '8px' }}>
        <div className="journey-hero-bg" style={{
          position: 'absolute', inset: 0,
          backgroundImage: journey.featuredImage ? `url('${journey.featuredImage}')` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
          backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1
        }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(20,14,12,0.35) 0%, rgba(20,14,12,0.65) 100%)', zIndex: 2 }}></div>
        <div style={{ position: 'relative', zIndex: 3, maxWidth: '780px' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: '13px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700, color: secondaryColor }}>
            {journey.destination}
          </p>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px, 5vw, 54px)', margin: '0 0 18px 0', lineHeight: 1.1, textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
            {displayTitle}
          </h1>
          <div style={{ width: '48px', height: '2px', background: secondaryColor, margin: '0 auto 22px auto' }}></div>
          <p style={{ fontSize: '17px', lineHeight: 1.65, margin: 0, opacity: 0.95 }}>{displayDescription}</p>
        </div>
      </section>

      {/* Quick facts */}
      <section style={{ maxWidth: '1180px', margin: '-46px auto 0 auto', padding: '0 24px', position: 'relative', zIndex: 10 }}>
        <div style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 12px 36px rgba(43,35,32,0.12)', display: 'flex', flexWrap: 'wrap' }}>
          {[
            ['Duration', `${journey.duration} days`],
            ['Difficulty', journey.difficulty],
            ['From', `${journey.currency || '$'} ${journey.price}`],
            ['Destination', journey.destination]
          ].map(([label, value], i, arr) => (
            <div key={i} style={{
              flex: '1 1 200px', padding: '22px 24px', textAlign: 'center',
              borderRight: i === arr.length - 1 ? 'none' : `1px solid ${BORDER}`
            }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>{label}</p>
              <p style={{ margin: 0, fontFamily: SERIF, fontSize: '21px', color: INK, fontWeight: 700 }}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section style={{ maxWidth: '1180px', margin: '48px auto 0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '16px 18px', background: CANVAS, borderRadius: '10px', border: `1px solid ${BORDER}` }}>
                <span style={{ color: primaryColor, fontSize: '17px', lineHeight: 1, marginTop: '2px' }}>✦</span>
                <span style={{ fontSize: '14.5px', lineHeight: 1.55, color: INK }}>{h}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main content */}
      <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '56px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: '56px' }}>

          {/* Left */}
          <div>
            {/* Gallery */}
            {gallery.length > 0 && (
              <div style={{ marginBottom: '52px' }}>
                <SectionEyebrow color={primaryColor}>Gallery</SectionEyebrow>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px' }}>
                  {gallery.map((url, i) => (
                    <div key={i} onClick={() => setLightboxImg(url)} style={{ height: '130px', borderRadius: '10px', overflow: 'hidden', cursor: 'zoom-in' }}>
                      <img src={url} alt={`${journey.title} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary — signature element */}
            <div style={{ marginBottom: '52px' }}>
              <SectionEyebrow color={primaryColor}>{days.length > 0 ? `${days.length}-Day Itinerary` : 'Itinerary'}</SectionEyebrow>
              {days.length > 0 && <RouteMap days={days} color={primaryColor} />}
              {days.length > 0 ? (
                <div>
                  {days.map((d, i) => (
                    <div key={i} style={{ display: 'flex', gap: '22px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '44px' }}>
                        <span style={{
                          width: '44px', height: '44px', borderRadius: '50%', background: '#fff', border: `2px solid ${primaryColor}`, color: primaryColor,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px', fontFamily: SERIF, flexShrink: 0
                        }}>{d.day}</span>
                        {i !== days.length - 1 && <div style={{ flex: 1, width: '1px', background: BORDER, margin: '6px 0' }}></div>}
                      </div>
                      <div style={{ paddingBottom: i === days.length - 1 ? 0 : '32px' }}>
                        <h4 style={{ fontFamily: SERIF, margin: '8px 0 8px 0', color: INK, fontSize: '19px' }}>{d.title || `Day ${d.day}`}</h4>
                        <p style={{ margin: 0, color: '#5c5148', lineHeight: 1.75, fontSize: '14.5px' }}>{d.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '22px' }}>
                  <p style={{ color: '#5c5148', lineHeight: 1.8, margin: 0, fontSize: '14.5px' }}>
                    Day 1: Arrival & city orientation<br />
                    Day 2–{Math.max(journey.duration - 2, 2)}: Explore major attractions & local experiences<br />
                    Day {journey.duration}: Departure
                  </p>
                </div>
              )}
            </div>

            {/* About */}
            <div style={{ marginBottom: '52px' }}>
              <SectionEyebrow color={primaryColor}>About This Journey</SectionEyebrow>
              <p style={{ lineHeight: 1.85, color: '#5c5148', fontSize: '15px', margin: 0 }}>{displayDescription}</p>
            </div>

            {/* Inclusions / exclusions */}
            <div style={{ display: 'grid', gridTemplateColumns: exclusions.length ? '1fr 1fr' : '1fr', gap: '32px' }}>
              <div>
                <SectionEyebrow color={primaryColor}>What's Included</SectionEyebrow>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {inclusions.map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '14px', color: '#5c5148', lineHeight: 1.5 }}>
                      <span style={{ color: '#1a7a4c', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
              {exclusions.length > 0 && (
                <div>
                  <SectionEyebrow color={primaryColor}>Not Included</SectionEyebrow>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {exclusions.map((item, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '14px', color: '#5c5148', lineHeight: 1.5 }}>
                        <span style={{ color: '#b3423f', fontWeight: 700, flexShrink: 0 }}>✕</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Practical Info */}
            {(practicalInfo.bestTime || practicalInfo.visa || practicalInfo.currency || practicalInfo.packingList?.length > 0) && (
              <div style={{ marginTop: '52px' }}>
                <SectionEyebrow color={primaryColor}>Practical Information</SectionEyebrow>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {practicalInfo.bestTime && (
                    <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px 18px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>☀ Best Time to Visit</p>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#5c5148', lineHeight: 1.6 }}>{practicalInfo.bestTime}</p>
                    </div>
                  )}
                  {practicalInfo.visa && (
                    <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px 18px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>🛂 Visa</p>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#5c5148', lineHeight: 1.6 }}>{practicalInfo.visa}</p>
                    </div>
                  )}
                  {practicalInfo.currency && (
                    <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px 18px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>💳 Currency & Payments</p>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#5c5148', lineHeight: 1.6 }}>{practicalInfo.currency}</p>
                    </div>
                  )}
                  {practicalInfo.packingList?.length > 0 && (
                    <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '16px 18px' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>🧳 Packing List</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {practicalInfo.packingList.map((item, i) => (
                          <span key={i} style={{ fontSize: '12.5px', color: INK, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '999px', padding: '5px 12px' }}>{item}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FAQs */}
            {faqs.length > 0 && (
              <div style={{ marginTop: '52px' }}>
                <SectionEyebrow color={primaryColor}>Frequently Asked Questions</SectionEyebrow>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {faqs.map((f, i) => (
                    <div key={i} style={{ border: `1px solid ${BORDER}`, borderRadius: '10px', overflow: 'hidden' }}>
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        style={{
                          width: '100%', textAlign: 'left', padding: '15px 18px', background: openFaq === i ? CANVAS : '#fff',
                          border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'
                        }}
                      >
                        <span style={{ fontSize: '14.5px', fontWeight: 600, color: INK }}>{f.question}</span>
                        <span style={{ color: primaryColor, fontSize: '16px', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
                      </button>
                      {openFaq === i && (
                        <div style={{ padding: '0 18px 16px 18px', background: CANVAS }}>
                          <p style={{ margin: 0, fontSize: '13.5px', color: '#5c5148', lineHeight: 1.65 }}>{f.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '28px', position: 'sticky', top: '24px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>Starting from</p>
              <p style={{ margin: '0 0 20px 0', fontFamily: SERIF, fontSize: '34px', color: primaryColor, fontWeight: 700 }}>
                {journey.currency || '$'} {journey.price}
                <span style={{ fontSize: '13px', color: MUTE, fontWeight: 400, marginLeft: '6px', fontFamily: SANS }}>/ person</span>
              </p>

              <button
                onClick={() => alert('Booking system coming soon!')}
                style={{ width: '100%', padding: '15px', background: primaryColor, color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginBottom: '10px', transition: 'background 0.25s' }}
                onMouseOver={e => e.target.style.background = secondaryColor}
                onMouseOut={e => e.target.style.background = primaryColor}
              >
                Enquire About This Journey
              </button>
              <button
                onClick={() => toggleWishlist(journey.id, journey)}
                style={{
                  width: '100%', padding: '15px', background: checkWishlisted(journey.id) ? primaryColor : '#fff',
                  color: checkWishlisted(journey.id) ? 'white' : primaryColor, border: `1.5px solid ${primaryColor}`,
                  borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {checkWishlisted(journey.id) ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
              </button>
              <button
                onClick={() => downloadItineraryPdf(journey, days, inclusions, exclusions, practicalInfo)}
                style={{
                  width: '100%', padding: '13px', marginTop: '10px', background: 'transparent',
                  color: MUTE, border: `1px dashed ${BORDER}`,
                  borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px'
                }}
              >
                📄 Download Itinerary PDF
              </button>

              <div style={{ marginTop: '26px', paddingTop: '22px', borderTop: `1px solid ${BORDER}` }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>Need Help?</p>
                {settings?.phone && <p style={{ margin: '0 0 6px 0', color: '#5c5148', fontSize: '13.5px' }}>{settings.phone}</p>}
                {settings?.email && <p style={{ margin: 0, color: '#5c5148', fontSize: '13.5px' }}>{settings.email}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Journeys */}
      {related.length > 0 && (
        <section style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px 56px 24px' }}>
          <SectionEyebrow color={primaryColor}>You May Also Like</SectionEyebrow>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {related.map(rj => (
              <div
                key={rj.id}
                onClick={() => navigate(`/journey/${rj.id}`)}
                style={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${BORDER}`, cursor: 'pointer', background: '#fff' }}
              >
                <div style={{
                  height: '150px',
                  backgroundImage: rj.featuredImage ? `url('${rj.featuredImage}')` : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  backgroundSize: 'cover', backgroundPosition: 'center'
                }}></div>
                <div style={{ padding: '16px' }}>
                  <h4 style={{ fontFamily: SERIF, margin: '0 0 6px 0', fontSize: '16px', color: INK }}>{rj.title}</h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: MUTE }}>{rj.destination} · {rj.duration} days · {rj.currency || '$'} {rj.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`, color: 'white', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: SERIF, margin: '0 0 14px 0', fontSize: '30px' }}>Ready for Your Adventure?</h2>
        <p style={{ margin: '0 0 28px 0', fontSize: '15px', opacity: 0.95 }}>Limited spots available for this journey.</p>
        <button
          onClick={() => alert('Booking system coming soon!')}
          style={{ background: 'white', color: primaryColor, padding: '14px 36px', borderRadius: '999px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.18)' }}
        >
          Enquire Now →
        </button>
      </section>

      {/* Lightbox */}
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,12,0.9)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: '30px' }}>
          <img src={lightboxImg} alt="Gallery enlarged" style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '10px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} />
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          section[style*="grid-template-columns: minmax(0px, 2fr) minmax(280px, 1fr)"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .journey-hero-bg { background-attachment: scroll !important; background-size: cover !important; background-position: center !important; }
        }
      `}</style>
    </div>
  )
}

function SectionEyebrow({ children, color }) {
  return (
    <h3 style={{
      fontFamily: SERIF, fontSize: '22px', color: INK, margin: '0 0 20px 0',
      paddingBottom: '10px', borderBottom: `2px solid ${color}`, display: 'inline-block'
    }}>
      {children}
    </h3>
  )
}

// Loads jsPDF from CDN once, used to generate a downloadable itinerary PDF.
function loadJsPDF() {
  return new Promise((resolve) => {
    if (window.jspdf?.jsPDF) { resolve(window.jspdf.jsPDF); return }
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
    script.onload = () => resolve(window.jspdf.jsPDF)
    document.body.appendChild(script)
  })
}

async function downloadItineraryPdf(journey, days, inclusions, exclusions, practicalInfo) {
  const jsPDF = await loadJsPDF()
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 48
  let y = 60

  const addWrapped = (text, x, width, size, color, gap) => {
    doc.setFontSize(size)
    doc.setTextColor(color)
    const lines = doc.splitTextToSize(text, width)
    lines.forEach(line => {
      if (y > 780) { doc.addPage(); y = 60 }
      doc.text(line, x, y)
      y += size * 1.35
    })
    y += gap
  }

  doc.setFont('helvetica', 'bold')
  addWrapped(journey.title || 'Journey Itinerary', margin, pageWidth - margin * 2, 22, '#d1356f', 6)
  doc.setFont('helvetica', 'normal')
  addWrapped(`${journey.destination || ''}  •  ${journey.duration} days  •  ${journey.difficulty}`, margin, pageWidth - margin * 2, 11, '#8a7a6d', 14)
  addWrapped(journey.description || '', margin, pageWidth - margin * 2, 11, '#2b2320', 20)

  if (days.length > 0) {
    doc.setFont('helvetica', 'bold')
    addWrapped('Day-by-Day Itinerary', margin, pageWidth - margin * 2, 15, '#d1356f', 8)
    doc.setFont('helvetica', 'normal')
    days.forEach(d => {
      doc.setFont('helvetica', 'bold')
      addWrapped(`Day ${d.day}: ${d.title || ''}`, margin, pageWidth - margin * 2, 12, '#2b2320', 2)
      doc.setFont('helvetica', 'normal')
      addWrapped(d.description || '', margin, pageWidth - margin * 2, 10.5, '#5c5148', 10)
    })
  }

  if (inclusions.length > 0) {
    doc.setFont('helvetica', 'bold')
    addWrapped("What's Included", margin, pageWidth - margin * 2, 13, '#d1356f', 6)
    doc.setFont('helvetica', 'normal')
    inclusions.forEach(item => addWrapped(`✓ ${item}`, margin, pageWidth - margin * 2, 10.5, '#5c5148', 3))
    y += 8
  }

  if (exclusions.length > 0) {
    doc.setFont('helvetica', 'bold')
    addWrapped('Not Included', margin, pageWidth - margin * 2, 13, '#d1356f', 6)
    doc.setFont('helvetica', 'normal')
    exclusions.forEach(item => addWrapped(`✕ ${item}`, margin, pageWidth - margin * 2, 10.5, '#5c5148', 3))
    y += 8
  }

  if (practicalInfo.bestTime || practicalInfo.visa || practicalInfo.currency) {
    doc.setFont('helvetica', 'bold')
    addWrapped('Practical Information', margin, pageWidth - margin * 2, 13, '#d1356f', 6)
    doc.setFont('helvetica', 'normal')
    if (practicalInfo.bestTime) addWrapped(`Best time to visit: ${practicalInfo.bestTime}`, margin, pageWidth - margin * 2, 10.5, '#5c5148', 8)
    if (practicalInfo.visa) addWrapped(`Visa: ${practicalInfo.visa}`, margin, pageWidth - margin * 2, 10.5, '#5c5148', 8)
    if (practicalInfo.currency) addWrapped(`Currency: ${practicalInfo.currency}`, margin, pageWidth - margin * 2, 10.5, '#5c5148', 8)
  }

  doc.save(`${(journey.title || 'itinerary').replace(/[^a-z0-9]+/gi, '-')}.pdf`)
}

// Loads Leaflet from CDN once per page (no npm install needed) and geocodes
// each day's location name via OpenStreetMap's free Nominatim API, then
// plots numbered pins connected by a route line in itinerary order.
function loadLeaflet() {
  return new Promise((resolve) => {
    if (window.L) { resolve(window.L); return }
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => resolve(window.L)
    document.body.appendChild(script)
  })
}

const geocodeCache = {}
async function geocode(place) {
  if (geocodeCache[place]) return geocodeCache[place]
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(place)}`)
    const data = await res.json()
    if (data?.[0]) {
      const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
      geocodeCache[place] = coords
      return coords
    }
  } catch (e) {
    console.error('Geocoding failed for', place, e)
  }
  return null
}

function RouteMap({ days, color }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const markersRef = useRef([])
  const [status, setStatus] = useState('loading') // loading | ready | empty
  const [points, setPoints] = useState([])

  useEffect(() => {
    let cancelled = false

    async function build() {
      const daysWithLocation = days.filter(d => d.location && d.location.trim())
      if (daysWithLocation.length === 0) { setStatus('empty'); return }

      const L = await loadLeaflet()
      if (cancelled) return

      // Geocode sequentially with a short delay to stay within Nominatim's
      // fair-use rate limit (max ~1 request/second).
      const geocoded = []
      for (const d of daysWithLocation) {
        const coords = await geocode(d.location)
        if (coords) geocoded.push({ ...coords, day: d.day, title: d.title, location: d.location })
        await new Promise(r => setTimeout(r, 250))
      }
      if (cancelled || geocoded.length === 0) { setStatus('empty'); return }

      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: false })
      mapRef.current = map
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Muted, elegant basemap — far better suited to a luxury travel brand
      // than the default colorful OpenStreetMap tiles.
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 19
      }).addTo(map)

      const latlngs = geocoded.map(p => [p.lat, p.lng])
      markersRef.current = geocoded.map(p => {
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="position:relative; width:34px; height:44px;">
              <svg width="34" height="44" viewBox="0 0 34 44" style="position:absolute; top:0; left:0; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
                <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z" fill="${color}"/>
                <circle cx="17" cy="17" r="12" fill="#fff"/>
              </svg>
              <div style="position:absolute; top:6px; left:0; width:34px; text-align:center; font-weight:700; font-size:13px; color:${color}; font-family:${SERIF};">${p.day}</div>
            </div>`,
          iconSize: [34, 44],
          iconAnchor: [17, 44],
          popupAnchor: [0, -40]
        })
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(map)
        marker.bindPopup(
          `<div style="font-family:${SANS}; min-width:160px;">
             <div style="font-family:${SERIF}; font-weight:700; font-size:14px; color:${INK}; margin-bottom:2px;">Day ${p.day}${p.title ? ': ' + p.title : ''}</div>
             <div style="font-size:12px; color:${MUTE};">${p.location}</div>
           </div>`,
          { closeButton: false, className: 'journey-map-popup' }
        )
        return marker
      })

      if (latlngs.length > 1) {
        L.polyline(latlngs, { color, weight: 2.5, opacity: 0.55, dashArray: '1, 9', lineCap: 'round' }).addTo(map)
      }
      map.fitBounds(latlngs, { padding: [36, 36] })

      setPoints(geocoded)
      setStatus('ready')
    }

    build()
    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [days, color])

  const flyToStop = (idx) => {
    if (!mapRef.current || !markersRef.current[idx]) return
    const marker = markersRef.current[idx]
    mapRef.current.flyTo(marker.getLatLng(), Math.max(mapRef.current.getZoom(), 9), { duration: 0.6 })
    marker.openPopup()
  }

  if (status === 'empty') return null

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
        <p style={{ margin: 0, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>
          Route Map
        </p>
        {status === 'ready' && (
          <p style={{ margin: 0, fontSize: '12px', color: MUTE }}>{points.length} stop{points.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      <div
        ref={containerRef}
        style={{ height: '360px', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${BORDER}`, background: CANVAS, position: 'relative' }}
      >
        {status === 'loading' && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: MUTE, fontSize: '13px' }}>
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%',
              border: `2.5px solid ${BORDER}`, borderTopColor: color,
              animation: 'route-map-spin 0.8s linear infinite'
            }}></div>
            Plotting the route…
          </div>
        )}
      </div>

      {status === 'ready' && points.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '12px', paddingBottom: '4px' }}>
          {points.map((p, idx) => (
            <button
              key={idx}
              onClick={() => flyToStop(idx)}
              style={{
                flexShrink: 0, display: 'flex', alignItems: 'center', gap: '7px',
                background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '999px',
                padding: '6px 12px 6px 6px', cursor: 'pointer', fontFamily: SANS
              }}
            >
              <span style={{
                width: '20px', height: '20px', borderRadius: '50%', background: color, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10.5px', fontWeight: 700, flexShrink: 0
              }}>{p.day}</span>
              <span style={{ fontSize: '12.5px', color: INK, whiteSpace: 'nowrap' }}>{p.location.split(',')[0]}</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes route-map-spin { to { transform: rotate(360deg); } }
        .journey-map-popup .leaflet-popup-content-wrapper { border-radius: 10px; box-shadow: 0 6px 20px rgba(43,35,32,0.18); }
        .journey-map-popup .leaflet-popup-tip { box-shadow: none; }
        .leaflet-control-attribution { font-size: 9.5px !important; background: rgba(255,255,255,0.75) !important; }
        .leaflet-control-zoom a { color: ${INK} !important; }
      `}</style>
    </div>
  )
}
