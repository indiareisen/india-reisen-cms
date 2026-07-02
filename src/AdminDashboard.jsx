import { useState } from 'react'
import Dashboard from './components/admin/Dashboard'
import ItineraryManager from './components/admin/itineraries/ItineraryManager'
import BlogManager from './components/admin/blog/BlogManager'
import MediaGallery from './components/admin/media/MediaGallery'
import TeamManager from './components/admin/team/TeamManager'
import ReviewsManager from './components/admin/reviews/ReviewsManager'
import InvoiceMaker from './components/admin/finance/InvoiceMaker'
import ClientManager from './components/admin/finance/ClientManager'
import AdminSettings from './components/admin/settings/AdminSettings'
import ContactMessages from './components/admin/ContactMessages'
import SocialMediaCreator from './components/SocialMediaCreator'
import HomePage from './pages/website/HomePage'
import JourneysPage from './pages/website/JourneysPage'
import BlogPage from './pages/website/BlogPage'
import ContactPage from './pages/website/ContactPage'

const brandColors = {
  primary: '#d1356f',
  secondary: '#c02560',
  accent: '#D4A574',
  light: '#f5f5f5',
  white: '#ffffff',
  text: '#333333',
  textLight: '#666666',
  textMuted: '#999999',
  border: '#ddd'
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const menuItems = [
    { id: 'contact', label: 'Contact Messages', icon: '💬' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'journeys', label: 'Journeys', icon: '🛣️' },
    { id: 'blog', label: 'Blog', icon: '📝' },
    { id: 'media', label: 'Media', icon: '🎬' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'clients', label: 'Manage Clients', icon: '👨‍💼' },
    { id: 'invoices', label: 'Create Invoices', icon: '💰' },
    { id: 'social', label: 'Social Content', icon: '📱' },
    { id: 'settings', label: 'Admin', icon: '⚙️' },
    { id: 'website-home', label: 'Website Home', icon: '🏠' },
    { id: 'website-journeys', label: 'Website Journeys', icon: '🗺️' },
    { id: 'website-blog', label: 'Website Blog', icon: '📖' },
    { id: 'website-contact', label: 'Website Contact', icon: '✉️' },
    { id: 'view-website', label: 'View Website', icon: '🌐' }
  ]

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard />
      case 'journeys': return <ItineraryManager />
      case 'blog': return <BlogManager />
      case 'media': return <MediaGallery />
      case 'team': return <TeamManager />
      case 'reviews': return <ReviewsManager />
      case 'invoices': return <InvoiceMaker />
      case 'clients': return <ClientManager />
      case 'social': return <SocialMediaCreator />
      case 'settings': return <AdminSettings />
      case 'contact': return <ContactMessages />
      case 'website-home': return <HomePage />
      case 'website-journeys': return <JourneysPage />
      case 'website-blog': return <BlogPage />
      case 'website-contact': return <ContactPage />
      case 'view-website': 
        window.open('/', '_blank')
        return <div style={{ padding: '20px', textAlign: 'center' }}><p>Opening website...</p></div>
      default: return <Dashboard />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: brandColors.light }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '0',
        background: brandColors.primary,
        color: brandColors.white,
        padding: sidebarOpen ? '20px' : '0',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        borderRight: `1px solid ${brandColors.secondary}`
      }}>
        {/* Logo */}
        {sidebarOpen && (
          <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: `1px solid ${brandColors.secondary}` }}>
            <img src="/final-logo_fqu772.png" alt="India Reisen" style={{ width: '100%', maxWidth: '200px' }} />
          </div>
        )}

        {/* Menu Items */}
        <nav>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                padding: '15px 12px',
                background: activeTab === item.id ? brandColors.secondary : 'transparent',
                color: brandColors.white,
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '8px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                fontSize: '14px',
                fontWeight: activeTab === item.id ? '600' : '500',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={(e) => activeTab !== item.id && (e.target.style.background = brandColors.secondary)}
              onMouseOut={(e) => activeTab !== item.id && (e.target.style.background = 'transparent')}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Top Bar */}
        <div style={{
          padding: '20px',
          background: brandColors.white,
          borderBottom: `1px solid ${brandColors.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: brandColors.primary,
              color: brandColors.white,
              border: 'none',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            {sidebarOpen ? '☰' : '→'}
          </button>
          <h1 style={{ margin: 0, color: brandColors.text }}>India Reisen CMS</h1>
          <div style={{ width: '60px' }}></div>
        </div>

        {/* Content Area */}
        <div style={{ padding: '30px' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
