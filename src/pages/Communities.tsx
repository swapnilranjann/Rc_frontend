import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { communitiesAPI } from '../services/api';
import { Community } from '../types';
import CreateCommunityModal from '../components/CreateCommunityModal';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const Communities = () => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBikeType, setSelectedBikeType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    filterCommunities();
  }, [searchTerm, selectedCity, selectedBikeType, communities]);

  const loadCommunities = async () => {
    try {
      const response = await communitiesAPI.getAll();
      const data = response.data.communities || []; // Backend returns { communities: [...] }
      setCommunities(data);
      setFilteredCommunities(data);
    } catch (error) {
      console.error('Failed to load communities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterCommunities = () => {
    let filtered = [...communities];

    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(c => c.city === selectedCity);
    }

    if (selectedBikeType) {
      filtered = filtered.filter(c => c.bikeType === selectedBikeType || c.bikeType === 'All Types');
    }

    setFilteredCommunities(filtered);
  };

  const joinCommunity = async (communityId: string) => {
    try {
      await communitiesAPI.join(communityId);
      showToast('Joined community! 🎉');
      
      // Refresh user data to update joinedCommunities
      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Update localStorage and trigger context refresh
          localStorage.setItem('user', JSON.stringify(userData.user));
          // Force page reload to update context
          window.location.reload();
        }
      }
      
      loadCommunities();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to join', 'error');
    }
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      await communitiesAPI.leave(communityId);
      showToast('Left community');
      
      // Refresh user data to update joinedCommunities
      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          // Update localStorage and trigger context refresh
          localStorage.setItem('user', JSON.stringify(userData.user));
          // Force page reload to update context
          window.location.reload();
        }
      }
      
      loadCommunities();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to leave', 'error');
    }
  };

  const isJoined = (communityId: string) => {
    if (!user?.joinedCommunities) return false;
    return user.joinedCommunities.some((id: any) => {
      const idStr = typeof id === 'string' ? id : id._id || id.toString();
      return idStr === communityId;
    });
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Lets Ride to Communities! 🏍️" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const cities = [...new Set(communities.map(c => c.city))];
  const bikeTypes = [...new Set(communities.map(c => c.bikeType))];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {showCreateModal && (
        <CreateCommunityModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadCommunities}
          showToast={showToast}
        />
      )}
      <div className="communities-page">
      {/* Header */}
      <div className="page-header">
        <div className="container">
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>🏘️ Bike Communities</h1>
          <p>Join communities and connect with riders who share your passion</p>
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create Community
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-grid">
            <input
              type="text"
              placeholder="🔍 Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="filter-select"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <select
              value={selectedBikeType}
              onChange={(e) => setSelectedBikeType(e.target.value)}
              className="filter-select"
            >
              <option value="">All Bike Types</option>
              {bikeTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="container">
        {isLoading ? (
          <MotorcycleLoader size="medium" text="Lets Ride! 🏍️" />
        ) : filteredCommunities.length === 0 ? (
          <div className="empty-state">
            <h3>No communities found</h3>
            <p>Try adjusting your filters or create a new community!</p>
          </div>
        ) : (
          <div className="communities-grid">
            {filteredCommunities.map((community) => (
              <div key={community._id} className={`community-card ${isJoined(community._id) ? 'community-joined' : ''}`}>
                <div className="community-header">
                  <div className="community-icon">🏍️</div>
                  <div className="community-badges">
                    {community.isPublic ? (
                      <span className="badge badge-public">Public</span>
                    ) : (
                      <span className="badge badge-private">Private</span>
                    )}
                    {isJoined(community._id) && (
                      <span className="joined-badge">✓ Joined</span>
                    )}
                  </div>
                </div>
                <div className="community-body">
                  <h3>{community.name}</h3>
                  <p className="community-description">{community.description}</p>
                  <div className="community-meta">
                    <span>📍 {community.city}</span>
                    <span>🏍️ {community.bikeType}</span>
                    <span>👥 {community.memberCount} members</span>
                  </div>
                  {community.tags && community.tags.length > 0 && (
                    <div className="community-tags">
                      {community.tags.map((tag, i) => (
                        <span key={i} className="tag">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="community-footer">
                  {isJoined(community._id) ? (
                    <button
                      className="btn btn-secondary btn-block btn-leave"
                      onClick={() => leaveCommunity(community._id)}
                    >
                      🚪 Leave Community
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-block btn-join"
                      onClick={() => joinCommunity(community._id)}
                    >
                      ➕ Join Community
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

export default Communities;

