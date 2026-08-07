import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

const PINK = '#d1356f'
const GOLD = '#D4A574'
const INK = '#2b2320'
const MUTE = '#8a7a6d'
const BORDER = '#e8dfd7'
const CANVAS = '#faf6f2'
const SERIF = "'Playfair Display', Georgia, serif"

const QUESTIONS = [
  {
    key: 'style',
    question: "What's your travel style?",
    options: [
      { label: 'Relaxed & Comfortable', value: 'Easy' },
      { label: 'Cultural Immersion', value: 'Moderate' },
      { label: 'Adventure Seeker', value: 'Challenging' }
    ]
  },
  {
    key: 'duration',
    question: 'How many days do you have?',
    options: [
      { label: 'Under 5 days', value: 'short' },
      { label: '5-8 days', value: 'medium' },
      { label: '9+ days', value: 'long' }
    ]
  },
  {
    key: 'budget',
    question: "What's your budget per person?",
    options: [
      { label: 'Budget-conscious', value: 'budget' },
      { label: 'Mid-range comfort', value: 'mid' },
      { label: 'Luxury, no limits', value: 'luxury' }
    ]
  },
  {
    key: 'group',
    question: "Who's traveling?",
    options: [
      { label: 'Just me', value: 'solo' },
      { label: 'As a couple', value: 'couple' },
      { label: 'With family', value: 'family' },
      { label: 'A group of friends', value: 'group' }
    ]
  }
]

function scoreJourney(journey, answers) {
  let score = 0
  if (journey.difficulty === answers.style) score += 3

  const d = journey.duration || 0
  if (answers.duration === 'short' && d < 5) score += 2
  if (answers.duration === 'medium' && d >= 5 && d <= 8) score += 2
  if (answers.duration === 'long' && d > 8) score += 2

  const p = journey.price || 0
  if (answers.budget === 'budget' && p < 1500) score += 2
  if (answers.budget === 'mid' && p >= 1500 && p < 2500) score += 2
  if (answers.budget === 'luxury' && p >= 2500) score += 2

  return score
}

export default function JourneyQuiz() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const selectAnswer = async (key, value) => {
    const nextAnswers = { ...answers, [key]: value }
    setAnswers(nextAnswers)

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setLoading(true)
      try {
        const snap = await getDocs(collection(db, 'journeys'))
        const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        const scored = all
          .map(j => ({ j, score: scoreJourney(j, nextAnswers) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map(s => s.j)
        setResults(scored)
      } catch (e) {
        console.error('Quiz matching failed:', e)
        setResults([])
      } finally {
        setLoading(false)
      }
    }
  }

  const restart = () => {
    setStep(0)
    setAnswers({})
    setResults(null)
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '70px 24px 90px 24px', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700 }}>Journey Finder</p>
        <h1 style={{ fontFamily: SERIF, fontSize: '32px', margin: 0, color: INK }}>Which Journey Suits You?</h1>
      </div>

      {!results && !loading && (
        <div>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '36px' }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= step ? PINK : BORDER }}></div>
            ))}
          </div>

          <h2 style={{ fontFamily: SERIF, fontSize: '24px', color: INK, textAlign: 'center', marginBottom: '28px' }}>
            {QUESTIONS[step].question}
          </h2>

          <div style={{ display: 'grid', gap: '12px' }}>
            {QUESTIONS[step].options.map(opt => (
              <button
                key={opt.value}
                onClick={() => selectAnswer(QUESTIONS[step].key, opt.value)}
                style={{
                  padding: '18px 24px', borderRadius: '10px', border: `1.5px solid ${BORDER}`, background: CANVAS,
                  fontSize: '15.5px', fontWeight: 600, color: INK, cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = PINK; e.currentTarget.style.background = '#fff5f9' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = CANVAS }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              style={{ marginTop: '20px', background: 'none', border: 'none', color: MUTE, fontSize: '13px', cursor: 'pointer' }}
            >
              ← Back
            </button>
          )}
        </div>
      )}

      {loading && (
        <p style={{ textAlign: 'center', color: MUTE }}>Finding your perfect journeys…</p>
      )}

      {results && !loading && (
        <div>
          <p style={{ textAlign: 'center', color: MUTE, marginBottom: '28px', fontSize: '14px' }}>
            Based on your answers, here's what we'd recommend:
          </p>
          {results.length === 0 ? (
            <p style={{ textAlign: 'center', color: MUTE }}>No journeys found yet — check back soon, or browse all journeys below.</p>
          ) : (
            <div style={{ display: 'grid', gap: '18px', marginBottom: '32px' }}>
              {results.map(j => (
                <div
                  key={j.id}
                  onClick={() => navigate(`/journey/${j.id}`)}
                  style={{ display: 'flex', gap: '16px', border: `1px solid ${BORDER}`, borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', background: '#fff' }}
                >
                  <div style={{
                    width: '140px', flexShrink: 0,
                    backgroundImage: j.featuredImage ? `url('${j.featuredImage}')` : `linear-gradient(135deg, ${PINK}, ${GOLD})`,
                    backgroundSize: 'cover', backgroundPosition: 'center'
                  }}></div>
                  <div style={{ padding: '16px 18px', flex: 1 }}>
                    <h3 style={{ fontFamily: SERIF, margin: '0 0 6px 0', color: INK, fontSize: '18px' }}>{j.title}</h3>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: MUTE }}>{j.destination} · {j.duration} days · {j.difficulty}</p>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: PINK }}>{j.currency || '$'} {j.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={restart}
              style={{ background: 'none', border: `1.5px solid ${PINK}`, color: PINK, borderRadius: '999px', padding: '10px 24px', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer' }}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
