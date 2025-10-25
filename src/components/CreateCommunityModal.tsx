import { useState, useEffect } from 'react';
import { communitiesAPI } from '../services/api';
import { 
  bikeManufacturers, 
  getAllStates, 
  getCitiesByState, 
  popularCities 
} from '../data/indiaData';

interface CreateCommunityModalProps {
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const CreateCommunityModal = ({ onClose, onSuccess, showToast }: CreateCommunityModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    state: '',
    city: '',
    bikeType: '',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagsList, setTagsList] = useState<string[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  const states = getAllStates();
  const bikeTypes = bikeManufacturers;

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

  const suggestedTags = [
    'Weekend Rides', 'Long Distance', 'Adventure', 'Touring', 
    'Track Days', 'City Rides', 'Cafe Meetups', 'Maintenance'
  ];

  // Update tags list when tags string changes
  useEffect(() => {
    if (formData.tags) {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
      setTagsList(tags);
    } else {
      setTagsList([]);
    }
  }, [formData.tags]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.state) {
      newErrors.state = 'Please select a state';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.bikeType) {
      newErrors.bikeType = 'Please select a bike type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addSuggestedTag = (tag: string) => {
    if (!tagsList.includes(tag)) {
      const newTags = [...tagsList, tag];
      setFormData({ ...formData, tags: newTags.join(', ') });
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tagsList.filter(t => t !== tagToRemove);
    setFormData({ ...formData, tags: newTags.join(', ') });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await communitiesAPI.create({
        ...formData,
        tags: tagsList,
      });
      
      showToast('Community created successfully! 🎉');
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(
        error.response?.data?.message || 'Failed to create community',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-enhanced" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>🏘️ Create New Community</h2>
            <p className="modal-subtitle">Build your riding crew and connect with fellow enthusiasts</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {/* Community Name */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span>
              Community Name *
              <span className="char-counter">{formData.name.length}/100</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="e.g., Mumbai Riders Club"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              maxLength={100}
            />
            {errors.name && <span className="error-text">⚠️ {errors.name}</span>}
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
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Tell us about your community... What makes it special?"
              className={`form-input ${errors.description ? 'input-error' : ''}`}
              rows={4}
              maxLength={500}
            />
            {errors.description && <span className="error-text">⚠️ {errors.description}</span>}
          </div>

          {/* State and City Row */}
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
              {errors.state && <span className="error-text">⚠️ {errors.state}</span>}
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
                  disabled={!formData.state}
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
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) setErrors({ ...errors, city: '' });
                  }}
                  onFocus={() => setShowCitySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                  placeholder="Select a state first..."
                  className={`form-input ${errors.city ? 'input-error' : ''}`}
                  disabled={!formData.state}
                />
              )}
              {showCitySuggestions && !formData.state && (
                <div className="suggestions-dropdown">
                  <div className="suggestions-title">Popular Cities (Select state first)</div>
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="suggestion-item"
                      onMouseDown={() => setFormData({ ...formData, city })}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
              {errors.city && <span className="error-text">⚠️ {errors.city}</span>}
              {formData.state && availableCities.length > 0 && (
                <span className="helper-text">
                  💡 {availableCities.length} cities available in {formData.state}
                </span>
              )}
            </div>
          </div>

          {/* Bike Type */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏍️</span>
              Bike Type *
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
            {errors.bikeType && <span className="error-text">⚠️ {errors.bikeType}</span>}
            <span className="helper-text">💡 Choose the primary bike brand for your community</span>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">🏷️</span>
              Tags (Optional)
            </label>
            
            {/* Suggested Tags */}
            <div className="suggested-tags">
              <span className="suggestions-label">Quick add:</span>
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-suggestion ${tagsList.includes(tag) ? 'tag-selected' : ''}`}
                  onClick={() => addSuggestedTag(tag)}
                >
                  + {tag}
                </button>
              ))}
            </div>

            {/* Selected Tags Display */}
            {tagsList.length > 0 && (
              <div className="selected-tags">
                {tagsList.map((tag, index) => (
                  <span key={index} className="tag-chip">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Add custom tags separated by commas..."
              className="form-input"
            />
            <span className="helper-text">💡 Tags help riders find your community</span>
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner">⏳</span>
                  Creating...
                </>
              ) : (
                <>
                  <span className="btn-icon">✨</span>
                  Create Community
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunityModal;

