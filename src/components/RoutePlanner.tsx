import { useState, useEffect } from 'react';
import './RoutePlanner.css';

interface RoutePlannerProps {
  onRouteChange: (routeData: RouteData) => void;
}

interface RouteData {
  startLocation: { name: string; address: string };
  endLocation: { name: string; address: string };
  distance: number;
  estimatedDuration: { hours: number; minutes: number };
  waypoints: Waypoint[];
  routeType: string;
  breakTime: number;
}

interface Waypoint {
  name: string;
  type: 'fuel' | 'food' | 'rest' | 'scenic' | 'other';
  description: string;
}

const RoutePlanner = ({ onRouteChange }: RoutePlannerProps) => {
  const [startLocation, setStartLocation] = useState({ name: '', address: '' });
  const [endLocation, setEndLocation] = useState({ name: '', address: '' });
  const [distance, setDistance] = useState(0);
  const [routeType, setRouteType] = useState('highway');
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [showWaypointForm, setShowWaypointForm] = useState(false);
  const [newWaypoint, setNewWaypoint] = useState<Waypoint>({
    name: '',
    type: 'fuel',
    description: ''
  });

  // Auto-calculate duration when distance or route type changes
  useEffect(() => {
    if (distance > 0) {
      const duration = calculateDuration(distance, routeType);
      const breakTime = calculateBreakTime(distance);
      
      const routeData: RouteData = {
        startLocation,
        endLocation,
        distance,
        estimatedDuration: duration,
        waypoints,
        routeType,
        breakTime
      };
      
      onRouteChange(routeData);
    }
  }, [startLocation, endLocation, distance, routeType, waypoints]);

  const calculateDuration = (dist: number, type: string): { hours: number; minutes: number } => {
    let avgSpeed = 60; // default highway speed
    
    switch (type) {
      case 'highway':
        avgSpeed = 70;
        break;
      case 'scenic':
        avgSpeed = 50;
        break;
      case 'mountain':
        avgSpeed = 40;
        break;
      case 'coastal':
        avgSpeed = 55;
        break;
      case 'mixed':
        avgSpeed = 60;
        break;
    }
    
    const breakTime = calculateBreakTime(dist);
    const travelTime = dist / avgSpeed; // in hours
    const totalTime = travelTime + (breakTime / 60); // convert break to hours
    
    const hours = Math.floor(totalTime);
    const minutes = Math.round((totalTime - hours) * 60);
    
    return { hours, minutes };
  };

  const calculateBreakTime = (dist: number): number => {
    // 30 min break for every 200km
    return Math.floor(dist / 200) * 30;
  };

  const addWaypoint = () => {
    if (newWaypoint.name.trim()) {
      setWaypoints([...waypoints, newWaypoint]);
      setNewWaypoint({ name: '', type: 'fuel', description: '' });
      setShowWaypointForm(false);
    }
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const getWaypointIcon = (type: string) => {
    const icons = {
      fuel: '⛽',
      food: '🍽️',
      rest: '🛑',
      scenic: '📸',
      other: '📍'
    };
    return icons[type as keyof typeof icons] || '📍';
  };

  const getRouteTypeInfo = (type: string) => {
    const info = {
      highway: { icon: '🛣️', label: 'Highway', speed: '70 km/h avg' },
      scenic: { icon: '🌄', label: 'Scenic Route', speed: '50 km/h avg' },
      mountain: { icon: '⛰️', label: 'Mountain', speed: '40 km/h avg' },
      coastal: { icon: '🌊', label: 'Coastal', speed: '55 km/h avg' },
      mixed: { icon: '🗺️', label: 'Mixed Terrain', speed: '60 km/h avg' }
    };
    return info[type as keyof typeof info] || info.mixed;
  };

  const duration = distance > 0 ? calculateDuration(distance, routeType) : { hours: 0, minutes: 0 };
  const breakTime = calculateBreakTime(distance);

  return (
    <div className="route-planner">
      <div className="planner-header">
        <h3 className="planner-title">
          <span className="title-icon">🗺️</span>
          Route Planner
        </h3>
        <p className="planner-subtitle">Plan your perfect ride with smart time estimates</p>
      </div>

      <div className="planner-body">
        {/* Start & End Locations */}
        <div className="locations-section">
          <div className="location-card start-location">
            <div className="location-header">
              <span className="location-icon">📍</span>
              <h4>Starting Point</h4>
            </div>
            <div className="location-inputs">
              <input
                type="text"
                placeholder="Location name (e.g., Delhi)"
                value={startLocation.name}
                onChange={(e) => setStartLocation({ ...startLocation, name: e.target.value })}
                className="location-input"
              />
              <input
                type="text"
                placeholder="Full address"
                value={startLocation.address}
                onChange={(e) => setStartLocation({ ...startLocation, address: e.target.value })}
                className="location-input"
              />
            </div>
          </div>

          <div className="route-arrow">
            <div className="arrow-line"></div>
            <div className="arrow-icon">🏍️</div>
            <div className="arrow-line"></div>
          </div>

          <div className="location-card end-location">
            <div className="location-header">
              <span className="location-icon">🏁</span>
              <h4>Destination</h4>
            </div>
            <div className="location-inputs">
              <input
                type="text"
                placeholder="Location name (e.g., Manali)"
                value={endLocation.name}
                onChange={(e) => setEndLocation({ ...endLocation, name: e.target.value })}
                className="location-input"
              />
              <input
                type="text"
                placeholder="Full address"
                value={endLocation.address}
                onChange={(e) => setEndLocation({ ...endLocation, address: e.target.value })}
                className="location-input"
              />
            </div>
          </div>
        </div>

        {/* Route Details */}
        <div className="route-details-section">
          <div className="detail-card">
            <label className="detail-label">
              <span className="label-icon">📏</span>
              Distance (km)
            </label>
            <input
              type="number"
              value={distance || ''}
              onChange={(e) => setDistance(Number(e.target.value))}
              placeholder="Enter distance"
              min="0"
              step="1"
              className="distance-input"
            />
          </div>

          <div className="detail-card">
            <label className="detail-label">
              <span className="label-icon">🛣️</span>
              Route Type
            </label>
            <select
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
              className="route-select"
            >
              <option value="highway">🛣️ Highway</option>
              <option value="scenic">🌄 Scenic Route</option>
              <option value="mountain">⛰️ Mountain</option>
              <option value="coastal">🌊 Coastal</option>
              <option value="mixed">🗺️ Mixed Terrain</option>
            </select>
            <span className="route-hint">
              {getRouteTypeInfo(routeType).speed}
            </span>
          </div>
        </div>

        {/* Time Estimation */}
        {distance > 0 && (
          <div className="time-estimation-card">
            <div className="estimation-header">
              <h4>⏱️ Time Estimation</h4>
            </div>
            <div className="estimation-grid">
              <div className="estimation-item">
                <span className="est-label">Travel Time</span>
                <span className="est-value primary">
                  {duration.hours}h {duration.minutes}m
                </span>
              </div>
              <div className="estimation-item">
                <span className="est-label">Break Time</span>
                <span className="est-value">
                  {breakTime}m
                </span>
              </div>
              <div className="estimation-item total">
                <span className="est-label">Total Duration</span>
                <span className="est-value highlight">
                  {duration.hours + Math.floor(breakTime / 60)}h {(duration.minutes + (breakTime % 60)) % 60}m
                </span>
              </div>
            </div>
            <div className="estimation-info">
              <span className="info-icon">💡</span>
              <span>Based on {getRouteTypeInfo(routeType).speed} average speed + breaks</span>
            </div>
          </div>
        )}

        {/* Waypoints */}
        <div className="waypoints-section">
          <div className="waypoints-header">
            <h4>
              <span className="section-icon">📍</span>
              Waypoints & Stops
            </h4>
            <button
              className="btn-add-waypoint"
              onClick={() => setShowWaypointForm(!showWaypointForm)}
            >
              <span className="btn-icon">+</span>
              Add Stop
            </button>
          </div>

          {showWaypointForm && (
            <div className="waypoint-form">
              <input
                type="text"
                placeholder="Stop name (e.g., Ambala Fuel Station)"
                value={newWaypoint.name}
                onChange={(e) => setNewWaypoint({ ...newWaypoint, name: e.target.value })}
                className="waypoint-input"
              />
              <div className="waypoint-form-row">
                <select
                  value={newWaypoint.type}
                  onChange={(e) => setNewWaypoint({ ...newWaypoint, type: e.target.value as any })}
                  className="waypoint-select"
                >
                  <option value="fuel">⛽ Fuel Stop</option>
                  <option value="food">🍽️ Food Break</option>
                  <option value="rest">🛑 Rest Area</option>
                  <option value="scenic">📸 Scenic Spot</option>
                  <option value="other">📍 Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Optional description"
                  value={newWaypoint.description}
                  onChange={(e) => setNewWaypoint({ ...newWaypoint, description: e.target.value })}
                  className="waypoint-desc"
                />
              </div>
              <div className="waypoint-actions">
                <button className="btn-cancel" onClick={() => setShowWaypointForm(false)}>
                  Cancel
                </button>
                <button className="btn-add" onClick={addWaypoint}>
                  Add Stop
                </button>
              </div>
            </div>
          )}

          {waypoints.length > 0 && (
            <div className="waypoints-list">
              {waypoints.map((waypoint, index) => (
                <div key={index} className="waypoint-item">
                  <span className="waypoint-icon">{getWaypointIcon(waypoint.type)}</span>
                  <div className="waypoint-content">
                    <span className="waypoint-name">{waypoint.name}</span>
                    {waypoint.description && (
                      <span className="waypoint-desc-text">{waypoint.description}</span>
                    )}
                  </div>
                  <button
                    className="btn-remove-waypoint"
                    onClick={() => removeWaypoint(index)}
                    aria-label="Remove waypoint"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {waypoints.length === 0 && !showWaypointForm && (
            <div className="empty-waypoints">
              <span className="empty-icon">📍</span>
              <p>No waypoints added yet</p>
              <p className="empty-hint">Add fuel stops, rest areas, or scenic spots along your route</p>
            </div>
          )}
        </div>

        {/* Smart Suggestions */}
        {distance > 0 && (
          <div className="suggestions-card">
            <h4>
              <span className="suggest-icon">💡</span>
              Smart Suggestions
            </h4>
            <div className="suggestions-list">
              {distance > 200 && (
                <div className="suggestion-item">
                  <span className="suggest-emoji">⛽</span>
                  <span>Consider adding a fuel stop around {Math.round(distance / 2)} km mark</span>
                </div>
              )}
              {duration.hours >= 4 && (
                <div className="suggestion-item">
                  <span className="suggest-emoji">🍽️</span>
                  <span>Long ride! Plan a meal break for energy</span>
                </div>
              )}
              {routeType === 'mountain' && (
                <div className="suggestion-item">
                  <span className="suggest-emoji">🌙</span>
                  <span>Mountain roads: Start early to avoid riding in the dark</span>
                </div>
              )}
              <div className="suggestion-item">
                <span className="suggest-emoji">📱</span>
                <span>Download offline maps for areas with poor network</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;

