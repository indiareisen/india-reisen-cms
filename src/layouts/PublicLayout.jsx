import { Outlet, Link } from 'react-router-dom'

export default function PublicLayout() {
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
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Home</Link>
        <Link to="/journeys" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🛣️ Journeys</Link>
        <Link to="/blog" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>📝 Blog</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>✉️ Contact</Link>
        <Link to="/admin/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', marginLeft: 'auto' }}>🔐 Admin Login</Link>
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
