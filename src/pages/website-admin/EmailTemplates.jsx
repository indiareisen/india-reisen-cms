import { useState } from 'react'

export default function EmailTemplates() {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: 'Welcome Email',
      subject: 'Welcome to India Reisen',
      body: 'Hello {name},\n\nThank you for subscribing to our newsletter! You will now receive updates about our latest journeys and special offers.\n\nBest regards,\nIndia Reisen Team'
    },
    {
      id: 2,
      name: 'Journey Confirmation',
      subject: 'Your Journey is Confirmed',
      body: 'Hello {name},\n\nWe are pleased to confirm your booking for the {journey} journey.\n\nDates: {dates}\nPrice: {price}\n\nFurther details will be sent soon.\n\nBest regards,\nIndia Reisen Team'
    },
    {
      id: 3,
      name: 'Special Offer',
      subject: 'Special Offer Just for You!',
      body: 'Hello {name},\n\nWe have an exclusive offer just for you! Get {discount}% off on selected journeys.\n\nOffer valid until {expiry}.\n\nBook now at india-reisen.com\n\nBest regards,\nIndia Reisen Team'
    }
  ])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({ name: '', subject: '', body: '' })

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template)
    setFormData(template)
    setEditing(true)
  }

  const handleSaveTemplate = () => {
    if (selectedTemplate) {
      setTemplates(templates.map(t => t.id === selectedTemplate.id ? { ...selectedTemplate, ...formData } : t))
      setEditing(false)
      setSelectedTemplate(null)
      alert('✅ Template updated')
    }
  }

  const primaryColor = '#d1356f'

  return (
    <div>
      <h1>📧 Email Templates</h1>
      <p style={{ color: '#666' }}>Manage email templates for newsletters and notifications</p>

      {/* Templates List and Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Left Side - Templates List */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ margin: '0 0 20px 0', color: primaryColor }}>Available Templates</h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => handleEditTemplate(template)}
                style={{
                  padding: '15px',
                  background: selectedTemplate?.id === template.id ? '#f0f0f0' : '#fff',
                  border: selectedTemplate?.id === template.id ? `2px solid ${primaryColor}` : '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseOver={(e) => {
                  if (selectedTemplate?.id !== template.id) {
                    e.currentTarget.style.background = '#f9f9f9'
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTemplate?.id !== template.id) {
                    e.currentTarget.style.background = '#fff'
                  }
                }}
              >
                <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>{template.name}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#999' }}>
                  {template.subject}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Template Editor */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px' }}>
          {selectedTemplate && editing ? (
            <div>
              <h2 style={{ margin: '0 0 20px 0', color: primaryColor }}>Edit Template</h2>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Body</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSaveTemplate}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  💾 Save
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setSelectedTemplate(null)
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#999',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Cancel
                </button>
              </div>

              <div style={{ marginTop: '20px', padding: '15px', background: '#f0f0f0', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#666', fontSize: '12px' }}>
                  📝 Available Variables:
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>
                  {'{name}'} {'{email}'} {'{journey}'} {'{price}'} {'{dates}'} {'{discount}'} {'{expiry}'}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <p>Select a template to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
