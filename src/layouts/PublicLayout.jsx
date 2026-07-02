import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div>
      {/* Navigation */}
      <nav style={{
        background: '#d1356f',
        color: 'white',
        padding: '20px',
        display: 'flex',
        gap: '30px',
        justifyContent: 'center'
      }}>
        <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</a>
        <a href="/journeys" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🛣️ Journeys</a>
        <a href="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📝 Blog</a>
        <a href="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>✉️ Contact</a>
        <a href="/admin/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', marginLeft: 'auto' }}>🔐 Admin</a>
      </nav>

      {/* Page Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#333',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        marginTop: '50px'
      }}>
        <p>© 2024 India Reisen. Explore • Experience • Enchant</p>
      </footer>
    </div>
  )
}
