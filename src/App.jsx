import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './layouts/PublicLayout'
import WebsiteAdminLayout from './layouts/WebsiteAdminLayout'
import AdminLogin from './pages/admin/AdminLogin'

// Public Pages
import HomePage from './pages/website/HomePage'
import JourneysPage from './pages/website/JourneysPage'
import JourneyDetail from './pages/website/JourneyDetail'
import WishlistPage from './pages/website/WishlistPage'
import BlogPage from './pages/website/BlogPage'
import BlogDetail from './pages/website/BlogDetail'
import ContactPage from './pages/website/ContactPage'
import PrivacyPolicy from './pages/website/PrivacyPolicy'

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
import NewsletterManager from './pages/website-admin/NewsletterManager'
import FinancialReports from './pages/website-admin/FinancialReports'
import ActivityLog from './pages/website-admin/ActivityLog'
import EmailTemplates from './pages/website-admin/EmailTemplates'
import FAQManager from './pages/website-admin/FAQManager'

// 🔒 Change this constant if you ever want to rotate the secret admin path
const ADMIN_PATH = 'ir-team-8x2k'

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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          </Route>

          {/* Secret Admin Login (not linked anywhere on the public site) */}
          <Route path={`/${ADMIN_PATH}/login`} element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute><WebsiteAdminLayout /></ProtectedRoute>}>
            <Route path={`/${ADMIN_PATH}`} element={<AdminDashboard />} />
            <Route path={`/${ADMIN_PATH}/journeys`} element={<JourneyManager />} />
            <Route path={`/${ADMIN_PATH}/blog`} element={<BlogManager />} />
            <Route path={`/${ADMIN_PATH}/media`} element={<MediaGallery />} />
            <Route path={`/${ADMIN_PATH}/team`} element={<TeamManager />} />
            <Route path={`/${ADMIN_PATH}/reviews`} element={<ReviewsManager />} />
            <Route path={`/${ADMIN_PATH}/messages`} element={<ContactMessages />} />
            <Route path={`/${ADMIN_PATH}/newsletter`} element={<NewsletterManager />} />
            <Route path={`/${ADMIN_PATH}/clients`} element={<ClientManager />} />
            <Route path={`/${ADMIN_PATH}/invoices`} element={<InvoiceMaker />} />
            <Route path={`/${ADMIN_PATH}/financial`} element={<FinancialReports />} />
            <Route path={`/${ADMIN_PATH}/activity`} element={<ActivityLog />} />
            <Route path={`/${ADMIN_PATH}/email-templates`} element={<EmailTemplates />} />
            <Route path={`/${ADMIN_PATH}/faqs`} element={<FAQManager />} />
            <Route path={`/${ADMIN_PATH}/social`} element={<SocialMediaCreator />} />
            <Route path={`/${ADMIN_PATH}/settings`} element={<WebsiteSettings />} />
          </Route>

          {/* Anything else (including old /admin/* links) quietly goes home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}
