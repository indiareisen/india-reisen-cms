import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LogoutButton from '../components/LogoutButton'

const brandColors = {
  primary: '#d1356f',
  secondary: '#c02560',
  accent: '#D4A574'
}

export default function WebsiteAdminLayout() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { label: '📊 Dashboard', path: '/admin/website/dashboard' },
    { label: '🛣️ Journeys', path: '/admin/website/journeys' },
    { label: '📝 Blog', path: '/admin/website/blog' },
    { label: '🎬 Media', path: '/admin/website/media' },
    { label: '👥 Team', path: '/admin/website/team' },
    { label: '⭐ Reviews', path: '/admin/website/reviews' },
    { label: '💬 Messages', path: '/admin/website/messages' },
    { label: '⚙️ Settings', path: '/admin/website/settings' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{
        width: sidebarOpen ? '260px' : '0',
        background: brandColors.primary,
        color: 'white',
        padding: sidebarOpen ? '20px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s'
      }}>
        {sidebarOpen && (
          <>
            <h2>📱 Website Admin</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menuItems.map((item, idx) => (
                <a key={idx} href={item.path} style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  display: 'block'
                }}>
                  {item.label}
                </a>
              ))}
            </nav>
          </>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: brandColors.primary,
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            {sidebarOpen ? '☰' : '→'}
          </button>
          <h1>Website Admin Portal</h1>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span>{user?.email}</span>
            <LogoutButton />
          </div>
        </div>

        <div style={{ flex: 1, padding: '30px', overflow: 'auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
