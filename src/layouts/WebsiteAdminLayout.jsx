import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function WebsiteAdminLayout() {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: expanded ? '280px' : '70px',
        background: '#d1356f',
        color: 'white',
        padding: '20px',
        transition: 'width 0.3s',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255,255,255,0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '20px',
            fontSize: '18px'
          }}
        >
          ☰
        </button>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Link to="/admin/website" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📊</span>
            {expanded && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/website/journeys" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✈️</span>
            {expanded && <span>Journeys</span>}
          </Link>
          <Link to="/admin/website/blog" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📝</span>
            {expanded && <span>Blog</span>}
          </Link>
          <Link to="/admin/website/media" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📸</span>
            {expanded && <span>Media</span>}
          </Link>
          <Link to="/admin/website/team" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👥</span>
            {expanded && <span>Team</span>}
          </Link>
          <Link to="/admin/website/reviews" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⭐</span>
            {expanded && <span>Reviews</span>}
          </Link>
          <Link to="/admin/website/messages" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💬</span>
            {expanded && <span>Messages</span>}
          </Link>
          <Link to="/admin/website/clients" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👤</span>
            {expanded && <span>Clients</span>}
          </Link>
          <Link to="/admin/website/invoices" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📄</span>
            {expanded && <span>Invoices</span>}
          </Link>
          <Link to="/admin/website/social" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📱</span>
            {expanded && <span>Social</span>}
          </Link>
          <Link to="/admin/website/settings" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚙️</span>
            {expanded && <span>Settings</span>}
          </Link>

          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '20px 0' }} />

          <button
            onClick={handleLogout}
            style={{
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              padding: '12px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>🚪</span>
            {expanded && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        marginLeft: expanded ? '280px' : '70px',
        flex: 1,
        padding: '30px',
        background: '#f5f5f5',
        transition: 'margin-left 0.3s'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
