import { useContext, useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';
import PageTransition from '../components/PageTransition';
import Footer from '../components/Footer';
import { 
  bikeManufacturers, 
  getAllStates, 
  getCitiesByState
} from '../data/indiaData';

const Profile = () => {
  const { user, token, isAuthenticated, loading, login } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    state: '',
    city: '',
    bikeType: '',
    bikeModel: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toasts, showToast, removeToast } = useToast();

  const states = getAllStates();
  const bikeTypes = bikeManufacturers;

  useEffect(() => {
    if (user) {
      setFormData({
        state: '',
        city: user.city || '',
        bikeType: user.bikeType || '',
        bikeModel: user.bikeModel || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  // Update available cities when state changes
  useEffect(() => {
    if (formData.state) {
      const cities = getCitiesByState(formData.state);
      setAvailableCities(cities);
      // Clear city if it's not in the new state's cities
      if (formData.city && !cities.includes(formData.city)) {
        setFormData(prev => ({ ...prev, city: '' }));
      }
    } else {
      setAvailableCities([]);
    }
  }, [formData.state, formData.city]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await authAPI.updateProfile(formData);
      // Fetch fresh user data
      const response = await authAPI.getMe();
      // Update user in context (this updates both state and localStorage)
      if (token) {
        login(token, response.data.user);
      }
      showToast('Profile updated successfully! 🎉');
      setIsEditing(false);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Lets Ride to Profile! 🏍️" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageTransition>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="profile-page">
      
      {/* Profile Cover */}
      <div className="profile-cover">
        <div className="cover-gradient"></div>
        <div className="cover-pattern"></div>
        <Link to="/dashboard" className="back-link-floating">
          <span className="back-icon">←</span> Back to Dashboard
        </Link>
      </div>

      <div className="container profile-container">
        <div className="profile-layout">
          {/* Left Sidebar - Profile Card */}
          <aside className="profile-sidebar">
            <div className="profile-card-modern">
              {/* Avatar Section */}
              <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                  <div className="profile-avatar-huge">
                    {user?.name?.[0] || 'R'}
                  </div>
                  <div className="avatar-ring"></div>
                  <div className="status-indicator online"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="profile-user-info">
                <h1 className="profile-name">{user?.name}</h1>
                <p className="profile-email-modern">
                  <span className="email-icon">📧</span>
                  {user?.email}
                </p>
                <div className="profile-badges-modern">
                  <span className="badge badge-verified">
                    <span className="badge-icon">✓</span> Verified
                  </span>
                  <span className="badge badge-google">
                    <span className="badge-icon">🔐</span> Google
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="profile-stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">🏘️</div>
                  <div className="stat-number">{user?.joinedCommunities?.length || 0}</div>
                  <div className="stat-label">Communities</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-number">{user?.registeredEvents?.length || 0}</div>
                  <div className="stat-label">Events</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-number">{user?.followers?.length || 0}</div>
                  <div className="stat-label">Followers</div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🤝</div>
                  <div className="stat-number">{user?.following?.length || 0}</div>
                  <div className="stat-label">Following</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="profile-quick-actions">
                <Link to="/communities" className="quick-action-btn">
                  <span className="action-icon">🏘️</span>
                  My Communities
                </Link>
                <Link to="/rides" className="quick-action-btn">
                  <span className="action-icon">🗺️</span>
                  My Rides
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Content - Bike Info & Bio */}
          <main className="profile-main-content">
            {/* Bike Information Card */}
            <div className="info-card">
              <div className="card-header-modern">
                <div className="card-title-section">
                  <h2 className="card-title">
                    <span className="title-icon">🏍️</span>
                    Bike Information
                  </h2>
                  <p className="card-subtitle">Your ride details and preferences</p>
                </div>
                {!isEditing && (
                  <button 
                    className="btn btn-edit"
                    onClick={() => setIsEditing(true)}
                  >
                    <span className="btn-icon">✏️</span>
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="card-content">
                {isEditing ? (
                  <div className="edit-form-modern">
                  {/* State Dropdown */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🗺️</span>
                      State
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
                    {errors.state && <span className="error-text">⚠️ {errors.state}</span>}
                  </div>

                  {/* City Dropdown */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📍</span>
                      City
                    </label>
                    {formData.state ? (
                      <>
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
                        <span className="helper-text">
                          💡 {availableCities.length} cities available in {formData.state}
                        </span>
                      </>
                    ) : (
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="Select a state first..."
                        className="form-input"
                        disabled
                      />
                    )}
                    {errors.city && <span className="error-text">⚠️ {errors.city}</span>}
                  </div>

                  {/* Bike Type with Groups */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🏍️</span>
                      Bike Type
                    </label>
                    <select
                      value={formData.bikeType}
                      onChange={(e) => {
                        setFormData({ ...formData, bikeType: e.target.value });
                        if (errors.bikeType) setErrors({ ...errors, bikeType: '' });
                      }}
                      className={`form-input ${errors.bikeType ? 'input-error' : ''}`}
                    >
                      <option value="">Select bike manufacturer</option>
                      <optgroup label="🇮🇳 Indian Brands">
                        {bikeTypes.filter(t => t.country === 'India').map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🇯🇵 Japanese Brands">
                        {bikeTypes.filter(t => t.country === 'Japan').map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🇪🇺 European Brands">
                        {bikeTypes.filter(t => ['Austria', 'Germany', 'Italy', 'UK', 'Sweden', 'Czech/India'].includes(t.country || '')).map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🇺🇸 American Brands">
                        {bikeTypes.filter(t => t.country === 'USA').map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🌍 Other">
                        {bikeTypes.filter(t => ['All', 'Other', 'China'].includes(t.country || '')).map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                    <span className="helper-text">💡 Select your bike manufacturer</span>
                  </div>

                  {/* Bike Model */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">🔧</span>
                      Bike Model
                    </label>
                    <input
                      type="text"
                      value={formData.bikeModel}
                      onChange={(e) => setFormData({ ...formData, bikeModel: e.target.value })}
                      placeholder="e.g., Himalayan, Duke 390, CBR 650R"
                      className="form-input"
                      maxLength={100}
                    />
                    <span className="helper-text">💡 Specific model of your bike</span>
                  </div>

                  {/* Bio */}
                  <div className="form-group">
                    <label className="form-label">
                      <span className="label-icon">📝</span>
                      Bio
                      <span className="char-counter">{formData.bio.length}/500</span>
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself and your riding experience..."
                      className="form-input"
                      rows={4}
                      maxLength={500}
                    ></textarea>
                    <span className="helper-text">💡 Share your riding passion and experience</span>
                  </div>

                  <div className="form-actions-modern">
                    <button 
                      className="btn btn-cancel" 
                      onClick={() => {
                        setIsEditing(false);
                        setErrors({});
                      }}
                      disabled={isSaving}
                    >
                      <span className="btn-icon">✖️</span>
                      Cancel
                    </button>
                    <button 
                      className="btn btn-save" 
                      onClick={handleSave}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <span className="btn-spinner">⏳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <span className="btn-icon">💾</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="info-display-modern">
                  <div className="info-row">
                    <div className="info-item-modern">
                      <div className="info-icon-wrapper">
                        <span className="info-icon">📍</span>
                      </div>
                      <div className="info-content">
                        <span className="info-label-modern">City</span>
                        <span className="info-value-modern">{user?.city || 'Not set'}</span>
                      </div>
                    </div>
                    <div className="info-item-modern">
                      <div className="info-icon-wrapper">
                        <span className="info-icon">🏍️</span>
                      </div>
                      <div className="info-content">
                        <span className="info-label-modern">Bike Type</span>
                        <span className="info-value-modern">{user?.bikeType || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="info-item-modern">
                      <div className="info-icon-wrapper">
                        <span className="info-icon">🔧</span>
                      </div>
                      <div className="info-content">
                        <span className="info-label-modern">Model</span>
                        <span className="info-value-modern">{user?.bikeModel || 'Not set'}</span>
                      </div>
                    </div>
                  </div>
                  {user?.bio && (
                    <div className="bio-section">
                      <div className="info-icon-wrapper">
                        <span className="info-icon">📝</span>
                      </div>
                      <div className="info-content">
                        <span className="info-label-modern">Bio</span>
                        <p className="bio-text">{user.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Activity Card */}
          <div className="info-card">
            <div className="card-header-modern">
              <div className="card-title-section">
                <h2 className="card-title">
                  <span className="title-icon">⚡</span>
                  Recent Activity
                </h2>
                <p className="card-subtitle">Your latest rides and engagements</p>
              </div>
            </div>
            <div className="card-content">
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🏘️</div>
                  <div className="activity-content">
                    <p className="activity-text">Joined <strong>{user?.joinedCommunities?.length || 0} communities</strong></p>
                    <span className="activity-time">Active member</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📅</div>
                  <div className="activity-content">
                    <p className="activity-text">Registered for <strong>{user?.registeredEvents?.length || 0} events</strong></p>
                    <span className="activity-time">Upcoming rides</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">🏍️</div>
                  <div className="activity-content">
                    <p className="activity-text">Riding <strong>{user?.bikeType || 'your bike'}</strong></p>
                    <span className="activity-time">Current ride</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        </div>
      </div>
    </div>
    <Footer />
    </PageTransition>
  );
};

export default Profile;

