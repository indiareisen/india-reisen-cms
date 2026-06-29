import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from './firebaseService'
import AdminDashboard from './AdminDashboard'
import MediaGallery from './components/admin/media/MediaGallery'
import ItineraryManager from './components/admin/itineraries/ItineraryManager'
import BlogManager from './components/admin/blog/BlogManager'
import TeamManager from './components/admin/team/TeamManager'
import ReviewsManager from './components/admin/reviews/ReviewsManager'
import InvoiceMaker from './components/admin/finance/InvoiceMaker'
import ClientManager from './components/admin/finance/ClientManager'
import AdminSettings from './components/admin/settings/AdminSettings'
import ContactMessages from './components/admin/ContactMessages'
import WebsiteManager from './components/admin/website/WebsiteManager'
import HomePage from './pages/website/HomePage'
import JourneysPage from './pages/website/JourneysPage'
import BlogPage from './pages/website/BlogPage'
import ContactPage from './pages/website/ContactPage'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const itinerariesSnapshot = await getDocs(query(collection(db, 'journeys'), orderBy('createdAt', 'desc')))
        const blogsSnapshot = await getDocs(query(collection(db, 'blogs'), orderBy('createdAt', 'desc')))
        const teamSnapshot = await getDocs(query(collection(db, 'team'), orderBy('createdAt', 'desc')))
        const reviewsSnapshot = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')))

        setItineraries(itinerariesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setBlogs(blogsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setTeam(teamSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setReviews(reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (activeTab === 'home') return <HomePage />
  if (activeTab === 'journeys') return <JourneysPage />
  if (activeTab === 'blog') return <BlogPage />
  if (activeTab === 'contact') return <ContactPage />

  return (
    <AdminDashboard
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      logoUrl={logoUrl}
      brandColors={brandColors}
      loading={loading}
      error={error}
      itineraries={itineraries}
      blogs={blogs}
      team={team}
      reviews={reviews}
      selectedItinerary={selectedItinerary}
      setSelectedItinerary={setSelectedItinerary}
    />
  )
}

export default App
