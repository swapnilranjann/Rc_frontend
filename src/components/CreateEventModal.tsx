import { useState, useContext, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  getAllStates, 
  getCitiesByState
} from '../data/indiaData';

interface CreateEventModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const CreateEventModal = ({ onClose, onSuccess, showToast }: CreateEventModalProps) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    community: '',
    eventDate: '',
    startTime: '',
    endTime: '',
    state: '',
    city: '',
    locationName: '',
    locationAddress: '',
    maxParticipants: '50',
    eventType: 'Ride',
    difficulty: 'Easy',
    distance: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const states = getAllStates();
  const eventTypes = ['Ride', 'Meetup', 'Rally', 'Tour', 'Track Day'];
  const difficulties = ['Easy', 'Medium', 'Hard', 'Expert'];

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state) {
      const cities = getCitiesByState(formData.state);
      setAvailableCities(cities);
      if (formData.city && !cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state, formData.city]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formData.title ||
      !formData.description ||
      !formData.community ||
      !formData.eventDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.locationName ||
      !formData.locationAddress
    ) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await eventsAPI.create({
        title: formData.title,
        description: formData.description,
        community: formData.community,
        eventDate: formData.eventDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: {
          name: formData.locationName,
          address: formData.locationAddress,
        },
        maxParticipants: parseInt(formData.maxParticipants),
        eventType: formData.eventType,
        difficulty: formData.difficulty,
        distance: formData.distance ? parseInt(formData.distance) : undefined,
      });
      
      showToast('Event created successfully! 🎉');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to create event',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const joinedCommunities = user?.joinedCommunities || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-enhanced large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📅 Create New Event</h2>
            <p className="modal-subtitle">Plan an epic ride or meetup with your community</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Event Title */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏁</span>
              Event Title *
              <span className="char-counter">{formData.title.length}/100</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Delhi to Manali Highway Ride"
              className="form-input"
              maxLength={100}
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📄</span>
              Description *
              <span className="char-counter">{formData.description.length}/500</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your event... What makes it special?"
              className="form-input"
              rows={4}
              maxLength={500}
              required
            />
          </div>

          {/* Community Selection */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏘️</span>
              Community *
            </label>
            <select
              value={formData.community}
              onChange={(e) => setFormData({ ...formData, community: e.target.value })}
              className="form-input"
              required
            >
              <option value="">Select a community</option>
              {joinedCommunities.map((community: any) => (
                <option key={community._id || community} value={community._id || community}>
                  {community.name || 'Community'}
                </option>
              ))}
            </select>
            {joinedCommunities.length === 0 ? (
              <span className="error-text">
                ⚠️ You must join a community first to create events
              </span>
            ) : (
              <span className="helper-text">
                💡 Choose which community this event belongs to
              </span>
            )}
          </div>

          {/* Date and Time */}
          <div className="form-row three-col">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📅</span>
                Event Date *
              </label>
              <input
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🕐</span>
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🕐</span>
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* State and City */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🗺️</span>
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => {
                  setFormData({ ...formData, state: e.target.value, city: '' });
                  if (errors.state) setErrors({ ...errors, state: '' });
                }}
                className={`form-input ${errors.state ? 'input-error' : ''}`}
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📍</span>
                City *
              </label>
              {formData.state ? (
                <select
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  className={`form-input ${errors.city ? 'input-error' : ''}`}
                >
                  <option value="">Select city</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Select a state first..."
                  className="form-input"
                  disabled
                />
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📌</span>
                Meeting Point *
              </label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g., India Gate"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🗺️</span>
                Full Address *
              </label>
              <input
                type="text"
                value={formData.locationAddress}
                onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
                placeholder="Complete address with landmarks"
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Event Details */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🎯</span>
                Event Type *
              </label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="form-input"
                required
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">⚡</span>
                Difficulty *
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="form-input"
                required
              >
                {difficulties.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">📏</span>
                Distance (km)
              </label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="Optional"
                className="form-input"
                min="0"
              />
              <span className="helper-text">💡 Total ride distance (optional)</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👥</span>
                Max Participants *
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="form-input"
                min="1"
                required
              />
              <span className="helper-text">💡 Maximum number of riders</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || joinedCommunities.length === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;

