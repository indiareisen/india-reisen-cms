export default function Documentation() {
  const docs = [
    {
      title: 'Commission Invoice',
      description: 'Standalone tool for generating hotel commission invoices — company details, hotel database, commission/GST/TDS calculations, and PDF/PNG export.',
      icon: '🧾',
      href: '/docs/commission-invoice.html'
    },
    {
      title: 'GST Invoice (Guest Billing)',
      description: 'GST-compliant split invoice tool for billing guests directly — main tour invoice plus service charges, saved clients, saved invoice history, and PDF export.',
      icon: '💳',
      href: '/docs/gst-invoice.html'
    },
    {
      title: 'Social Media Studio',
      description: 'AI-assisted caption writer and image watermarking studio — punchline overlays, brand presets, multi-platform captions, and bulk image export.',
      icon: '✨',
      href: '/docs/social-media-studio.html'
    },
    {
      title: 'Itinerary Studio',
      description: 'Build client itineraries from a library of real reference trips — maps, weather charts, Instagram flyer export, and standalone downloadable itinerary pages.',
      icon: '🗺️',
      href: '/docs/itinerary-studio.html'
    }
  ]

  const primaryColor = '#d1356f'

  return (
    <div>
      <h1>📚 Documentation</h1>
      <p style={{ color: '#666' }}>
        Internal reference tools and documents for the India Reisen team.
      </p>

      <div style={{ background: '#fff9e6', border: '1px solid #ffe08a', borderRadius: '6px', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#7a5c00' }}>
        🔒 These are internal team resources — not intended for public visitors.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {docs.map((doc, idx) => (
          <a key={idx}
            href={doc.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '25px',
              transition: 'all 0.2s',
              cursor: 'pointer',
              height: '100%'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = primaryColor
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#ddd'
              e.currentTarget.style.boxShadow = 'none'
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{doc.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', color: primaryColor }}>{doc.title}</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.6' }}>{doc.description}</p>
              <p style={{ margin: '15px 0 0 0', color: primaryColor, fontSize: '13px', fontWeight: 'bold' }}>
                Open Tool →
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
