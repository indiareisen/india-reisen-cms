import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './layouts/PublicLayout'
import WebsiteAdminLayout from './layouts/WebsiteAdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminSetup from './pages/admin/AdminSetup'

// Public Pages
import HomePage from './pages/website/HomePage'
import JourneysPage from './pages/website/JourneysPage'
import JourneyDetail from './pages/website/JourneyDetail'
import WishlistPage from './pages/website/WishlistPage'
import BlogPage from './pages/website/BlogPage'
import BlogDetail from './pages/website/BlogDetail'
import ContactPage from './pages/website/ContactPage'

// Admin Pages
import AdminDashboard from './pages/website-admin/AdminDashboard'
import JourneyManager from './pages/website-admin/JourneyManager'
import BlogManager from './pages/website-admin/BlogManager'
import MediaGallery from './pages/website-admin/MediaGallery'
import TeamManager from './pages/website-admin/TeamManager'
import ReviewsManager from './pages/website-admin/ReviewsManager'
import ContactMessages from './pages/website-admin/ContactMessages'
import ClientManager from './pages/website-admin/ClientManager'
import InvoiceMaker from './pages/website-admin/InvoiceMaker'
import SocialMediaCreator from './pages/website-admin/SocialMediaCreator'
import WebsiteSettings from './pages/website-admin/WebsiteSettings'

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/journeys" element={<JourneysPage />} />
            <Route path="/journey/:id" element={<JourneyDetail />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/setup" element={<AdminSetup />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute><WebsiteAdminLayout /></ProtectedRoute>}>
            <Route path="/admin/website" element={<AdminDashboard />} />
            <Route path="/admin/website/journeys" element={<JourneyManager />} />
            <Route path="/admin/website/blog" element={<BlogManager />} />
            <Route path="/admin/website/media" element={<MediaGallery />} />
            <Route path="/admin/website/team" element={<TeamManager />} />
            <Route path="/admin/website/reviews" element={<ReviewsManager />} />
            <Route path="/admin/website/messages" element={<ContactMessages />} />
            <Route path="/admin/website/clients" element={<ClientManager />} />
            <Route path="/admin/website/invoices" element={<InvoiceMaker />} />
            <Route path="/admin/website/social" element={<SocialMediaCreator />} />
            <Route path="/admin/website/settings" element={<WebsiteSettings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
