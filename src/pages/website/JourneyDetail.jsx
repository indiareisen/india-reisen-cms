import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
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
  const { toggleWishlist, isWishlisted: checkWishlisted } = useWishlist()

  useEffect(() => { fetchData() }, [id])

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
      description: trDay?.description || d.description
    }
  })
  const gallery = journey.gallery || []

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

              <div style={{ marginTop: '26px', paddingTop: '22px', borderTop: `1px solid ${BORDER}` }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: MUTE, fontWeight: 700 }}>Need Help?</p>
                {settings?.phone && <p style={{ margin: '0 0 6px 0', color: '#5c5148', fontSize: '13.5px' }}>{settings.phone}</p>}
                {settings?.email && <p style={{ margin: 0, color: '#5c5148', fontSize: '13.5px' }}>{settings.email}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

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
  const [status, setStatus] = useState('loading') // loading | ready | empty

  useEffect(() => {
    let cancelled = false

    async function build() {
      const daysWithLocation = days.filter(d => d.location && d.location.trim())
      if (daysWithLocation.length === 0) { setStatus('empty'); return }

      const L = await loadLeaflet()
      if (cancelled) return

      // Geocode sequentially with a short delay to stay within Nominatim's
      // fair-use rate limit (max ~1 request/second).
      const points = []
      for (const d of daysWithLocation) {
        const coords = await geocode(d.location)
        if (coords) points.push({ ...coords, day: d.day, title: d.title, location: d.location })
        await new Promise(r => setTimeout(r, 250))
      }
      if (cancelled || points.length === 0) { setStatus('empty'); return }

      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
      const map = L.map(containerRef.current, { scrollWheelZoom: false })
      mapRef.current = map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map)

      const latlngs = points.map(p => [p.lat, p.lng])
      points.forEach(p => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="background:${color};color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;">${p.day}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        })
        L.marker([p.lat, p.lng], { icon }).addTo(map).bindPopup(`<strong>Day ${p.day}: ${p.title || p.location}</strong><br/>${p.location}`)
      })
      if (latlngs.length > 1) {
        L.polyline(latlngs, { color, weight: 3, opacity: 0.7, dashArray: '6, 8' }).addTo(map)
      }
      map.fitBounds(latlngs, { padding: [30, 30] })
      setStatus('ready')
    }

    build()
    return () => {
      cancelled = true
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [days, color])

  if (status === 'empty') return null

  return (
    <div style={{ marginBottom: '32px' }}>
      <div
        ref={containerRef}
        style={{ height: '340px', borderRadius: '10px', overflow: 'hidden', border: `1px solid ${BORDER}`, background: CANVAS }}
      >
        {status === 'loading' && (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: MUTE, fontSize: '13px' }}>
            Loading route map…
          </div>
        )}
      </div>
    </div>
  )
}
