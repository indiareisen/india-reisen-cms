import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from './config/firebase'
import AdminDashboard from './AdminDashboard'
import MediaGallery from './components/admin/media/MediaGallery'
import ItineraryManager from './components/admin/itineraries/ItineraryManager'
import BlogManager from './components/admin/blog/BlogManager'
import TeamManager from './components/admin/team/TeamManager'
import ReviewsManager from './components/admin/reviews/ReviewsManager'
import InvoiceMaker from './components/admin/finance/InvoiceMaker'
import ClientManager from './components/admin/finance/ClientManager'
import AdminSettings from './components/admin/settings/AdminSettings'
import Dashboard from './components/admin/Dashboard'
import SocialMediaCreator from './components/SocialMediaCreator'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Firebase Data States
  const [itineraries, setItineraries] = useState([])
  const [blogs, setBlogs] = useState([])
  const [team, setTeam] = useState([])
  const [reviews, setReviews] = useState([])

  const logoUrl = 'https://res.cloudinary.com/dtz0urit6/image/upload/q_auto:best,f_jpg/cloudinary-tools-uploads/zbv09lrxvsgyqpzhds9w'
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

  // Fetch all data from Firebase
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch Itineraries
      const itinQuery = query(collection(db, 'itineraries'), orderBy('createdAt', 'desc'))
      const itinDocs = await getDocs(itinQuery)
      const itinData = itinDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setItineraries(itinData)

      // Fetch Blogs
      const blogQuery = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
      const blogDocs = await getDocs(blogQuery)
      const blogData = blogDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setBlogs(blogData)

      // Fetch Team
      const teamDocs = await getDocs(collection(db, 'team'))
      const teamData = teamDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTeam(teamData)

      // Fetch Reviews
      const reviewQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
      const reviewDocs = await getDocs(reviewQuery)
      const reviewData = reviewDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setReviews(reviewData)

      setLoading(false)
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  // Render Dashboard
  const renderDashboard = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <div style={{ 
        background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
        color: brandColors.white,
        padding: '40px 30px',
        borderRadius: '12px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.5px' }}>
          🪷 Explore Experience Enchant
        </h2>
        <p style={{ fontSize: '15px', lineHeight: '1.7', marginBottom: '15px', maxWidth: '600px', margin: '0 auto 15px' }}>
          Every journey is more than just a trip—an immersive experience into the rich heritage and timeless charm of India. Our team of seasoned travel experts and local guides curates personalized itineraries combining cultural treasures with modern comforts.
        </p>
        <p style={{ opacity: 0.95, fontSize: '13px', color: 'rgba(255,255,255,0.9)' }}>
          ✨ Private heritage experiences • Cultural authenticity • Responsible tourism • Local community partnerships
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <StatCard label="Active Journeys" value={itineraries.length} color={brandColors.primary} />
        <StatCard label="Blog Posts" value={blogs.length} color={brandColors.accent} />
        <StatCard label="Team Members" value={team.length} color={brandColors.primary} />
        <StatCard label="Reviews" value={reviews.length} color={brandColors.accent} />
      </div>

      {/* Featured Journeys */}
      <div style={{ 
        background: brandColors.white, 
        padding: '30px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
      }}>
        <h3 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          color: brandColors.primary, 
          marginBottom: '25px',
          margin: '0 0 25px 0'
        }}>Featured Journeys</h3>
        <div style={{ display: 'grid', gap: '15px' }}>
          {itineraries.slice(0, 3).map((item) => (
            <div 
              key={item.id} 
              style={{ 
                borderLeft: `4px solid ${brandColors.accent}`, 
                paddingLeft: '20px', 
                paddingBottom: '15px', 
                borderBottom: `1px solid ${brandColors.border}`
              }}
            >
              <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '5px', color: brandColors.text }}>
                {item.title}
              </p>
              <p style={{ color: brandColors.textLight, fontSize: '13px', marginBottom: '8px' }}>
                {item.duration} • {item.destinations}
              </p>
              <p style={{ color: brandColors.textLight, fontSize: '13px', lineHeight: '1.5' }}>
                {item.description?.substring(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // Render Itineraries
  const renderItineraries = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '700', 
        color: brandColors.primary, 
        marginBottom: '30px',
        margin: '0 0 30px 0'
      }}>🗺️ Our Immersive Journeys</h2>
      {itineraries.length === 0 ? (
        <div style={{ 
          background: brandColors.white, 
          padding: '40px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          color: brandColors.textMuted 
        }}>
          <p>No itineraries yet. Go to Admin Panel to add one! 🚀</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px' 
        }}>
          {itineraries.map((item) => (
            <ItineraryCard 
              key={item.id} 
              item={item} 
              onSelect={setSelectedItinerary}
              colors={brandColors}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Render Blogs
  const renderBlogs = () => (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '700', 
        color: brandColors.primary, 
        marginBottom: '30px',
        margin: '0 0 30px 0'
      }}>📝 Blog & Insights</h2>
      {blogs.length === 0 ? (
        <div style={{ 
          background: brandColors.white, 
          padding: '40px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          color: brandColors.textMuted 
        }}>
          <p>No blog posts yet. Visit Admin Panel to write one! ✍️</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '25px' }}>
          {blogs.map((post) => (
            <BlogCard 
              key={post.id} 
              post={post}
              colors={brandColors}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Render Team
  const renderTeam = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '700', 
        color: brandColors.primary, 
        marginBottom: '30px',
        margin: '0 0 30px 0'
      }}>👥 Meet Our Team</h2>
      <p style={{ 
        color: brandColors.textLight, 
        marginBottom: '40px', 
        lineHeight: '1.8',
        maxWidth: '800px'
      }}>
        Our seasoned travel experts and local guides are passionate about creating unforgettable experiences. With years of experience and deep knowledge of India's hidden treasures, they ensure every journey is authentic and meaningful.
      </p>
      {team.length === 0 ? (
        <div style={{ 
          background: brandColors.white, 
          padding: '40px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          color: brandColors.textMuted 
        }}>
          <p>No team members added yet. Visit Admin Panel to add your team! 🌟</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px' 
        }}>
          {team.map((member) => (
            <TeamCard 
              key={member.id} 
              member={member}
              colors={brandColors}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Render Reviews
  const renderReviews = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '700', 
        color: brandColors.primary, 
        marginBottom: '30px',
        margin: '0 0 30px 0'
      }}>⭐ Traveler Stories</h2>
      {reviews.length === 0 ? (
        <div style={{ 
          background: brandColors.white, 
          padding: '40px', 
          borderRadius: '8px', 
          textAlign: 'center', 
          color: brandColors.textMuted 
        }}>
          <p>No reviews yet. Visit Admin Panel to add customer testimonials! 💬</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '25px' 
        }}>
          {reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              colors={brandColors}
            />
          ))}
        </div>
      )}
    </div>
  )

  // Render Community Impact
  const renderImpact = () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '26px', 
        fontWeight: '700', 
        color: brandColors.primary, 
        marginBottom: '30px',
        margin: '0 0 30px 0'
      }}>💚 Responsible Tourism & Community Impact</h2>
      <div style={{ 
        background: brandColors.white, 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
      }}>
        <p style={{ 
          color: brandColors.textLight, 
          fontSize: '15px', 
          lineHeight: '1.8', 
          marginBottom: '30px',
          maxWidth: '800px'
        }}>
          We are committed to delivering authentic and responsible travel experiences. Our focus on responsible and sustainable tourism means that we work closely with local communities to ensure that our travel practices benefit the people and preserve the environment.
        </p>
        <div style={{ display: 'grid', gap: '25px' }}>
          <ImpactItem 
            title="Community Partnerships" 
            description="We work with 50+ local guide partners and artisan cooperatives, ensuring fair wages and sustainable employment opportunities."
            colors={brandColors}
          />
          <ImpactItem 
            title="Sustainable Practices" 
            description="Eco-friendly accommodation choices, responsible transport options, and minimal environmental footprint in all our journeys."
            colors={brandColors}
          />
          <ImpactItem 
            title="Cultural Preservation" 
            description="Direct support for heritage site maintenance, cultural education, and efforts to preserve India's artistic legacy."
            colors={brandColors}
          />
          <ImpactItem 
            title="Authentic Experiences" 
            description="Every itinerary designed to provide genuine cultural immersion that respects local traditions while creating meaningful connections."
            colors={brandColors}
          />
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: brandColors.textLight }}>
          ⏳ Loading content...
        </div>
      )
    }

    if (error) {
      return (
        <div style={{ 
          background: '#fff3cd', 
          border: `1px solid #ffc107`, 
          padding: '20px', 
          borderRadius: '8px',
          color: '#856404',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <p style={{ marginBottom: '10px', fontWeight: '600' }}>Error loading content</p>
          <p style={{ marginBottom: '15px' }}>{error}</p>
          <button 
            onClick={loadAllData}
            style={{ 
              padding: '10px 20px', 
              background: '#ffc107', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    switch(activeTab) {
     case 'dashboard': return <Dashboard />
case 'media': return <MediaGallery />
case 'itineraries': return <ItineraryManager />
case 'blogs': return <BlogManager />
case 'team': return <TeamManager />
case 'reviews': return <ReviewsManager />
case 'clients': return <ClientManager />
case 'invoices': return <InvoiceMaker />
case 'social': return <SocialMediaCreator />
case 'admin': return <AdminSettings />
      default: return renderDashboard()
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      background: brandColors.light, 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: brandColors.text
    }}>
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        logoUrl={logoUrl}
        colors={brandColors}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header colors={brandColors} />
        <div style={{ 
          flex: 1, 
          overflow: 'auto', 
          padding: '40px',
          background: brandColors.light
        }}>
          {renderContent()}
        </div>
      </div>
      {selectedItinerary && (
        <ItineraryModal 
          item={selectedItinerary} 
          onClose={() => setSelectedItinerary(null)}
          colors={brandColors}
        />
      )}
    </div>
  )
}

// ===== COMPONENTS =====

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, logoUrl, colors }) => {
const navItems = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'itineraries', label: '🗺️ Journeys' },
  { id: 'blogs', label: '📝 Blog' },
  { id: 'media', label: '🖼️ Media' },
  { id: 'team', label: '👥 Team' },
  { id: 'reviews', label: '⭐ Reviews' },
  { id: 'clients', label: '👤 Manage Clients' },
  { id: 'invoices', label: '📄 Create Invoices' },
  { id: 'social', label: '📱 Social Content' },
  { id: 'admin', label: '🔐 Admin' }
  ]

  return (
    <div style={{
      width: sidebarOpen ? '260px' : '70px',
      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
      color: colors.white,
      padding: '20px',
      transition: 'width 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      {/* Logo & Toggle */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        {sidebarOpen && (
          <img 
            src={logoUrl} 
            alt="India Reisen" 
            style={{ height: '40px', objectFit: 'contain' }} 
          />
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: colors.white,
            padding: '8px 10px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'background 0.2s'
          }}
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === item.id ? colors.white : 'rgba(255,255,255,0.1)',
              color: activeTab === item.id ? colors.primary : colors.white,
              cursor: 'pointer',
              fontWeight: activeTab === item.id ? '600' : 'normal',
              textAlign: 'left',
              fontSize: sidebarOpen ? '14px' : '11px',
              overflow: 'hidden',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            aria-current={activeTab === item.id ? 'page' : undefined}
            title={sidebarOpen ? undefined : item.label}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

const Header = ({ colors }) => (
  <div style={{ 
    background: colors.white, 
    padding: '25px', 
    borderBottom: `1px solid ${colors.border}`, 
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
  }}>
    <h1 style={{ 
      fontSize: '28px', 
      fontWeight: '700', 
      color: colors.primary, 
      margin: '0 0 5px 0' 
    }}>India Reisen CMS</h1>
    <p style={{ 
      color: colors.textLight, 
      fontSize: '14px', 
      margin: 0 
    }}>Explore Experience Enchant</p>
  </div>
)

const StatCard = ({ label, value, color }) => (
  <div style={{ 
    background: '#fff', 
    padding: '25px', 
    borderRadius: '8px', 
    borderLeft: `4px solid ${color}`, 
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
    textAlign: 'center',
    transition: 'transform 0.2s'
  }}>
    <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px', fontWeight: '500' }}>
      {label}
    </p>
    <p style={{ fontSize: '32px', fontWeight: '700', color }}>{value}</p>
  </div>
)

const ItineraryCard = ({ item, onSelect, colors }) => (
  <div 
    role="button"
    tabIndex={0}
    style={{ 
      background: colors.white, 
      padding: '25px', 
      borderRadius: '8px', 
      borderTop: `4px solid ${colors.accent}`, 
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
      cursor: 'pointer', 
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.12)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
    }}
    onKeyDown={(e) => {
      if (e.key === 'Enter') onSelect(item)
    }}
    onClick={() => onSelect(item)}
  >
    <h3 style={{ 
      fontSize: '18px', 
      fontWeight: '600', 
      marginBottom: '10px',
      margin: '0 0 10px 0'
    }}>
      {item.title}
    </h3>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
      <p style={{ color: colors.textLight, fontSize: '13px' }}>
        {item.duration} • {item.destinations}
      </p>
      <p style={{ color: colors.primary, fontSize: '15px', fontWeight: '600' }}>
        {item.price}
      </p>
    </div>
    <p style={{ 
      color: colors.textLight, 
      fontSize: '13px', 
      lineHeight: '1.6', 
      marginBottom: '20px' 
    }}>
      {item.description?.substring(0, 120)}...
    </p>
    <button 
      onClick={(e) => {
        e.stopPropagation()
        onSelect(item)
      }}
      style={{ 
        width: '100%', 
        padding: '10px', 
        background: colors.primary, 
        color: colors.white, 
        border: 'none', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontWeight: '600',
        fontSize: '14px',
        transition: 'background 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.background = colors.secondary}
      onMouseLeave={(e) => e.target.style.background = colors.primary}
    >
      View Details
    </button>
  </div>
)

const BlogCard = ({ post, colors }) => (
  <div style={{ 
    background: colors.white, 
    padding: '25px', 
    borderRadius: '8px', 
    borderLeft: `4px solid ${colors.accent}`, 
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s'
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
      <div>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          marginBottom: '5px',
          margin: '0 0 5px 0'
        }}>
          {post.title}
        </h3>
        <p style={{ color: colors.textMuted, fontSize: '12px' }}>
          {post.category} • {post.author || 'India Reisen'}
        </p>
      </div>
    </div>
    <p style={{ 
      color: colors.textLight, 
      fontSize: '14px', 
      lineHeight: '1.7', 
      marginBottom: '15px' 
    }}>
      {post.excerpt || post.content?.substring(0, 150)}
    </p>
    <button 
      style={{ 
        color: colors.primary, 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer', 
        fontWeight: '600',
        padding: '0',
        fontSize: '14px',
        transition: 'color 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.color = colors.secondary}
      onMouseLeave={(e) => e.target.style.color = colors.primary}
    >
      Read More →
    </button>
  </div>
)

const TeamCard = ({ member, colors }) => (
  <div style={{ 
    background: colors.white, 
    padding: '30px', 
    borderRadius: '8px', 
    textAlign: 'center', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
    borderTop: `4px solid ${colors.accent}`,
    transition: 'transform 0.2s'
  }}
  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{ fontSize: '50px', marginBottom: '15px' }}>👤</div>
    <h3 style={{ 
      fontSize: '17px', 
      fontWeight: '600', 
      marginBottom: '5px',
      margin: '0 0 5px 0'
    }}>
      {member.name}
    </h3>
    <p style={{ 
      color: colors.primary, 
      fontWeight: '600', 
      fontSize: '13px', 
      marginBottom: '10px',
      margin: '0 0 10px 0'
    }}>
      {member.role}
    </p>
    <p style={{ color: colors.textLight, fontSize: '12px' }}>
      Expertise: {member.expertise}
    </p>
  </div>
)

const ReviewCard = ({ review, colors }) => (
  <div style={{ 
    background: colors.white, 
    padding: '25px', 
    borderRadius: '8px', 
    borderTop: `4px solid ${colors.accent}`, 
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
  }}>
    <div style={{ marginBottom: '15px' }}>
      <p style={{ fontSize: '15px', fontWeight: '600', marginBottom: '3px', margin: '0 0 3px 0' }}>
        {review.name}
      </p>
      <p style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '5px', margin: '0 0 5px 0' }}>
        {review.location}
      </p>
      <p style={{ color: colors.primary, fontSize: '13px', fontWeight: '500', margin: 0 }}>
        {review.journey}
      </p>
    </div>
    <div style={{ marginBottom: '12px', color: '#FFD700' }}>
      {'⭐'.repeat(review.rating || 5)}
    </div>
    <p style={{ 
      color: colors.textLight, 
      fontSize: '14px', 
      fontStyle: 'italic',
      lineHeight: '1.6'
    }}>
      "{review.quote}"
    </p>
  </div>
)

const ImpactItem = ({ title, description, colors }) => (
  <div style={{ display: 'flex', gap: '15px' }}>
    <span style={{ 
      color: colors.primary, 
      fontSize: '24px', 
      fontWeight: 'bold', 
      minWidth: '30px',
      flexShrink: 0
    }}>
      ✓
    </span>
    <div>
      <p style={{ fontWeight: '600', marginBottom: '8px', fontSize: '15px', margin: '0 0 8px 0' }}>
        {title}
      </p>
      <p style={{ color: colors.textLight, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
        {description}
      </p>
    </div>
  </div>
)

const ItineraryModal = ({ item, onClose, colors }) => (
  <div style={{ 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    background: 'rgba(0,0,0,0.7)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    zIndex: 1000, 
    padding: '20px' 
  }}>
    <div style={{ 
      background: colors.white, 
      borderRadius: '12px', 
      maxWidth: '600px', 
      width: '100%', 
      maxHeight: '80vh', 
      overflow: 'auto', 
      padding: '40px', 
      position: 'relative' 
    }}>
      <button 
        onClick={onClose}
        style={{ 
          position: 'absolute', 
          top: '20px', 
          right: '20px', 
          background: '#f0f0f0', 
          border: 'none', 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          cursor: 'pointer', 
          fontSize: '20px', 
          color: colors.primary,
          transition: 'background 0.2s'
        }}
        aria-label="Close modal"
        onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
        onMouseLeave={(e) => e.target.style.background = '#f0f0f0'}
      >
        ✕
      </button>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '700', 
        color: colors.primary, 
        marginBottom: '15px',
        margin: '0 0 15px 0'
      }}>
        {item.title}
      </h2>
      <p style={{ color: colors.textLight, marginBottom: '20px' }}>
        {item.duration} • {item.destinations} • {item.price}
      </p>
      <p style={{ 
        color: colors.textLight, 
        fontSize: '14px', 
        lineHeight: '1.8' 
      }}>
        {item.fullDescription || item.description}
      </p>
      <button 
        onClick={onClose}
        style={{ 
          marginTop: '20px', 
          padding: '12px 30px', 
          background: colors.primary, 
          color: colors.white, 
          border: 'none', 
          borderRadius: '6px', 
          cursor: 'pointer', 
          fontWeight: '600',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = colors.secondary}
        onMouseLeave={(e) => e.target.style.background = colors.primary}
      >
        Close
      </button>
    </div>
  </div>
)

export default App
