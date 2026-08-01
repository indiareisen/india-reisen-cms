import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

const PINK = '#d1356f'
const GOLD = '#D4A574'
const INK = '#2b2320'
const BORDER = '#e8dfd7'
const CANVAS = '#faf6f2'

const emptyForm = {
  title: '',
  description: '',
  destination: '',
  duration: 5,
  difficulty: 'Easy',
  price: 0,
  currency: 'USD',
  featuredImage: '',
  gallery: [],
  highlights: [],
  itineraryDays: [],
  inclusions: [],
  exclusions: [],
  translations: {}
}

const TAB_LANGUAGES = [
  { code: 'hi', label: 'Hindi' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'pt', label: 'Portuguese (BR)' }
]

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'itinerary', label: 'Itinerary' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'details', label: 'Highlights & Inclusions' },
  { key: 'translations', label: 'Translations' }
]

const SAMPLE_JOURNEY = {
  title: 'Rajasthan Royal Heritage Trail',
  description: 'A seven-day journey through the forts, palaces, and desert landscapes of Rajasthan — from the Pink City of Jaipur to the golden dunes of Jaisalmer, with private access to heritage sites along the way.',
  destination: 'Jaipur, Udaipur, Jodhpur, Jaisalmer',
  duration: 7,
  difficulty: 'Moderate',
  price: 2400,
  currency: 'USD',
  featuredImage: 'https://picsum.photos/1200/800?random=101',
  gallery: [
    'https://picsum.photos/600/450?random=102',
    'https://picsum.photos/600/450?random=103',
    'https://picsum.photos/600/450?random=104',
    'https://picsum.photos/600/450?random=105',
    'https://picsum.photos/600/450?random=106',
    'https://picsum.photos/600/450?random=107'
  ],
  highlights: [
    'Private sunrise visit to Amber Fort before the crowds arrive',
    'Boutique heritage haveli stays in Udaipur',
    'Camel safari through the Thar Desert at sunset',
    'Guided walk through Jodhpur\'s Blue City lanes'
  ],
  itineraryDays: [
    { day: 1, title: 'Arrival in Jaipur', description: 'Land in Jaipur, transfer to your heritage hotel, and unwind with an evening welcome dinner featuring Rajasthani cuisine.' },
    { day: 2, title: 'Amber Fort & City Palace', description: 'Private sunrise visit to Amber Fort, followed by the City Palace and Jantar Mantar observatory in the afternoon.' },
    { day: 3, title: 'Jaipur to Udaipur', description: 'Scenic drive to Udaipur, checking into a lakeside haveli. Evening boat ride on Lake Pichola.' },
    { day: 4, title: 'City of Lakes', description: 'Explore the City Palace complex, Jagdish Temple, and the old town\'s artisan markets.' },
    { day: 5, title: 'Udaipur to Jodhpur', description: 'Drive to Jodhpur, the Blue City. Afternoon exploration of Mehrangarh Fort with panoramic desert views.' },
    { day: 6, title: 'Jodhpur to Jaisalmer', description: 'Journey into the Thar Desert to Jaisalmer. Evening camel safari and dinner under the stars among the dunes.' },
    { day: 7, title: 'Jaisalmer Fort & Departure', description: 'Morning at the living Jaisalmer Fort and Patwon Ki Haveli, then transfer for departure.' }
  ],
  inclusions: [
    'Private air-conditioned vehicle throughout',
    'Heritage hotel accommodation',
    'Daily breakfast and select dinners',
    'English-speaking local guides at each city',
    'All monument entry fees',
    'Camel safari and desert camp experience'
  ],
  exclusions: [
    'International and domestic flights',
    'Lunches (unless specified)',
    'Personal expenses and tips',
    'Travel insurance'
  ],
  translations: {
    hi: {
      title: 'राजस्थान शाही विरासत यात्रा',
      description: 'जयपुर, उदयपुर, जोधपुर और जैसलमेर के किलों, महलों और रेगिस्तानी परिदृश्यों से होकर सात दिन की यात्रा।',
      highlights: [
        'भीड़ आने से पहले आमेर किले की निजी सूर्योदय यात्रा',
        'उदयपुर में बुटीक हेरिटेज हवेली में ठहराव',
        'सूर्यास्त के समय थार रेगिस्तान में ऊंट सफारी'
      ],
      inclusions: ['निजी वातानुकूलित वाहन', 'हेरिटेज होटल आवास', 'दैनिक नाश्ता'],
      exclusions: ['अंतरराष्ट्रीय उड़ानें', 'व्यक्तिगत खर्च'],
      itineraryDays: [
        { title: 'जयपुर में आगमन', description: 'जयपुर पहुंचें और अपने हेरिटेज होटल में स्थानांतरित हों।' },
        { title: 'आमेर किला और सिटी पैलेस', description: 'आमेर किले की निजी सूर्योदय यात्रा।' }
      ]
    },
    fr: {
      title: 'Circuit du Patrimoine Royal du Rajasthan',
      description: 'Un voyage de sept jours à travers les forts, palais et paysages désertiques du Rajasthan, de Jaipur à Jaisalmer.',
      highlights: [
        'Visite privée au lever du soleil du fort d\'Amber',
        'Séjours en havelis patrimoniaux à Udaipur',
        'Safari à dos de chameau dans le désert du Thar au coucher du soleil'
      ],
      inclusions: ['Véhicule privé climatisé', 'Hébergement en hôtels patrimoniaux', 'Petit-déjeuner quotidien'],
      exclusions: ['Vols internationaux', 'Dépenses personnelles'],
      itineraryDays: [
        { title: 'Arrivée à Jaipur', description: 'Atterrissage à Jaipur, transfert vers votre hôtel patrimonial.' },
        { title: 'Fort d\'Amber et City Palace', description: 'Visite privée au lever du soleil du fort d\'Amber.' }
      ]
    },
    es: {
      title: 'Ruta del Patrimonio Real de Rajastán',
      description: 'Un viaje de siete días por los fuertes, palacios y paisajes desérticos de Rajastán, desde Jaipur hasta Jaisalmer.',
      highlights: [
        'Visita privada al amanecer al Fuerte Amber',
        'Estancias en havelis históricos en Udaipur',
        'Safari en camello por el desierto de Thar al atardecer'
      ],
      inclusions: ['Vehículo privado con aire acondicionado', 'Alojamiento en hoteles históricos', 'Desayuno diario'],
      exclusions: ['Vuelos internacionales', 'Gastos personales'],
      itineraryDays: [
        { title: 'Llegada a Jaipur', description: 'Aterrizaje en Jaipur, traslado a su hotel histórico.' },
        { title: 'Fuerte Amber y Palacio de la Ciudad', description: 'Visita privada al amanecer al Fuerte Amber.' }
      ]
    },
    de: {
      title: 'Rajasthans Königlicher Erbepfad',
      description: 'Eine siebentägige Reise durch die Festungen, Paläste und Wüstenlandschaften Rajasthans, von Jaipur bis Jaisalmer.',
      highlights: [
        'Privater Sonnenaufgangsbesuch im Amber Fort',
        'Aufenthalte in historischen Boutique-Havelis in Udaipur',
        'Kamelsafari durch die Thar-Wüste bei Sonnenuntergang'
      ],
      inclusions: ['Privates klimatisiertes Fahrzeug', 'Unterkunft in historischen Hotels', 'Tägliches Frühstück'],
      exclusions: ['Internationale Flüge', 'Persönliche Ausgaben'],
      itineraryDays: [
        { title: 'Ankunft in Jaipur', description: 'Landung in Jaipur, Transfer zu Ihrem historischen Hotel.' },
        { title: 'Amber Fort & City Palace', description: 'Privater Sonnenaufgangsbesuch im Amber Fort.' }
      ]
    },
    pt: {
      title: 'Rota do Patrimônio Real do Rajastão',
      description: 'Uma jornada de sete dias pelos fortes, palácios e paisagens desérticas do Rajastão, de Jaipur a Jaisalmer.',
      highlights: [
        'Visita privada ao nascer do sol no Forte Amber',
        'Estadias em havelis históricos em Udaipur',
        'Safári de camelo pelo deserto de Thar ao pôr do sol'
      ],
      inclusions: ['Veículo privado com ar-condicionado', 'Hospedagem em hotéis históricos', 'Café da manhã diário'],
      exclusions: ['Voos internacionais', 'Despesas pessoais'],
      itineraryDays: [
        { title: 'Chegada em Jaipur', description: 'Pouso em Jaipur, transporte até seu hotel histórico.' },
        { title: 'Forte Amber e City Palace', description: 'Visita privada ao nascer do sol no Forte Amber.' }
      ]
    }
  }
}

async function uploadToCloudinary(file) {
  const cloudForm = new FormData()
  cloudForm.append('file', file)
  cloudForm.append('upload_preset', 'india_reisen')
  const response = await fetch('https://api.cloudinary.com/v1_1/dl1q4dw72/image/upload', {
    method: 'POST',
    body: cloudForm
  })
  const data = await response.json()
  if (!data.secure_url) throw new Error('Upload failed')
  return data.secure_url
}

/* ---------- shared field primitives, styled once ---------- */

function Field({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? '1 / -1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#8a7a6d', marginBottom: '6px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '11px 13px',
  border: `1px solid ${BORDER}`,
  borderRadius: '7px',
  fontSize: '14.5px',
  color: INK,
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  background: '#fff'
}

function TextInput(props) {
  return <input {...props} style={{ ...inputStyle, ...(props.style || {}) }} />
}
function TextArea(props) {
  return <textarea {...props} style={{ ...inputStyle, resize: 'vertical', ...(props.style || {}) }} />
}
function Select(props) {
  return <select {...props} style={{ ...inputStyle, ...(props.style || {}) }} />
}

function PillButton({ children, onClick, tone = 'ghost', type = 'button', disabled }) {
  const tones = {
    ghost: { background: '#fff', color: PINK, border: `1.5px solid ${PINK}` },
    solid: { background: PINK, color: '#fff', border: `1.5px solid ${PINK}` },
    gold: { background: GOLD, color: '#fff', border: `1.5px solid ${GOLD}` },
    danger: { background: '#fff', color: '#b3423f', border: '1.5px solid #b3423f' }
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...tones[tone],
        padding: '8px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.15s ease'
      }}
    >
      {children}
    </button>
  )
}

/* ---------- repeatable-list editor (highlights / inclusions / exclusions) ---------- */

function ChipListEditor({ items, onChange, placeholder }) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const v = draft.trim()
    if (!v) return
    onChange([...items, v])
    setDraft('')
  }

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx))

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <TextInput
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
        />
        <PillButton onClick={add} tone="solid">+ Add</PillButton>
      </div>
      {items.length === 0 ? (
        <p style={{ color: '#a89a8d', fontSize: '13px', fontStyle: 'italic', margin: 0 }}>Nothing added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {items.map((item, idx) => (
            <span key={idx} style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: CANVAS, border: `1px solid ${BORDER}`, borderRadius: '999px',
              padding: '6px 8px 6px 14px', fontSize: '13px', color: INK
            }}>
              {item}
              <button
                onClick={() => remove(idx)}
                style={{ border: 'none', background: 'transparent', color: '#b3423f', cursor: 'pointer', fontSize: '15px', lineHeight: 1, padding: '2px' }}
                title="Remove"
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- day-by-day itinerary builder ---------- */

function ItineraryDaysEditor({ days, onChange }) {
  const addDay = () => {
    onChange([...days, { day: days.length + 1, title: '', description: '' }])
  }
  const updateDay = (idx, field, value) => {
    const next = days.map((d, i) => i === idx ? { ...d, [field]: value } : d)
    onChange(next)
  }
  const removeDay = (idx) => {
    const next = days.filter((_, i) => i !== idx).map((d, i) => ({ ...d, day: i + 1 }))
    onChange(next)
  }
  const moveDay = (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= days.length) return
    const next = [...days]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    onChange(next.map((d, i) => ({ ...d, day: i + 1 })))
  }

  return (
    <div>
      {days.length === 0 && (
        <p style={{ color: '#a89a8d', fontSize: '13px', fontStyle: 'italic', margin: '0 0 14px 0' }}>
          No days added yet. Build the trip day by day, or leave blank to show the default summary on the site.
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
        {days.map((d, idx) => (
          <div key={idx} style={{ border: `1px solid ${BORDER}`, borderRadius: '8px', padding: '14px', background: CANVAS, position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{
                width: '30px', height: '30px', borderRadius: '50%', background: PINK, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0
              }}>{d.day}</span>
              <TextInput
                value={d.title}
                placeholder="Day title — e.g. Arrival in Jaipur"
                onChange={(e) => updateDay(idx, 'title', e.target.value)}
                style={{ flex: 1 }}
              />
              <div style={{ display: 'flex', gap: '4px' }}>
                <button onClick={() => moveDay(idx, -1)} disabled={idx === 0} title="Move up"
                  style={{ border: `1px solid ${BORDER}`, background: '#fff', borderRadius: '6px', width: '28px', height: '28px', cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}>↑</button>
                <button onClick={() => moveDay(idx, 1)} disabled={idx === days.length - 1} title="Move down"
                  style={{ border: `1px solid ${BORDER}`, background: '#fff', borderRadius: '6px', width: '28px', height: '28px', cursor: idx === days.length - 1 ? 'default' : 'pointer', opacity: idx === days.length - 1 ? 0.4 : 1 }}>↓</button>
                <button onClick={() => removeDay(idx)} title="Remove day"
                  style={{ border: '1px solid #b3423f', color: '#b3423f', background: '#fff', borderRadius: '6px', width: '28px', height: '28px', cursor: 'pointer' }}>×</button>
              </div>
            </div>
            <TextArea
              value={d.description}
              placeholder="What happens this day — activities, meals, transfers..."
              onChange={(e) => updateDay(idx, 'description', e.target.value)}
              rows={2}
            />
          </div>
        ))}
      </div>
      <PillButton onClick={addDay} tone="gold">+ Add day {days.length + 1}</PillButton>
    </div>
  )
}

/* ---------- gallery uploader ---------- */

function GalleryEditor({ images, onChange }) {
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setUploading(true)
    try {
      const urls = await Promise.all(files.map(uploadToCloudinary))
      onChange([...images, ...urls])
    } catch {
      alert('Some images failed to upload. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const remove = (idx) => onChange(images.filter((_, i) => i !== idx))

  return (
    <div>
      <label style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: uploading ? 'not-allowed' : 'pointer',
        border: `1.5px dashed ${GOLD}`, borderRadius: '8px', padding: '12px 18px', background: '#fffaf3', marginBottom: '16px'
      }}>
        <input type="file" accept="image/*" multiple onChange={handleFiles} disabled={uploading} style={{ display: 'none' }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#8a6a2f' }}>
          {uploading ? '⏳ Uploading…' : '🖼️ Add gallery photos (multiple allowed)'}
        </span>
      </label>

      {images.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px' }}>
          {images.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', height: '90px', border: `1px solid ${BORDER}` }}>
              <img src={url} alt={`Gallery ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={() => remove(idx)}
                title="Remove"
                style={{
                  position: 'absolute', top: '4px', right: '4px', width: '22px', height: '22px', borderRadius: '50%',
                  border: 'none', background: 'rgba(0,0,0,0.6)', color: '#fff', cursor: 'pointer', fontSize: '13px', lineHeight: 1
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ================================= MAIN ================================= */

export default function JourneyManager() {
  const [journeys, setJourneys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { fetchJourneys() }, [])

  const fetchJourneys = async () => {
    try {
      const q = query(collection(db, 'journeys'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setJourneys(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching journeys:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHeroChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingHero(true)
    try {
      const url = await uploadToCloudinary(file)
      setFormData(prev => ({ ...prev, featuredImage: url }))
    } catch {
      alert('Image upload failed. Please try again.')
    } finally {
      setUploadingHero(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editingId) {
        await updateDoc(doc(db, 'journeys', editingId), { ...formData, updatedAt: Timestamp.now() })
      } else {
        await addDoc(collection(db, 'journeys'), { ...formData, createdAt: Timestamp.now() })
      }
      resetForm()
      fetchJourneys()
    } catch (error) {
      console.error('Error saving journey:', error)
      alert('Error saving journey.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (journey) => {
    setFormData({ ...emptyForm, ...journey })
    setEditingId(journey.id)
    setShowForm(true)
    setActiveTab('overview')
  }

  const handleDeleteJourney = async (id) => {
    if (window.confirm('Are you sure you want to delete this journey?')) {
      try {
        await deleteDoc(doc(db, 'journeys', id))
        fetchJourneys()
      } catch (error) {
        console.error('Error deleting journey:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setActiveTab('overview')
  }

  if (loading) return <div style={{ padding: '30px', fontFamily: 'inherit' }}>Loading journeys...</div>

  return (
    <div style={{ fontFamily: "'Georgia', 'Playfair Display', serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: INK }}>Journey Management</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          {!showForm && (
            <PillButton tone="gold" onClick={() => {
              setFormData({ ...emptyForm, ...SAMPLE_JOURNEY })
              setEditingId(null)
              setShowForm(true)
              setActiveTab('overview')
            }}>
              🎲 Load Sample
            </PillButton>
          )}
          <PillButton tone={showForm ? 'danger' : 'solid'} onClick={() => { showForm ? resetForm() : setShowForm(true) }}>
            {showForm ? '✕ Cancel' : '+ Add Journey'}
          </PillButton>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 2px 14px rgba(0,0,0,0.06)', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          {/* header */}
          <div style={{ padding: '22px 26px 0 26px' }}>
            <h2 style={{ margin: '0 0 4px 0', color: INK, fontSize: '22px' }}>{editingId ? 'Edit Journey' : 'Add New Journey'}</h2>
            <p style={{ margin: '0 0 18px 0', color: '#8a7a6d', fontSize: '13px', fontFamily: 'sans-serif' }}>
              Fill in each tab — only Overview is required to publish.
            </p>
          </div>

          {/* tabs */}
          <div style={{ display: 'flex', gap: '4px', padding: '0 26px', borderBottom: `1px solid ${BORDER}`, fontFamily: 'sans-serif' }}>
            {TABS.map(tab => (
              <button
                type="button"
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '12px 16px',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  color: activeTab === tab.key ? PINK : '#a89a8d',
                  borderBottom: activeTab === tab.key ? `2.5px solid ${PINK}` : '2.5px solid transparent',
                  marginBottom: '-1px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* tab content */}
          <div style={{ padding: '24px 26px', fontFamily: 'sans-serif' }}>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Field label="Title"><TextInput value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Golden Triangle Explorer" required /></Field>
                <Field label="Destination"><TextInput value={formData.destination} onChange={e => setFormData({ ...formData, destination: e.target.value })} placeholder="Delhi, Agra, Jaipur" required /></Field>
                <Field label="Description" span>
                  <TextArea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="A short, compelling summary shown on the journey card and hero." rows={3} required />
                </Field>
                <Field label="Duration (days)"><TextInput type="number" min="1" value={formData.duration} onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} required /></Field>
                <Field label="Difficulty">
                  <Select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}>
                    <option>Easy</option><option>Moderate</option><option>Challenging</option>
                  </Select>
                </Field>
                <Field label="Price"><TextInput type="number" min="0" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} required /></Field>
                <Field label="Currency">
                  <Select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                    <option value="USD">USD</option><option value="INR">INR</option><option value="EUR">EUR</option>
                  </Select>
                </Field>

                <div style={{ gridColumn: '1 / -1', border: `1.5px solid ${PINK}`, borderRadius: '8px', padding: '16px', background: '#fff5f9', marginTop: '4px' }}>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '10px', color: INK, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>📸 Featured Image</label>
                  <input type="file" accept="image/*" onChange={handleHeroChange} disabled={uploadingHero} style={{ width: '100%' }} />
                  {uploadingHero && <p style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>⏳ Uploading...</p>}
                  {formData.featuredImage && (
                    <img src={formData.featuredImage} alt="Preview" style={{ marginTop: '12px', maxWidth: '260px', borderRadius: '8px', display: 'block' }} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'itinerary' && (
              <ItineraryDaysEditor days={formData.itineraryDays} onChange={(days) => setFormData({ ...formData, itineraryDays: days })} />
            )}

            {activeTab === 'gallery' && (
              <GalleryEditor images={formData.gallery} onChange={(gallery) => setFormData({ ...formData, gallery })} />
            )}

            {activeTab === 'details' && (
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: INK }}>✨ Highlights</h4>
                  <ChipListEditor items={formData.highlights} onChange={(v) => setFormData({ ...formData, highlights: v })} placeholder="e.g. Private sunrise visit to the Taj Mahal" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: INK }}>✓ What's Included</h4>
                  <ChipListEditor items={formData.inclusions} onChange={(v) => setFormData({ ...formData, inclusions: v })} placeholder="e.g. Airport transfers" />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 10px 0', color: INK }}>✕ Not Included</h4>
                  <ChipListEditor items={formData.exclusions} onChange={(v) => setFormData({ ...formData, exclusions: v })} placeholder="e.g. International flights" />
                </div>
              </div>
            )}

            {activeTab === 'translations' && (
              <div>
                <p style={{ color: '#8a7a6d', fontSize: '13px', margin: '0 0 18px 0' }}>
                  Optional — translate this journey's full content per language. Visitors switch between these manually on the journey page; nothing here depends on machine translation, so leave any field blank to fall back to the English version.
                </p>
                <div style={{ display: 'grid', gap: '28px' }}>
                  {TAB_LANGUAGES.map(({ code, label }) => {
                    const tr = formData.translations?.[code] || {}
                    const updateTr = (patch) => setFormData({
                      ...formData,
                      translations: { ...formData.translations, [code]: { ...tr, ...patch } }
                    })
                    return (
                      <div key={code} style={{ border: `1px solid ${BORDER}`, borderRadius: '10px', padding: '18px', background: CANVAS }}>
                        <h4 style={{ margin: '0 0 14px 0', color: INK, fontSize: '15px' }}>{label}</h4>

                        <div style={{ display: 'grid', gap: '10px', marginBottom: '18px' }}>
                          <TextInput
                            placeholder={`Title in ${label}`}
                            value={tr.title || ''}
                            onChange={(e) => updateTr({ title: e.target.value })}
                          />
                          <TextArea
                            placeholder={`Description in ${label}`}
                            rows={2}
                            value={tr.description || ''}
                            onChange={(e) => updateTr({ description: e.target.value })}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#8a7a6d', marginBottom: '8px' }}>Highlights</label>
                          <ChipListEditor
                            items={tr.highlights || []}
                            onChange={(v) => updateTr({ highlights: v })}
                            placeholder={`Highlight in ${label}`}
                          />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#8a7a6d', marginBottom: '8px' }}>What's Included</label>
                          <ChipListEditor
                            items={tr.inclusions || []}
                            onChange={(v) => updateTr({ inclusions: v })}
                            placeholder={`Inclusion in ${label}`}
                          />
                        </div>

                        <div style={{ marginBottom: formData.itineraryDays.length ? '16px' : 0 }}>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#8a7a6d', marginBottom: '8px' }}>Not Included</label>
                          <ChipListEditor
                            items={tr.exclusions || []}
                            onChange={(v) => updateTr({ exclusions: v })}
                            placeholder={`Exclusion in ${label}`}
                          />
                        </div>

                        {formData.itineraryDays.length > 0 && (
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#8a7a6d', marginBottom: '8px' }}>Itinerary Days</label>
                            <div style={{ display: 'grid', gap: '10px' }}>
                              {formData.itineraryDays.map((day, idx) => {
                                const trDays = tr.itineraryDays || []
                                const trDay = trDays[idx] || {}
                                const updateDay = (field, value) => {
                                  const nextDays = formData.itineraryDays.map((_, i) => trDays[i] || {})
                                  nextDays[idx] = { ...nextDays[idx], [field]: value }
                                  updateTr({ itineraryDays: nextDays })
                                }
                                return (
                                  <div key={idx} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: '7px', padding: '10px' }}>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '11.5px', color: '#a89a8d' }}>Day {day.day} — {day.title || '(untitled)'}</p>
                                    <TextInput
                                      placeholder={`Day ${day.day} title in ${label}`}
                                      value={trDay.title || ''}
                                      onChange={(e) => updateDay('title', e.target.value)}
                                      style={{ marginBottom: '6px' }}
                                    />
                                    <TextArea
                                      placeholder={`Day ${day.day} description in ${label}`}
                                      rows={2}
                                      value={trDay.description || ''}
                                      onChange={(e) => updateDay('description', e.target.value)}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* footer */}
          <div style={{ padding: '18px 26px', borderTop: `1px solid ${BORDER}`, background: CANVAS, display: 'flex', gap: '12px', fontFamily: 'sans-serif' }}>
            <button
              type="submit"
              disabled={saving || uploadingHero}
              style={{
                padding: '12px 24px', background: saving ? '#ccc' : '#1a7a4c', color: '#fff', border: 'none',
                borderRadius: '7px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '14px'
              }}
            >
              {saving ? 'Saving…' : (editingId ? 'Update Journey' : 'Save Journey')}
            </button>
            <PillButton tone="ghost" onClick={resetForm}>Cancel</PillButton>
          </div>
        </form>
      )}

      <div style={{ padding: '24px', background: '#fff', borderRadius: '12px', border: `1px solid ${BORDER}` }}>
        <h2 style={{ color: INK, marginTop: 0 }}>Active Journeys ({journeys.length})</h2>
        {journeys.length === 0 ? (
          <p style={{ fontFamily: 'sans-serif', color: '#8a7a6d' }}>No journeys yet. Add one to get started!</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {journeys.map(journey => (
              <div key={journey.id} style={{ border: `1px solid ${BORDER}`, borderRadius: '10px', background: '#fff', overflow: 'hidden', fontFamily: 'sans-serif' }}>
                {journey.featuredImage ? (
                  <img src={journey.featuredImage} alt={journey.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '160px', background: `linear-gradient(135deg, ${PINK}, ${GOLD})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px' }}>
                    No Image Yet
                  </div>
                )}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: INK }}>{journey.title}</h3>
                  <p style={{ margin: '0 0 10px 0', fontSize: '13.5px', color: '#7a6c60' }}>{journey.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '12px', color: '#7a6c60', marginBottom: '10px' }}>
                    <span>📍 {journey.destination}</span>
                    <span>· ⏱️ {journey.duration}d</span>
                    <span>· 📈 {journey.difficulty}</span>
                    <span>· 💰 {journey.currency} {journey.price}</span>
                    {journey.itineraryDays?.length > 0 && <span>· 🗓️ {journey.itineraryDays.length}-day plan</span>}
                    {journey.gallery?.length > 0 && <span>· 🖼️ {journey.gallery.length} photos</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <PillButton tone="gold" onClick={() => handleEdit(journey)}>✏️ Edit</PillButton>
                    <PillButton tone="danger" onClick={() => handleDeleteJourney(journey.id)}>🗑️ Delete</PillButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
