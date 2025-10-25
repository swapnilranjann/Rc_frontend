import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import { Event } from '../types';
import CreateEventModal from '../components/CreateEventModal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const Events = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'registered'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filter, events]);

  const loadEvents = async () => {
    try {
      const response = await eventsAPI.getAll();
      const data = response.data.events || []; // Backend returns { events: [...] }
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];
    const now = new Date();

    switch (filter) {
      case 'upcoming':
        filtered = filtered.filter(e => new Date(e.eventDate) >= now);
        break;
      case 'past':
        filtered = filtered.filter(e => new Date(e.eventDate) < now);
        break;
      case 'registered':
        filtered = filtered.filter(e =>
          e.participants?.some(p => p.user === user?._id)
        );
        break;
    }

    filtered.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
    setFilteredEvents(filtered);
  };

  const registerForEvent = async (eventId: string) => {
    try {
      await eventsAPI.register(eventId);
      showToast('Registered for event! 🎉');
      loadEvents();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    }
  };

  const cancelRegistration = async (eventId: string) => {
    try {
      await eventsAPI.cancel(eventId);
      showToast('Registration cancelled');
      loadEvents();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to cancel', 'error');
    }
  };

  const isRegistered = (eventId: string) => {
    const event = events.find(e => e._id === eventId);
    return event?.participants?.some(p => p.user === user?._id);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'Easy': 'success',
      'Medium': 'warning',
      'Hard': 'danger',
      'Expert': 'primary'
    };
    return colors[difficulty] || 'info';
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Lets Ride to Events! 🏍️" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {showCreateModal && (
        <CreateEventModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadEvents}
          showToast={showToast}
        />
      )}
      <div className="events-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>📅 Riding Events</h1>
          <p>Join rides, meetups, and adventures with your community</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              🔜 Upcoming
            </button>
            <button
              className={`tab ${filter === 'registered' ? 'active' : ''}`}
              onClick={() => setFilter('registered')}
            >
              ✓ My Events
            </button>
            <button
              className={`tab ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              📜 Past Events
            </button>
            <button
              className={`tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              🌐 All Events
            </button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="container">
        {isLoading ? (
          <MotorcycleLoader size="medium" text="Lets Ride! 🏍️" />
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>Be the first to create an event!</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event._id} className="event-card">
                <div className="event-image">
                  <div className="event-date-badge">
                    <div className="date-day">{new Date(event.eventDate).getDate()}</div>
                    <div className="date-month">
                      {new Date(event.eventDate).toLocaleString('en', { month: 'short' })}
                    </div>
                  </div>
                  <div className="event-type-badge badge badge-primary">
                    {event.eventType}
                  </div>
                </div>
                <div className="event-body">
                  <h3>{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">⏰</span>
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">📍</span>
                      <span>{event.location.name}</span>
                    </div>
                    <div className="detail-item">
                      <span className="icon">🏍️</span>
                      <span className={`badge badge-${getDifficultyColor(event.difficulty)}`}>
                        {event.difficulty}
                      </span>
                    </div>
                    {event.distance && (
                      <div className="detail-item">
                        <span className="icon">📏</span>
                        <span>{event.distance} km</span>
                      </div>
                    )}
                  </div>

                  <div className="event-participants">
                    <span className="participants-count">
                      👥 {event.currentParticipants}/{event.maxParticipants} registered
                    </span>
                    <div className="participants-progress">
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(event.currentParticipants / event.maxParticipants) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="event-footer">
                  {isRegistered(event._id) ? (
                    <button
                      className="btn btn-secondary btn-block"
                      onClick={() => cancelRegistration(event._id)}
                    >
                      ✓ Registered
                    </button>
                  ) : event.currentParticipants >= event.maxParticipants ? (
                    <button className="btn btn-disabled btn-block" disabled>
                      Full
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => registerForEvent(event._id)}
                    >
                      Register Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Events;

