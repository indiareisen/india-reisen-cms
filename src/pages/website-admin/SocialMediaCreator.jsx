import { useState, useEffect, useRef } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '../../services/firebaseService'

const PLATFORM_SIZES = {
  'Instagram (Square)': { width: 1080, height: 1080 },
  'Instagram Story': { width: 1080, height: 1920 },
  'Facebook': { width: 1200, height: 630 },
  'X (Twitter)': { width: 1600, height: 900 },
  'LinkedIn': { width: 1200, height: 627 },
  'YouTube Thumbnail': { width: 1280, height: 720 },
  'Threads': { width: 1080, height: 1080 }
}

const LOGO_URL = 'https://res.cloudinary.com/dl1q4dw72/image/upload/v1781181114/final-logo_fqu772.png'
const CLOUDINARY_NAME = 'dl1q4dw72'
const CLOUDINARY_PRESET = 'india_reisen'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ')
  const lines = []
  let current = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)
  return lines
}

export default function SocialMediaCreator() {
  const [activeTab, setActiveTab] = useState('generator')

  // ===== Generator state =====
  const canvasRef = useRef(null)
  const [platform, setPlatform] = useState('Instagram (Square)')
  const [caption, setCaption] = useState('')
  const [bgImageUrl, setBgImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedDataUrl, setGeneratedDataUrl] = useState('')
  const [primaryColor] = useState('#d1356f')
  const [secondaryColor] = useState('#D4A574')

  // ===== Calendar state =====
  const [posts, setPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [calForm, setCalForm] = useState({ platform: 'Instagram (Square)', caption: '', scheduledDate: '', status: 'draft', imageUrl: '' })
  const [showCalForm, setShowCalForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'socialPosts'), orderBy('scheduledDate', 'asc'))
      const snap = await getDocs(q)
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoadingPosts(false)
    }
  }

  // ===== Generator handlers =====
  const handleBgUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_PRESET)
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (data.secure_url) {
        setBgImageUrl(data.secure_url)
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading image.')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const { width, height } = PLATFORM_SIZES[platform]
      const canvas = canvasRef.current
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Background
      if (bgImageUrl) {
        const bgImg = await loadImage(bgImageUrl)
        const scale = Math.max(width / bgImg.width, height / bgImg.height)
        const sw = bgImg.width * scale
        const sh = bgImg.height * scale
        ctx.drawImage(bgImg, (width - sw) / 2, (height - sh) / 2, sw, sh)
      } else {
        const grad = ctx.createLinearGradient(0, 0, width, height)
        grad.addColorStop(0, primaryColor)
        grad.addColorStop(1, secondaryColor)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, width, height)
      }

      // Bottom gradient overlay for text readability
      const overlayHeight = height * 0.32
      const overlayGrad = ctx.createLinearGradient(0, height - overlayHeight, 0, height)
      overlayGrad.addColorStop(0, 'rgba(0,0,0,0)')
      overlayGrad.addColorStop(1, 'rgba(0,0,0,0.72)')
      ctx.fillStyle = overlayGrad
      ctx.fillRect(0, height - overlayHeight, width, overlayHeight)

      // Caption text
      if (caption) {
        ctx.fillStyle = 'white'
        ctx.font = `bold ${Math.round(width * 0.032)}px Arial`
        ctx.textBaseline = 'bottom'
        const maxTextWidth = width * 0.88
        const lines = wrapText(ctx, caption, maxTextWidth)
        const lineHeight = width * 0.042
        let y = height - (width * 0.09)
        const startY = y - (lines.length - 1) * lineHeight
        lines.forEach((line, i) => {
          ctx.fillText(line, width * 0.06, startY + i * lineHeight)
        })
      }

      // Logo watermark (top-left)
      try {
        const logoImg = await loadImage(LOGO_URL)
        const logoWidth = width * 0.16
        const logoHeight = (logoImg.height / logoImg.width) * logoWidth
        ctx.fillStyle = 'rgba(255,255,255,0.85)'
        ctx.fillRect(width * 0.04 - 8, height * 0.04 - 8, logoWidth + 16, logoHeight + 16)
        ctx.drawImage(logoImg, width * 0.04, height * 0.04, logoWidth, logoHeight)
      } catch (e) {
        console.warn('Logo failed to load for watermark:', e)
      }

      // Handle watermark (bottom-right)
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.font = `bold ${Math.round(width * 0.022)}px Arial`
      ctx.textAlign = 'right'
      ctx.fillText('@indiareisen', width * 0.96, height * 0.965)
      ctx.textAlign = 'left'

      setGeneratedDataUrl(canvas.toDataURL('image/png'))
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Error generating image. If using a custom background, try re-uploading it.')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedDataUrl) return
    const a = document.createElement('a')
    a.href = generatedDataUrl
    a.download = `india-reisen-${platform.replace(/\s/g, '-').toLowerCase()}-${Date.now()}.png`
    a.click()
  }

  const handleSaveAsDraft = async () => {
    if (!generatedDataUrl) {
      alert('Generate an image first.')
      return
    }
    try {
      // Upload generated canvas image to Cloudinary
      const blob = await (await fetch(generatedDataUrl)).blob()
      const formData = new FormData()
      formData.append('file', blob)
      formData.append('upload_preset', CLOUDINARY_PRESET)
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      await addDoc(collection(db, 'socialPosts'), {
        platform,
        caption,
        imageUrl: data.secure_url || '',
        scheduledDate: '',
        status: 'draft',
        createdAt: Timestamp.now()
      })

      await fetchPosts()
      setActiveTab('calendar')
      alert('Saved to Content Calendar as a draft!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Error saving to calendar.')
    }
  }

  // ===== Calendar handlers =====
  const handleCalSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateDoc(doc(db, 'socialPosts', editingId), calForm)
      } else {
        await addDoc(collection(db, 'socialPosts'), { ...calForm, createdAt: Timestamp.now() })
      }
      resetCalForm()
      fetchPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post.')
    }
  }

  const handleCalEdit = (post) => {
    setCalForm({
      platform: post.platform || 'Instagram (Square)',
      caption: post.caption || '',
      scheduledDate: post.scheduledDate || '',
      status: post.status || 'draft',
      imageUrl: post.imageUrl || ''
    })
    setEditingId(post.id)
    setShowCalForm(true)
  }

  const handleCalDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      await deleteDoc(doc(db, 'socialPosts', id))
      fetchPosts()
    }
  }

  const resetCalForm = () => {
    setCalForm({ platform: 'Instagram (Square)', caption: '', scheduledDate: '', status: 'draft', imageUrl: '' })
    setShowCalForm(false)
    setEditingId(null)
  }

  const statusColor = { draft: '#999', scheduled: '#D4A574', posted: '#2D6A4F' }
  const inputStyle = { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }
  const tabStyle = (tab) => ({
    padding: '10px 20px',
    background: activeTab === tab ? '#d1356f' : '#f0f0f0',
    color: activeTab === tab ? 'white' : '#333',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    borderRadius: '4px 4px 0 0'
  })

  return (
    <div>
      <h1>📱 Social Media Creator</h1>
      <p style={{ color: '#666' }}>Generate branded post images and plan your content calendar.</p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '0', borderBottom: '2px solid #ddd' }}>
        <button style={tabStyle('generator')} onClick={() => setActiveTab('generator')}>🎨 Image Generator</button>
        <button style={tabStyle('calendar')} onClick={() => setActiveTab('calendar')}>📅 Content Calendar ({posts.length})</button>
      </div>

      <div style={{ background: 'white', padding: '30px', borderRadius: '0 0 8px 8px' }}>

        {activeTab === 'generator' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={inputStyle}>
                  {Object.keys(PLATFORM_SIZES).map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Caption / Overlay Text</label>
                <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="e.g. Discover the magic of Rajasthan ✨" rows={3} style={inputStyle} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Background Image (optional)</label>
                <input type="file" accept="image/*" onChange={handleBgUpload} disabled={uploading} style={inputStyle} />
                {uploading && <p style={{ fontSize: '12px', color: '#666' }}>⏳ Uploading...</p>}
                {bgImageUrl && <img src={bgImageUrl} alt="Background" style={{ maxWidth: '150px', marginTop: '10px', borderRadius: '4px' }} />}
                {!bgImageUrl && <p style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>No image? We'll use a brand gradient background instead.</p>}
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{ width: '100%', padding: '12px', background: generating ? '#ccc' : '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: generating ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginBottom: '10px' }}
              >
                {generating ? '⏳ Generating...' : '🎨 Generate Image'}
              </button>

              {generatedDataUrl && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={handleDownload} style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    ⬇️ Download PNG
                  </button>
                  <button onClick={handleSaveAsDraft} style={{ flex: 1, padding: '10px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    📅 Save to Calendar
                  </button>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Preview</label>
              <div style={{ background: '#f0f0f0', borderRadius: '8px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <canvas
                  ref={canvasRef}
                  style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: generatedDataUrl ? 'block' : 'none' }}
                />
                {!generatedDataUrl && <p style={{ color: '#999' }}>Your generated image will appear here</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0 }}>Content Calendar</h2>
              <button onClick={() => { if (showCalForm) resetCalForm(); else setShowCalForm(true) }} style={{ padding: '10px 20px', background: '#d1356f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                {showCalForm ? '✕ Cancel' : '+ Add Post'}
              </button>
            </div>

            {showCalForm && (
              <form onSubmit={handleCalSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>Platform</label>
                    <select value={calForm.platform} onChange={(e) => setCalForm({ ...calForm, platform: e.target.value })} style={inputStyle}>
                      {Object.keys(PLATFORM_SIZES).map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>Scheduled Date</label>
                    <input type="date" value={calForm.scheduledDate} onChange={(e) => setCalForm({ ...calForm, scheduledDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>Status</label>
                    <select value={calForm.status} onChange={(e) => setCalForm({ ...calForm, status: e.target.value })} style={inputStyle}>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="posted">Posted</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '13px' }}>Caption</label>
                  <textarea value={calForm.caption} onChange={(e) => setCalForm({ ...calForm, caption: e.target.value })} rows={3} style={inputStyle} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editingId ? 'Update Post' : 'Add Post'}
                </button>
              </form>
            )}

            {loadingPosts ? (
              <div>Loading...</div>
            ) : posts.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', color: '#999' }}>
                No posts planned yet. Generate an image or click "+ Add Post" to start.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {posts.map(post => (
                  <div key={post.id} style={{ display: 'flex', gap: '15px', background: '#f9f9f9', padding: '15px', borderRadius: '8px', alignItems: 'flex-start' }}>
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <div style={{ width: '80px', height: '80px', background: '#eee', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#999' }}>No image</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold' }}>{post.platform}</span>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white', background: statusColor[post.status] || '#999', padding: '2px 8px', borderRadius: '10px' }}>
                          {post.status}
                        </span>
                        {post.scheduledDate && <span style={{ fontSize: '12px', color: '#999' }}>📅 {post.scheduledDate}</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{post.caption || <em>No caption</em>}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => handleCalEdit(post)} style={{ padding: '6px 12px', background: '#D4A574', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                      <button onClick={() => handleCalDelete(post.id)} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
