import { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DevAuthButton from '../components/DevAuthButton';
import { statsAPI } from '../services/api';

const Home = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCommunities: 0,
    completedRides: 0,
    totalCities: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsAPI.getStats();
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <DevAuthButton />
      <div className="home">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="/" className="logo">
            🏍️ <span>RiderConnect</span>
          </a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#communities">Communities</a>
            <a href="#events">Events</a>
            <a href="http://localhost:5000/api/auth/google" className="btn btn-primary">
              🚀 Sign in with Google
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Connect with <span className="highlight">{stats.totalUsers.toLocaleString()}+ Riders</span> Across India
            </h1>
            <p>
              Join the fastest-growing motorcycle community. Find riding buddies, discover epic
              routes, and share your passion for the open road.
            </p>
            <div className="hero-buttons">
              <a href="http://localhost:5000/api/auth/google" className="btn btn-primary">
                🚀 Start Your Journey with Google →
              </a>
              <a href="#features" className="btn btn-secondary">
                Explore Features
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-placeholder">🏍️</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.totalUsers.toLocaleString()}+</div>
            <div className="stat-label">Active Riders</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalCommunities.toLocaleString()}+</div>
            <div className="stat-label">Communities</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.completedRides.toLocaleString()}+</div>
            <div className="stat-label">Rides Organized</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalCities}+</div>
            <div className="stat-label">Cities</div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-header">
          <h2>Why Riders Choose Us</h2>
          <p>Everything you need to connect, ride, and grow with fellow motorcycle enthusiasts</p>
        </div>
        <div className="features-grid">
          {[
            { icon: '🏘️', title: 'Join Communities', desc: 'Connect with riders who share your passion' },
            { icon: '📅', title: 'Organize Rides', desc: 'Plan and join epic rides' },
            { icon: '💬', title: 'Share Stories', desc: 'Share your ride experiences' },
            { icon: '🗺️', title: 'Discover Routes', desc: 'Explore scenic routes' },
            { icon: '🔧', title: 'Bike Tips', desc: 'Get maintenance advice' },
            { icon: '🤝', title: 'Make Friends', desc: 'Build lasting friendships' },
          ].map((feature, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;

