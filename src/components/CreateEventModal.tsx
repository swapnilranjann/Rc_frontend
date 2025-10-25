import { useState, useContext, useEffect } from 'react';
import { eventsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { 
  getAllStates, 
  getCitiesByState
} from '../data/indiaData';
import CostCalculator from './CostCalculator';
import RoutePlanner from './RoutePlanner';
import RouteMap from './RouteMap';
import WeatherWidget from './WeatherWidget';

interface CreateEventModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const CreateEventModal = ({ onClose, onSuccess, showToast }: CreateEventModalProps) => {
  const { user } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState<'basic' | 'route' | 'advanced'>('basic');
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
  const [routeData, setRouteData] = useState<any>(null);
  const [costData, setCostData] = useState<any>(null);
  const [advancedSettings, setAdvancedSettings] = useState({
    mileage: 35, // km/liter - default average bike mileage
    fuelPrice: 105, // ₹/liter - default fuel price
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
    
    // Only validate ESSENTIAL fields
    if (
      !formData.title ||
      !formData.description ||
      !formData.community ||
      !formData.eventDate ||
      !formData.locationName
    ) {
      showToast('Please fill in: Title, Description, Community, Date & Location', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData: any = {
        title: formData.title,
        description: formData.description,
        community: formData.community,
        eventDate: formData.eventDate,
        startTime: formData.startTime || '09:00', // Default if not provided
        endTime: formData.endTime || '18:00', // Default if not provided
        location: {
          name: formData.locationName,
          address: formData.locationAddress || formData.locationName, // Use location name if address not provided
        },
        maxParticipants: parseInt(formData.maxParticipants) || 50, // Default to 50
        eventType: formData.eventType,
        difficulty: formData.difficulty,
        distance: formData.distance ? parseInt(formData.distance) : undefined,
      };

      // Add route details if provided
      if (routeData) {
        eventData.routeDetails = routeData;
      }

      // Add cost estimate if provided
      if (costData) {
        eventData.costEstimate = costData;
      }

      await eventsAPI.create(eventData);
      
      showToast('🎉 Event created! Riders can now see and join your ride!', 'success');
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
            <h2>📅 Create New Ride Event</h2>
            <p className="modal-subtitle">Fill the essentials, we'll handle the rest! Only * fields are required.</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`tab-btn ${currentTab === 'basic' ? 'active' : ''}`}
            onClick={() => setCurrentTab('basic')}
          >
            <span className="tab-icon">📝</span>
            <span className="tab-label">Basic Info</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${currentTab === 'route' ? 'active' : ''}`}
            onClick={() => setCurrentTab('route')}
          >
            <span className="tab-icon">🗺️</span>
            <span className="tab-label">Route & Cost</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${currentTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setCurrentTab('advanced')}
          >
            <span className="tab-icon">⚙️</span>
            <span className="tab-label">Advanced</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* ============ TAB: BASIC INFO ============ */}
          {currentTab === 'basic' && (
            <div className="tab-content">
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
              placeholder="e.g., Delhi to Manali Weekend Ride"
              className="form-input"
              maxLength={100}
              required
            />
            <span className="helper-text">💡 Keep it short and catchy!</span>
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
              placeholder="Tell riders what to expect... Route highlights, stops, experience level needed, etc."
              className="form-input"
              rows={4}
              maxLength={500}
              required
            />
            <span className="helper-text">💡 Describe the experience, not just the route!</span>
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
              <span className="helper-text">💡 When is the ride?</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🕐</span>
                Start Time <span className="optional-badge">Optional</span>
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="form-input"
                placeholder="e.g., 07:00"
              />
              <span className="helper-text">💡 When riders should meet</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">🕐</span>
                End Time <span className="optional-badge">Optional</span>
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="form-input"
                placeholder="e.g., 18:00"
              />
              <span className="helper-text">💡 Expected return time</span>
            </div>
          </div>

          {/* Location - Simplified */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📍</span>
              Meeting Location *
            </label>
            <input
              type="text"
              value={formData.locationName}
              onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
              placeholder="e.g., India Gate, New Delhi or Starbucks Connaught Place"
              className="form-input"
              required
            />
            <span className="helper-text">💡 Where should riders meet? (Include city name)</span>
          </div>

          {/* Optional: Full Address */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🗺️</span>
              Detailed Address <span className="optional-badge">Optional</span>
            </label>
            <input
              type="text"
              value={formData.locationAddress}
              onChange={(e) => setFormData({ ...formData, locationAddress: e.target.value })}
              placeholder="Complete address with landmarks (helps riders find the spot)"
              className="form-input"
            />
            <span className="helper-text">💡 Add more details if the location is hard to find</span>
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
                Distance <span className="optional-badge">Optional</span>
              </label>
              <input
                type="number"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                placeholder="e.g., 200"
                className="form-input"
                min="0"
              />
              <span className="helper-text">💡 Total kilometers (needed for route/cost features)</span>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">👥</span>
                Max Riders <span className="optional-badge">Optional</span>
              </label>
              <input
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                className="form-input"
                min="1"
                placeholder="Default: 50"
              />
              <span className="helper-text">💡 Leave blank for unlimited (default: 50)</span>
            </div>
          </div>
            </div>
          )}

          {/* ============ TAB: ROUTE & COST ============ */}
          {currentTab === 'route' && (
            <div className="tab-content">
              <div className="route-cost-grid">
                {/* Route Planner */}
                <RoutePlanner onRouteChange={(data: any) => setRouteData(data)} />
                
                {/* Cost Calculator */}
                <CostCalculator
                  distance={parseInt(formData.distance) || 0}
                  riders={parseInt(formData.maxParticipants) || 1}
                  defaultMileage={advancedSettings.mileage}
                  defaultFuelPrice={advancedSettings.fuelPrice}
                  onChange={(data: any) => setCostData(data)}
                />
              </div>

              <div className="tab-helper-card">
                <div className="helper-icon">💡</div>
                <div className="helper-content">
                  <h4>Optional: Add Route & Cost Details</h4>
                  <p>These features are <strong>completely optional!</strong> Use them if you want to provide extra details to your riders:</p>
                  <ul className="helper-features">
                    <li>🗺️ Show route on map (enter start/end locations)</li>
                    <li>💰 Estimate costs (set distance & fuel details)</li>
                    <li>🌤️ Check weather forecast (fill date & location)</li>
                    <li>✨ All calculations happen automatically!</li>
                  </ul>
                  <p className="skip-note">
                    <strong>Skip this tab if you just want to create a simple event!</strong>
                  </p>
                </div>
              </div>

              {/* Map Visualization */}
              {routeData?.startLocation?.name && routeData?.endLocation?.name && (
                <RouteMap
                  startLocation={routeData.startLocation.name}
                  endLocation={routeData.endLocation.name}
                  distance={routeData.distance}
                />
              )}

              {/* Weather Forecast */}
              {formData.eventDate && formData.city && (
                <WeatherWidget
                  eventDate={formData.eventDate}
                  location={formData.city}
                />
              )}
            </div>
          )}

          {/* ============ TAB: ADVANCED ============ */}
          {currentTab === 'advanced' && (
            <div className="tab-content">
              <div className="advanced-settings-card">
                <div className="settings-header">
                  <div className="settings-icon">⚙️</div>
                  <div className="settings-title">
                    <h3>Advanced Settings</h3>
                    <p>Configure default values for cost calculations</p>
                  </div>
                </div>

                <div className="settings-grid">
                  {/* Bike Mileage */}
                  <div className="setting-item">
                    <label className="setting-label">
                      <span className="label-icon">🏍️</span>
                      <span className="label-text">Your Bike's Mileage</span>
                    </label>
                    <div className="setting-input-group">
                      <input
                        type="number"
                        value={advancedSettings.mileage}
                        onChange={(e) => setAdvancedSettings({ 
                          ...advancedSettings, 
                          mileage: parseFloat(e.target.value) || 0 
                        })}
                        className="setting-input"
                        min="5"
                        max="100"
                        step="0.5"
                      />
                      <span className="input-unit">km/L</span>
                    </div>
                    <p className="setting-hint">
                      💡 Your bike's average fuel efficiency (most bikes: 25-50 km/L)
                    </p>
                  </div>

                  {/* Fuel Price */}
                  <div className="setting-item">
                    <label className="setting-label">
                      <span className="label-icon">⛽</span>
                      <span className="label-text">Current Fuel Price</span>
                    </label>
                    <div className="setting-input-group">
                      <span className="input-prefix">₹</span>
                      <input
                        type="number"
                        value={advancedSettings.fuelPrice}
                        onChange={(e) => setAdvancedSettings({ 
                          ...advancedSettings, 
                          fuelPrice: parseFloat(e.target.value) || 0 
                        })}
                        className="setting-input with-prefix"
                        min="50"
                        max="200"
                        step="1"
                      />
                      <span className="input-unit">per liter</span>
                    </div>
                    <p className="setting-hint">
                      💡 Current petrol price in your area (India avg: ₹100-110)
                    </p>
                  </div>
                </div>

                {/* Preview Card */}
                <div className="settings-preview">
                  <div className="preview-header">
                    <span className="preview-icon">📊</span>
                    <span className="preview-title">Quick Preview</span>
                  </div>
                  <div className="preview-content">
                    <div className="preview-item">
                      <span className="preview-label">For a 100 km ride:</span>
                      <span className="preview-value">
                        ₹{advancedSettings.mileage > 0 
                          ? ((100 / advancedSettings.mileage) * advancedSettings.fuelPrice).toFixed(0) 
                          : '0'} fuel cost
                      </span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">For a 300 km ride:</span>
                      <span className="preview-value">
                        ₹{advancedSettings.mileage > 0 
                          ? ((300 / advancedSettings.mileage) * advancedSettings.fuelPrice).toFixed(0) 
                          : '0'} fuel cost
                      </span>
                    </div>
                    <div className="preview-item">
                      <span className="preview-label">For a 500 km ride:</span>
                      <span className="preview-value">
                        ₹{advancedSettings.mileage > 0 
                          ? ((500 / advancedSettings.mileage) * advancedSettings.fuelPrice).toFixed(0) 
                          : '0'} fuel cost
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Card */}
                <div className="settings-info">
                  <div className="info-item">
                    <span className="info-emoji">ℹ️</span>
                    <p>These settings will be used in the <strong>Route & Cost</strong> tab for automatic fuel cost calculations.</p>
                  </div>
                  <div className="info-item">
                    <span className="info-emoji">💡</span>
                    <p>You can always change these values and the costs will recalculate automatically!</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ MODAL ACTIONS ============ */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            {currentTab !== 'advanced' && (
              <button
                type="button"
                className="btn btn-info"
                onClick={() => setCurrentTab(currentTab === 'basic' ? 'route' : 'advanced')}
              >
                <span className="btn-icon">➡️</span>
                Next: {currentTab === 'basic' ? 'Route & Cost' : 'Advanced'}
              </button>
            )}
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

