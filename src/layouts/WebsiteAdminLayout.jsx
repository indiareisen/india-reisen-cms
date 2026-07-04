import React, { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
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
    { id: 'dashboard', label: 'Dashboard', path: '/admin/website/dashboard' },
    { id: 'journeys', label: 'Journeys', path: '/admin/website/journeys' },
    { id: 'blog', label: 'Blog', path: '/admin/website/blog' },
    { id: 'media', label: 'Media', path: '/admin/website/media' },
    { id: 'team', label: 'Team', path: '/admin/website/team' },
    { id: 'reviews', label: 'Reviews', path: '/admin/website/reviews' },
    { id: 'messages', label: 'Messages', path: '/admin/website/messages' },
    { id: 'clients', label: 'Clients', path: '/admin/website/clients' },
    { id: 'invoices', label: 'Invoices', path: '/admin/website/invoices' },
    { id: 'social', label: 'Social Media', path: '/admin/website/social' },
    { id: 'settings', label: 'Settings', path: '/admin/website/settings' }
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
            <h2 style={{ marginTop: 0 }}>Website Admin</h2>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {menuItems.map(item => (
                <Link
                  key={item.id}
                  to={item.path}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    display: 'block',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.label}
                </Link>
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
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: brandColors.primary,
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Menu
          </button>
          <h1>Website Admin Portal</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a href="/" style={{
              background: '#28a745',
              color: 'white',
              padding: '8px 15px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}>
              View Website
            </a>
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
