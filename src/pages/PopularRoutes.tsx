import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { routesAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const PopularRoutes = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await routesAPI.getAll({ featured: true, limit: 50 });
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error('Load routes error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          route.startLocation?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          route.endLocation?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || route.difficulty === selectedDifficulty;
    const matchesSeason = selectedSeason === 'all' || route.bestSeasons?.includes(selectedSeason);
    return matchesSearch && matchesDifficulty && matchesSeason;
  });

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#10b981';
      case 'Moderate': return '#f59e0b';
      case 'Challenging': return '#ef4444';
      default: return 'var(--primary-color)';
    }
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Let's Ride" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="routes-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          
          <div className="routes-header">
            <div className="routes-title-section">
              <h1 className="routes-main-title">Popular Routes</h1>
              <p className="routes-subtitle">Discover India's most scenic motorcycle routes</p>
            </div>
            
            {/* Search and Filters */}
            <div className="routes-filters">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search routes, cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="routes-search-input"
                />
              </div>
              
              <div className="filter-group">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
                
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Seasons</option>
                  <option value="Summer">Summer</option>
                  <option value="Monsoon">Monsoon</option>
                  <option value="Winter">Winter</option>
                  <option value="Spring">Spring</option>
                  <option value="Autumn">Autumn</option>
                </select>
              </div>
            </div>
          </div>

          {filteredRoutes.length === 0 ? (
            <div className="empty-state-routes">
              <div className="empty-icon">🗺️</div>
              <h3>No routes found</h3>
              <p>{searchQuery || selectedDifficulty !== 'all' || selectedSeason !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Be the first to add a route!'}</p>
            </div>
          ) : (
            <>
              <div className="routes-stats">
                <span className="stat-badge">
                  <strong>{filteredRoutes.length}</strong> Routes Found
                </span>
              </div>
              
              <div className="routes-grid-enhanced">
                {filteredRoutes.map((route) => (
                  <div key={route._id} className="route-card-enhanced">
                    {/* Route Image/Cover */}
                    <div className="route-card-cover" style={{
                      background: `linear-gradient(135deg, var(--primary-color), var(--primary-dark))`
                    }}>
                      <div className="route-difficulty-badge" style={{
                        background: getDifficultyColor(route.difficulty)
                      }}>
                        {route.difficulty || 'Moderate'}
                      </div>
                    </div>
                    
                    {/* Route Content */}
                    <div className="route-card-content">
                      <h3 className="route-title">{route.title}</h3>
                      <p className="route-description">{route.description}</p>
                      
                      {/* Route Meta Info */}
                      <div className="route-meta-grid">
                        <div className="route-meta-item">
                          <span className="meta-icon">📍</span>
                          <div className="meta-content">
                            <span className="meta-label">Route</span>
                            <span className="meta-value">{route.startLocation?.name} → {route.endLocation?.name}</span>
                          </div>
                        </div>
                        
                        <div className="route-meta-item">
                          <span className="meta-icon">📏</span>
                          <div className="meta-content">
                            <span className="meta-label">Distance</span>
                            <span className="meta-value">{route.distance} km</span>
                          </div>
                        </div>
                        
                        <div className="route-meta-item">
                          <span className="meta-icon">⏱️</span>
                          <div className="meta-content">
                            <span className="meta-label">Duration</span>
                            <span className="meta-value">{route.duration || 'N/A'}</span>
                          </div>
                        </div>
                        
                        <div className="route-meta-item">
                          <span className="meta-icon">⭐</span>
                          <div className="meta-content">
                            <span className="meta-label">Rating</span>
                            <span className="meta-value">{route.rating?.average || 0}/5</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Best Seasons */}
                      {route.bestSeasons && route.bestSeasons.length > 0 && (
                        <div className="route-seasons">
                          <span className="seasons-label">Best Time:</span>
                          <div className="seasons-tags">
                            {route.bestSeasons.map((season: string) => (
                              <span key={season} className="season-tag">{season}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Route Highlights */}
                      {route.highlights && route.highlights.length > 0 && (
                        <div className="route-highlights">
                          <div className="highlights-label">Highlights:</div>
                          <ul className="highlights-list">
                            {route.highlights.slice(0, 3).map((highlight: string, index: number) => (
                              <li key={index}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* CTA Button */}
                      <button className="route-cta-btn">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default PopularRoutes;
