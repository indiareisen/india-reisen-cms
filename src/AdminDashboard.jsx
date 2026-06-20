import { useState, useRef } from 'react'
import { 
  collection, 
  addDoc,
  Timestamp 
} from 'firebase/firestore'
import { db } from './config/firebase'

const CLOUDINARY_CLOUD_NAME = 'dtz0urit6'

const brandColors = {
  primary: '#d1356f',
  secondary: '#c02560',
  accent: '#D4A574',
  light: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#ddd',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107'
}

function AdminDashboard() {
  const [adminTab, setAdminTab] = useState('itineraries')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleTabChange = (tab) => {
    setAdminTab(tab)
    clearMessages()
  }

  const renderContent = () => {
    switch(adminTab) {
      case 'itineraries': return <ItinerariesManager colors={brandColors} />
      case 'blogs': return <PlaceholderManager title="Blog Posts" colors={brandColors} />
      case 'team': return <PlaceholderManager title="Team Members" colors={brandColors} />
      case 'reviews': return <PlaceholderManager title="Reviews" colors={brandColors} />
      case 'settings': return <PlaceholderManager title="Settings" colors={brandColors} />
      default: return null
    }
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Admin Header */}
      <div style={{
        background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
        color: brandColors.white,
        padding: '30px',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 10px 0' }}>
          🔐 Admin Control Panel
        </h2>
        <p style={{ margin: 0, opacity: 0.95 }}>Manage all India Reisen content and settings</p>
      </div>

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {[
          { id: 'itineraries', label: '🗺️ Journeys' },
          { id: 'blogs', label: '📝 Blog Posts' },
          { id: 'team', label: '👥 Team' },
          { id: 'reviews', label: '⭐ Reviews' },
          { id: 'settings', label: '⚙️ Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            style={{
              padding: '12px 20px',
              background: adminTab === tab.id ? brandColors.primary : brandColors.white,
              color: adminTab === tab.id ? brandColors.white : brandColors.text,
              border: `2px solid ${adminTab === tab.id ? brandColors.primary : brandColors.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: adminTab === tab.id ? '600' : '500',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}

// ===== ITINERARIES MANAGER =====

function ItinerariesManager({ colors }) {
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    destinations: '',
    price: '',
    description: '',
    fullDescription: '',
    highlights: [''],
    included: [''],
    bestSeason: '',
    difficulty: 'Easy',
    category: 'Cultural Heritage',
    mediaGallery: [], // Images and Videos
    itinerary: [
      {
        day: 1,
        title: '',
        description: '',
        activities: [''],
        meals: [''],
        accommodation: ''
      }
    ],
    featured: false,
    published: false
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayInput = (field, index, value) => {
    const arr = [...formData[field]]
    arr[index] = value
    setFormData(prev => ({
      ...prev,
      [field]: arr
    }))
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleDayChange = (dayIndex, field, value) => {
    const itinerary = [...formData.itinerary]
    itinerary[dayIndex] = {
      ...itinerary[dayIndex],
      [field]: value
    }
    setFormData(prev => ({
      ...prev,
      itinerary
    }))
  }

  const handleDayArrayChange = (dayIndex, field, index, value) => {
    const itinerary = [...formData.itinerary]
    const arr = [...itinerary[dayIndex][field]]
    arr[index] = value
    itinerary[dayIndex] = {
      ...itinerary[dayIndex],
      [field]: arr
    }
    setFormData(prev => ({
      ...prev,
      itinerary
    }))
  }

  const addDayArrayItem = (dayIndex, field) => {
    const itinerary = [...formData.itinerary]
    itinerary[dayIndex] = {
      ...itinerary[dayIndex],
      [field]: [...itinerary[dayIndex][field], '']
    }
    setFormData(prev => ({
      ...prev,
      itinerary
    }))
  }

  const removeDayArrayItem = (dayIndex, field, index) => {
    const itinerary = [...formData.itinerary]
    itinerary[dayIndex] = {
      ...itinerary[dayIndex],
      [field]: itinerary[dayIndex][field].filter((_, i) => i !== index)
    }
    setFormData(prev => ({
      ...prev,
      itinerary
    }))
  }

  const addDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: '',
      description: '',
      activities: [''],
      meals: [''],
      accommodation: ''
    }
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay]
    }))
  }

  const uploadToCloudinary = async (files, resourceType) => {
    const uploadedMedia = []
    
    for (const file of files) {
      try {
        const formDataCloudinary = new FormData()
        formDataCloudinary.append('file', file)
        formDataCloudinary.append('upload_preset', 'india_reisen')
        formDataCloudinary.append('folder', `india-reisen/${resourceType}`)

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
          {
            method: 'POST',
            body: formDataCloudinary
          }
        )

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.secure_url) {
          uploadedMedia.push({
            url: data.secure_url,
            type: resourceType, // 'image' or 'video'
            caption: file.name,
            uploadedAt: new Date().toISOString()
          })
        }
      } catch (err) {
        console.error(`Error uploading ${resourceType}:`, err)
        setError(`Failed to upload ${file.name}. Please try again.`)
      }
    }

    return uploadedMedia
  }

  const handleMediaUpload = async (e, mediaType) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setLoading(true)
    try {
      const uploaded = await uploadToCloudinary(files, mediaType)
      setFormData(prev => ({
        ...prev,
        mediaGallery: [...prev.mediaGallery, ...uploaded]
      }))
      setSuccess(`${uploaded.length} ${mediaType}(s) uploaded successfully!`)
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError('Upload failed. Check browser console for details.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Journey title is required')
      return
    }
    if (!formData.duration.trim()) {
      setError('Duration is required (e.g., "7 Days")')
      return
    }
    if (!formData.price.trim()) {
      setError('Price is required (e.g., "₹50,000")')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const docData = {
        title: formData.title.trim(),
        duration: formData.duration.trim(),
        price: formData.price.trim(),
        destinations: formData.destinations.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        bestSeason: formData.bestSeason.trim(),
        difficulty: formData.difficulty,
        category: formData.category,
        highlights: formData.highlights.filter(h => h.trim()),
        included: formData.included.filter(i => i.trim()),
        mediaGallery: formData.mediaGallery,
        itinerary: formData.itinerary.map(day => ({
          day: day.day,
          title: day.title.trim(),
          description: day.description.trim(),
          activities: day.activities.filter(a => a.trim()),
          meals: day.meals.filter(m => m.trim()),
          accommodation: day.accommodation.trim()
        })),
        featured: formData.featured,
        published: formData.published,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        slug: formData.title.toLowerCase().replace(/\s+/g, '-')
      }

      await addDoc(collection(db, 'itineraries'), docData)
      
      setSuccess('🎉 Journey created successfully!')
      
      // Reset form
      setTimeout(() => {
        setShowForm(false)
        setFormData({
          title: '',
          duration: '',
          destinations: '',
          price: '',
          description: '',
          fullDescription: '',
          highlights: [''],
          included: [''],
          bestSeason: '',
          difficulty: 'Easy',
          category: 'Cultural Heritage',
          mediaGallery: [],
          itinerary: [
            {
              day: 1,
              title: '',
              description: '',
              activities: [''],
              meals: [''],
              accommodation: ''
            }
          ],
          featured: false,
          published: false
        })
        setSuccess(null)
      }, 2000)
    } catch (err) {
      console.error('Error saving journey:', err)
      setError(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div style={{
          background: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#d4edda',
          border: '1px solid #c3e6cb',
          color: '#155724',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <strong>✓ Success:</strong> {success}
        </div>
      )}

      {!showForm ? (
        <div>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '12px 25px',
              background: colors.primary,
              color: colors.white,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              marginBottom: '20px'
            }}
          >
            + Add New Journey
          </button>

          <div style={{
            background: colors.white,
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: `1px solid ${colors.border}`,
              fontWeight: '600',
              color: colors.text
            }}>
              Active Journeys (0)
            </div>
            <div style={{ padding: '20px', textAlign: 'center', color: colors.textMuted }}>
              <p>No journeys added yet. Click "Add New Journey" to create one! 🚀</p>
            </div>
          </div>
        </div>
      ) : (
        <ItineraryForm
          formData={formData}
          onInputChange={handleInputChange}
          onArrayChange={handleArrayInput}
          onAddArrayItem={addArrayItem}
          onRemoveArrayItem={removeArrayItem}
          onDayChange={handleDayChange}
          onDayArrayChange={handleDayArrayChange}
          onAddDayArrayItem={addDayArrayItem}
          onRemoveDayArrayItem={removeDayArrayItem}
          onAddDay={addDay}
          onMediaUpload={handleMediaUpload}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false)
            setError(null)
            setSuccess(null)
          }}
          loading={loading}
          colors={colors}
        />
      )}
    </div>
  )
}

// ===== ITINERARY FORM =====

function ItineraryForm({
  formData,
  onInputChange,
  onArrayChange,
  onAddArrayItem,
  onRemoveArrayItem,
  onDayChange,
  onDayArrayChange,
  onAddDayArrayItem,
  onRemoveDayArrayItem,
  onAddDay,
  onMediaUpload,
  onSubmit,
  onCancel,
  loading,
  colors
}) {
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  return (
    <form onSubmit={onSubmit} style={{
      background: colors.white,
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '30px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '30px', margin: '0 0 30px 0' }}>
        ✨ Create New Journey
      </h3>

      {/* Basic Info Section */}
      <div style={{
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: '30px',
        marginBottom: '30px'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.primary }}>
          Journey Details
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <FormField
            label="Journey Title *"
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange('title', e.target.value)}
            placeholder="e.g., Golden Triangle"
            colors={colors}
          />
          <FormField
            label="Duration *"
            type="text"
            value={formData.duration}
            onChange={(e) => onInputChange('duration', e.target.value)}
            placeholder="e.g., 7 Days"
            colors={colors}
          />
          <FormField
            label="Price *"
            type="text"
            value={formData.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            placeholder="e.g., ₹45,000 - ₹65,000"
            colors={colors}
          />
          <FormField
            label="Destinations"
            type="text"
            value={formData.destinations}
            onChange={(e) => onInputChange('destinations', e.target.value)}
            placeholder="e.g., Delhi, Jaipur, Agra"
            colors={colors}
          />
          <FormField
            label="Best Season"
            type="text"
            value={formData.bestSeason}
            onChange={(e) => onInputChange('bestSeason', e.target.value)}
            placeholder="e.g., October - March"
            colors={colors}
          />
          <FormField
            label="Difficulty Level"
            type="select"
            value={formData.difficulty}
            onChange={(e) => onInputChange('difficulty', e.target.value)}
            options={['Easy', 'Moderate', 'Challenging']}
            colors={colors}
          />
        </div>

        {/* Description */}
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
            Short Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Brief overview of the journey (2-3 sentences)"
            style={{
              width: '100%',
              minHeight: '80px',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              fontFamily: 'system-ui',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
            Full Description
          </label>
          <textarea
            value={formData.fullDescription}
            onChange={(e) => onInputChange('fullDescription', e.target.value)}
            placeholder="Detailed description of the entire journey"
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: `1px solid ${colors.border}`,
              borderRadius: '6px',
              fontFamily: 'system-ui',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Highlights & Included */}
      <div style={{
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: '30px',
        marginBottom: '30px'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.primary }}>
          Highlights & Inclusions
        </h4>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: colors.text }}>
            Highlights
          </label>
          {formData.highlights.map((highlight, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <input
                type="text"
                value={highlight}
                onChange={(e) => onArrayChange('highlights', idx, e.target.value)}
                placeholder={`Highlight ${idx + 1}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveArrayItem('highlights', idx)}
                style={{
                  padding: '10px 15px',
                  background: colors.danger,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddArrayItem('highlights')}
            style={{
              padding: '10px 20px',
              background: colors.accent,
              color: colors.white,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            + Add Highlight
          </button>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: colors.text }}>
            Inclusions
          </label>
          {formData.included.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
              <input
                type="text"
                value={item}
                onChange={(e) => onArrayChange('included', idx, e.target.value)}
                placeholder={`Inclusion ${idx + 1}`}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveArrayItem('included', idx)}
                style={{
                  padding: '10px 15px',
                  background: colors.danger,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => onAddArrayItem('included')}
            style={{
              padding: '10px 20px',
              background: colors.accent,
              color: colors.white,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            + Add Inclusion
          </button>
        </div>
      </div>

      {/* Media Gallery - Images & Videos */}
      <div style={{
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: '30px',
        marginBottom: '30px'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.primary }}>
          📸 Media Gallery (Images & Videos)
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          {/* Image Upload */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: colors.text }}>
              📸 Upload Images
            </label>
            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => onMediaUpload(e, 'image')}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '12px',
                background: colors.accent,
                color: colors.white,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Add Images
            </button>
          </div>

          {/* Video Upload */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: colors.text }}>
              🎬 Upload Videos
            </label>
            <input
              ref={videoInputRef}
              type="file"
              multiple
              accept="video/*"
              onChange={(e) => onMediaUpload(e, 'video')}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '12px',
                background: colors.primary,
                color: colors.white,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              + Add Videos
            </button>
          </div>
        </div>

        {/* Media Preview */}
        {formData.mediaGallery.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h5 style={{ fontWeight: '600', marginBottom: '15px', color: colors.text }}>
              📁 Media Gallery ({formData.mediaGallery.length} items)
            </h5>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
              gap: '15px' 
            }}>
              {formData.mediaGallery.map((media, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: colors.light,
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${colors.border}`
                  }}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={media.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <div style={{ fontSize: '32px', marginBottom: '10px' }}>🎬</div>
                      <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
                        Video
                      </p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemoveArrayItem('mediaGallery', idx)}
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      background: colors.danger,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '50%',
                      width: '30px',
                      height: '30px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Itinerary Days */}
      <div style={{
        borderBottom: `2px solid ${colors.border}`,
        paddingBottom: '30px',
        marginBottom: '30px'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: colors.primary }}>
          📅 Day-by-Day Itinerary
        </h4>
        {formData.itinerary.map((day, dayIdx) => (
          <div
            key={dayIdx}
            style={{
              background: colors.light,
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '15px',
              borderLeft: `4px solid ${colors.accent}`
            }}
          >
            <h5 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: colors.text, margin: '0 0 15px 0' }}>
              Day {day.day}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              <FormField
                label="Day Title"
                type="text"
                value={day.title}
                onChange={(e) => onDayChange(dayIdx, 'title', e.target.value)}
                placeholder="e.g., Arrival in Delhi"
                colors={colors}
              />
              <FormField
                label="Accommodation"
                type="text"
                value={day.accommodation}
                onChange={(e) => onDayChange(dayIdx, 'accommodation', e.target.value)}
                placeholder="e.g., The Leela Palace"
                colors={colors}
              />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
                Day Description
              </label>
              <textarea
                value={day.description}
                onChange={(e) => onDayChange(dayIdx, 'description', e.target.value)}
                placeholder="What will travelers experience on this day?"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: '10px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '4px',
                  fontFamily: 'system-ui',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
                Activities
              </label>
              {day.activities.map((activity, actIdx) => (
                <div key={actIdx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => onDayArrayChange(dayIdx, 'activities', actIdx, e.target.value)}
                    placeholder={`Activity ${actIdx + 1}`}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveDayArrayItem(dayIdx, 'activities', actIdx)}
                    style={{
                      padding: '8px 10px',
                      background: colors.danger,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onAddDayArrayItem(dayIdx, 'activities')}
                style={{
                  padding: '6px 12px',
                  background: colors.accent,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                + Activity
              </button>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
                Meals
              </label>
              {day.meals.map((meal, mealIdx) => (
                <div key={mealIdx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={meal}
                    onChange={(e) => onDayArrayChange(dayIdx, 'meals', mealIdx, e.target.value)}
                    placeholder={`Meal ${mealIdx + 1}`}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '4px',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveDayArrayItem(dayIdx, 'meals', mealIdx)}
                    style={{
                      padding: '8px 10px',
                      background: colors.danger,
                      color: colors.white,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onAddDayArrayItem(dayIdx, 'meals')}
                style={{
                  padding: '6px 12px',
                  background: colors.accent,
                  color: colors.white,
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                + Meal
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={onAddDay}
          style={{
            padding: '12px 25px',
            background: colors.accent,
            color: colors.white,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          + Add Day
        </button>
      </div>

      {/* Publish Options */}
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '10px' }}>
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => onInputChange('published', e.target.checked)}
          />
          <span style={{ fontWeight: '600', color: colors.text }}>✓ Publish this journey</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => onInputChange('featured', e.target.checked)}
          />
          <span style={{ fontWeight: '600', color: colors.text }}>✓ Featured journey</span>
        </label>
      </div>

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: '15px' }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 30px',
            background: loading ? colors.textMuted : colors.success,
            color: colors.white,
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600'
          }}
        >
          {loading ? '💾 Saving...' : '✅ Save Journey'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '12px 30px',
            background: colors.textMuted,
            color: colors.white,
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function FormField({ label, type, value, onChange, placeholder, options, colors }) {
  if (type === 'select') {
    return (
      <div>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
          {label}
        </label>
        <select
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: '10px',
            border: `1px solid ${colors.border}`,
            borderRadius: '6px',
            fontFamily: 'system-ui',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        >
          {options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: colors.text }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px',
          border: `1px solid ${colors.border}`,
          borderRadius: '6px',
          fontFamily: 'system-ui',
          fontSize: '14px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  )
}

function PlaceholderManager({ title, colors }) {
  return (
    <div style={{
      background: colors.white,
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      padding: '40px',
      textAlign: 'center',
      color: colors.textMuted
    }}>
      <p style={{ fontSize: '16px', margin: 0 }}>
        {title} manager coming soon! 🚀
      </p>
    </div>
  )
}

export default AdminDashboard
