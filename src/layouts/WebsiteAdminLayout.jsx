import { Outlet, Link, useNavigate } from 'react-router-dom'
import useNoIndex from '../hooks/useNoIndex'
import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function WebsiteAdminLayout() {
  useNoIndex()
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()
  const { logout } = useContext(AuthContext)

  const handleLogout = () => {
    logout()
    navigate('/ir-team-8x2k/login')
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
          {/* Main Features */}
          <Link to="/ir-team-8x2k" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📊</span>
            {expanded && <span>Dashboard</span>}
          </Link>
          <Link to="/ir-team-8x2k/journeys" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✈️</span>
            {expanded && <span>Journeys</span>}
          </Link>
          <Link to="/ir-team-8x2k/blog" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📝</span>
            {expanded && <span>Blog</span>}
          </Link>
          <Link to="/ir-team-8x2k/media" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📸</span>
            {expanded && <span>Media</span>}
          </Link>
          
          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '10px 0' }} />

          {/* Content Management */}
          <Link to="/ir-team-8x2k/team" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👥</span>
            {expanded && <span>Team</span>}
          </Link>
          <Link to="/ir-team-8x2k/reviews" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⭐</span>
            {expanded && <span>Reviews</span>}
          </Link>

          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '10px 0' }} />

          {/* Communication */}
          <Link to="/ir-team-8x2k/messages" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💬</span>
            {expanded && <span>Messages</span>}
          </Link>
          <Link to="/ir-team-8x2k/newsletter" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📧</span>
            {expanded && <span>Newsletter</span>}
          </Link>
          <Link to="/ir-team-8x2k/email-templates" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✉️</span>
            {expanded && <span>Email Templates</span>}
          </Link>

          <Link to="/ir-team-8x2k/faqs" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>❓</span>
            {expanded && <span>FAQs</span>}
          </Link>

          <Link to="/ir-team-8x2k/documentation" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📚</span>
            {expanded && <span>Documentation</span>}
          </Link>

          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '10px 0' }} />

          {/* Business */}
          <Link to="/ir-team-8x2k/clients" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>👤</span>
            {expanded && <span>Clients</span>}
          </Link>
          <Link to="/ir-team-8x2k/invoices" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📄</span>
            {expanded && <span>Invoices</span>}
          </Link>
          <Link to="/ir-team-8x2k/financial" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>💰</span>
            {expanded && <span>Financials</span>}
          </Link>

          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '10px 0' }} />

          {/* Maintenance */}
          <Link to="/ir-team-8x2k/activity" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📋</span>
            {expanded && <span>Activity Log</span>}
          </Link>
          <Link to="/ir-team-8x2k/social" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📱</span>
            {expanded && <span>Social</span>}
          </Link>
          <Link to="/ir-team-8x2k/settings" style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⚙️</span>
            {expanded && <span>Settings</span>}
          </Link>

          <hr style={{ borderColor: 'rgba(255,255,255,0.2)', margin: '10px 0' }} />

          {/* External Links */}
          <a 
            href="/" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'white', textDecoration: 'none', padding: '12px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)' }}
          >
            <span>🌐</span>
            {expanded && <span>View Website</span>}
          </a>

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
              gap: '10px',
              width: '100%'
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
