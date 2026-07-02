import { Outlet } from 'react-router-dom'
import { useState } from 'react'

export default function PublicLayout() {
  const [showNav, setShowNav] = useState(true)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <nav style={{
        background: '#d1356f',
        color: 'white',
        padding: '15px 20px',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</a>
        <a href="/journeys" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🛣️ Journeys</a>
        <a href="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📝 Blog</a>
        <a href="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>✉️ Contact</a>
        <a href="/admin/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', marginLeft: 'auto' }}>🔐 Admin Login</a>
      </nav>

      {/* Page Content */}
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        marginTop: '20px'
      }}>
        <p>© 2024 India Reisen. Explore • Experience • Enchant</p>
      </footer>
    </div>
  )
}
