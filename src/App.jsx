import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import WebsiteAdminLayout from './layouts/WebsiteAdminLayout'
import OperationsLayout from './layouts/OperationsLayout'

// Public Pages
import HomePage from './pages/website/HomePage'
import JourneysPage from './pages/website/JourneysPage'
import BlogPage from './pages/website/BlogPage'
import ContactPage from './pages/website/ContactPage'

// Auth
import AdminLogin from './pages/admin/AdminLogin'

// Website Admin
import WebsiteAdminDashboard from './pages/website-admin/Dashboard'
import JourneyManager from './pages/website-admin/JourneyManager'
import BlogManager from './pages/website-admin/BlogManager'
import MediaGallery from './pages/website-admin/MediaGallery'
import TeamManager from './pages/website-admin/TeamManager'
import ReviewsManager from './pages/website-admin/ReviewsManager'
import ContactMessages from './pages/website-admin/ContactMessages'
import WebsiteSettings from './pages/website-admin/WebsiteSettings'
import WebsiteInvoiceMaker from './pages/website-admin/InvoiceMaker'
import WebsiteSocialMediaCreator from './pages/website-admin/SocialMediaCreator'

// Operations
import OperationsDashboard from './pages/operations/Dashboard'
import ClientManager from './pages/operations/ClientManager'
import InvoiceMaker from './pages/operations/InvoiceMaker'
import FinancialReports from './pages/operations/FinancialReports'
import SocialMediaCreator from './pages/operations/SocialMediaCreator'
import AdminPanel from './pages/operations/AdminPanel'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/journeys" element={<JourneysPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* AUTH */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* WEBSITE ADMIN */}
          <Route element={<ProtectedRoute><WebsiteAdminLayout /></ProtectedRoute>}>
            <Route path="/admin/website/dashboard" element={<WebsiteAdminDashboard />} />
            <Route path="/admin/website/journeys" element={<JourneyManager />} />
            <Route path="/admin/website/blog" element={<BlogManager />} />
            <Route path="/admin/website/media" element={<MediaGallery />} />
            <Route path="/admin/website/team" element={<TeamManager />} />
            <Route path="/admin/website/reviews" element={<ReviewsManager />} />
            <Route path="/admin/website/messages" element={<ContactMessages />} />
            <Route path="/admin/website/settings" element={<WebsiteSettings />} />
            <Route path="/admin/website/invoices" element={<WebsiteInvoiceMaker />} />
            <Route path="/admin/website/social" element={<WebsiteSocialMediaCreator />} />
          </Route>

          {/* OPERATIONS (FULL ADMIN ONLY) */}
          <Route element={<ProtectedRoute requiredRole="full"><OperationsLayout /></ProtectedRoute>}>
            <Route path="/admin/operations/dashboard" element={<OperationsDashboard />} />
            <Route path="/admin/operations/clients" element={<ClientManager />} />
            <Route path="/admin/operations/invoices" element={<InvoiceMaker />} />
            <Route path="/admin/operations/reports" element={<FinancialReports />} />
            <Route path="/admin/operations/social" element={<SocialMediaCreator />} />
            <Route path="/admin/operations/settings" element={<AdminPanel />} />
          </Route>

          {/* FALLBACK - MUST BE LAST */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
