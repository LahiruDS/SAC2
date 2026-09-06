import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import VideoPlayer from './pages/VideoPlayer'
import Quizzes from './pages/Quizzes'
import Papers from './pages/Papers'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import VerifyPayment from './pages/VerifyPayment'
import Admin from './pages/Admin'
import { Link } from 'react-router-dom'
import { useAuth } from './context/useAuth'

function NotConfiguredBanner() {
  const { apiReady } = useAuth()
  if (apiReady) return null
  return (
    <div style={{ background: '#fef3c7', color: '#92400e', padding: '10px 16px', fontSize: '0.88rem', textAlign: 'center' }}>
      The database is not connected yet — copy <b>.env.example</b> to <b>.env</b>, add your
      <b> MONGODB_URI</b> and <b>JWT_SECRET</b>, then restart the dev server. See MONGODB-SETUP.md.
    </div>
  )
}

function NotFound() {
  return (
    <section className="section">
      <div className="container center">
        <span className="eyebrow">404</span>
        <h2 className="h2">Page not found</h2>
        <p className="sub sub-center mt-1">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="btn btn-primary mt-3">
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      <NotConfiguredBanner />
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/courses/:courseId/session/:sessionId" element={<VideoPlayer />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/quizzes/:quizId" element={<Quizzes />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/checkout/:planId" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-payment" element={<VerifyPayment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
