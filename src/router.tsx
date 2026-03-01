import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'

// Public Pages
import HomePage from './pages/home'
import AboutPage from './pages/about'
import ContactPage from './pages/contact'
import FaqPage from './pages/faq'
import FellowshipsPage from './pages/fellowships'
import HirePage from './pages/hire'
import HireApplicationPage from './pages/hire/application'
import PaymentPage from './pages/payment'
import StoriesPage from './pages/stories'
import WaitlistPage from './pages/waitlist'
import DataAnalyticsPage from './pages/programs/data-analytics'
import DataSciencePage from './pages/programs/data-science'
import DataEngineeringPage from './pages/programs/data-engineering'
import AIBusinessLeadersPage from './pages/programs/ai-business-leaders'

// Student Pages
import StudentLogin from './pages/student/login'
import StudentRegister from './pages/student/register'
import StudentDashboard from './pages/student/dashboard'
import StudentApply from './pages/student/apply'
import PaymentSuccess from './pages/payment/success'
import PaymentCancelled from './pages/payment/cancelled'
import PaymentError from './pages/payment/error'

// Admin Pages
import AdminLogin from './pages/admin/login'
import AdminDashboard from './pages/admin/dashboard'

export const router = createBrowserRouter([
    // ─── Main site (with header/footer) ─────────────────────────────────────
    {
        element: <Layout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/about', element: <AboutPage /> },
            { path: '/contact', element: <ContactPage /> },
            { path: '/faq', element: <FaqPage /> },
            { path: '/fellowships', element: <FellowshipsPage /> },
            { path: '/hire', element: <HirePage /> },
            { path: '/hire/application', element: <HireApplicationPage /> },
            { path: '/payment', element: <PaymentPage /> },
            { path: '/stories', element: <StoriesPage /> },
            { path: '/waitlist', element: <WaitlistPage /> },
            { path: '/programs/data-analytics', element: <DataAnalyticsPage /> },
            { path: '/programs/data-science', element: <DataSciencePage /> },
            { path: '/programs/data-engineering', element: <DataEngineeringPage /> },
            { path: '/programs/ai-business-leaders', element: <AIBusinessLeadersPage /> },
        ],
    },

    // ─── Student portal (standalone, no header/footer) ───────────────────────
    { path: '/student/login', element: <StudentLogin /> },
    { path: '/student/register', element: <StudentRegister /> },
    {
        path: '/student/dashboard',
        element: (
            <ProtectedRoute requiredRole="student" redirectTo="/student/login">
                <StudentDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/student/apply',
        element: (
            <ProtectedRoute requiredRole="student" redirectTo="/student/login">
                <StudentApply />
            </ProtectedRoute>
        ),
    },
    { path: '/payment/success', element: <PaymentSuccess /> },
    { path: '/payment/cancelled', element: <PaymentCancelled /> },
    { path: '/payment/error', element: <PaymentError /> },

    // ─── Admin portal (standalone) ───────────────────────────────────────────
    { path: '/admin', element: <Navigate to="/admin/login" replace /> },
    { path: '/admin/login', element: <AdminLogin /> },
    {
        path: '/admin/dashboard',
        element: (
            <ProtectedRoute requiredRole="admin" redirectTo="/admin/login">
                <AdminDashboard />
            </ProtectedRoute>
        ),
    },
])
