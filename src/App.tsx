import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import AuthSuccess from './pages/AuthSuccess'
import Communities from './pages/Communities'
import Events from './pages/Events'
import Profile from './pages/Profile'
import MyRides from './pages/MyRides'
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import DevAuthButton from './components/DevAuthButton'
import ThemeToggle from './components/ThemeToggle'
import NavigationLoader from './components/NavigationLoader'

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
              <Route path="/auth-success" element={<AuthSuccess />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

