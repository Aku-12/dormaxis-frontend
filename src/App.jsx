import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/AboutUsPage'
import DormsPage from './pages/DormsPage'
import DormDetailPage from './pages/DormDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ProfilePage from './pages/ProfilePage'
import MFASetupPage from './pages/MFASetupPage'
import WishlistPage from './pages/WishlistPage'
import BookingPage from './pages/BookingPage'
import BookingSuccessPage from './pages/BookingSuccessPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'
import { AdminLayout, AdminProtectedRoute } from './components/admin'
import { AdminDashboard, AdminDorms, AdminUsers, AdminBookings, AdminAuditLogs } from './pages/admin'
import { ToastProvider } from './components/common'
import useAuthStore from './store/useAuthStore'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/dorms" element={<DormsPage />} />
          <Route path="/dorms/:id" element={<DormDetailPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        <Route
          path="/booking/:dormId"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking/success/:bookingId"
          element={
            <ProtectedRoute>
              <BookingSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <PaymentSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mfa-setup"
          element={
            <ProtectedRoute>
              <MFASetupPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dorms" element={<AdminDorms />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
