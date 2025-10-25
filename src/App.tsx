import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AuthSuccess from './pages/AuthSuccess'
import Communities from './pages/Communities'
import Events from './pages/Events'
import Profile from './pages/Profile'
import MyRides from './pages/MyRides'
import PopularRoutes from './pages/PopularRoutes'
import Blog from './pages/Blog'
import SuccessStories from './pages/SuccessStories'
import Contact from './pages/Contact'
import RideTips from './pages/RideTips'
import SafetyGuide from './pages/SafetyGuide'
import Maintenance from './pages/Maintenance'
import GearReviews from './pages/GearReviews'
import AboutUs from './pages/AboutUs'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import DevAuthButton from './components/DevAuthButton'
import ThemeToggle from './components/ThemeToggle'
import NavigationLoader from './components/NavigationLoader'
import Footer from './components/Footer'

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app">
          <DevAuthButton />
          <ThemeToggle />
          <NavigationLoader />
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/events" element={<Events />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/rides" element={<MyRides />} />
              <Route path="/routes" element={<PopularRoutes />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/ride-tips" element={<RideTips />} />
              <Route path="/safety" element={<SafetyGuide />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/gear" element={<GearReviews />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

