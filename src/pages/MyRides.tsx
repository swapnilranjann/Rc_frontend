import { useContext, useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import { Event } from '../types';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const MyRides = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [rides, setRides] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadRides();
    }
  }, [isAuthenticated]);

  const loadRides = async () => {
    try {
      const response = await eventsAPI.getAll();
      const allEvents = response.data.events || [];
      // Filter only events user is registered for
      const myEvents = allEvents.filter((event: Event) =>
        event.participants?.some((p: any) => p.user._id === user?._id || p.user === user?._id)
      );
      setRides(myEvents);
    } catch (error) {
      console.error('Failed to load rides:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRides = rides.filter((ride) => {
    const now = new Date();
    const rideDate = new Date(ride.eventDate);
    
    if (filter === 'upcoming') return rideDate >= now;
    if (filter === 'completed') return rideDate < now;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Lets Ride! 🏍️" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="my-rides-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>🗺️ My Rides</h1>
          <p>Your ride history and upcoming adventures</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="ride-stats">
          <div className="stat-card primary">
            <div className="stat-icon">🏍️</div>
            <div className="stat-value">{rides.length}</div>
            <div className="stat-label">Total Rides</div>
          </div>
          <div className="stat-card success">
            <div className="stat-icon">📅</div>
            <div className="stat-value">
              {rides.filter(r => new Date(r.eventDate) >= new Date()).length}
            </div>
            <div className="stat-label">Upcoming</div>
          </div>
          <div className="stat-card info">
            <div className="stat-icon">✓</div>
            <div className="stat-value">
              {rides.filter(r => new Date(r.eventDate) < new Date()).length}
            </div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card warning">
            <div className="stat-icon">📏</div>
            <div className="stat-value">
              {rides.reduce((sum, r) => sum + (r.distance || 0), 0)} km
            </div>
            <div className="stat-label">Total Distance</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Rides
            </button>
            <button
              className={`tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`tab ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Rides List */}
      <div className="container" style={{ paddingBottom: '4rem' }}>
        {isLoading ? (
          <MotorcycleLoader size="medium" text="Lets Ride! 🏍️" />
        ) : filteredRides.length === 0 ? (
          <div className="empty-state">
            <h3>No rides found</h3>
            <p>Join events to start building your ride history!</p>
            <Link to="/events" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="rides-timeline">
            {filteredRides.map((ride) => (
              <div key={ride._id} className="ride-item">
                <div className="ride-date-marker">
                  <div className="date-circle">
                    {new Date(ride.eventDate).getDate()}
                  </div>
                  <div className="date-line"></div>
                </div>
                <div className="ride-content">
                  <div className="ride-header">
                    <h3>{ride.title}</h3>
                    <span className={`badge badge-${new Date(ride.eventDate) >= new Date() ? 'primary' : 'success'}`}>
                      {new Date(ride.eventDate) >= new Date() ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                  <p className="ride-description">{ride.description}</p>
                  <div className="ride-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{formatDate(ride.eventDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">⏰</span>
                      <span>{ride.startTime} - {ride.endTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">📍</span>
                      <span>{ride.location.name}</span>
                    </div>
                    {ride.distance && (
                      <div className="detail-item">
                        <span className="icon">📏</span>
                        <span>{ride.distance} km</span>
                      </div>
                    )}
                    <div className="detail-item">
                      <span className="icon">🏍️</span>
                      <span className={`badge badge-${ride.difficulty === 'Easy' ? 'success' : ride.difficulty === 'Medium' ? 'warning' : 'danger'}`}>
                        {ride.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="ride-community">
                    <span className="community-badge">🏘️ {ride.community?.name || 'Community'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRides;

