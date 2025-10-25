import { useState, useEffect } from 'react';
import { communitiesAPI } from '../services/api';
import MotorcycleLoader from './ui/MotorcycleLoader';

interface Community {
  _id: string;
  name: string;
  description: string;
  city: string;
  bikeType: string;
  coverImage?: string;
  memberCount?: number;
  admin: any;
}

interface UserCommunitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const UserCommunitiesModal = ({ isOpen, onClose, userId, showToast }: UserCommunitiesModalProps) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [leavingId, setLeavingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCommunities();
    }
  }, [isOpen]);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      
      // First, get fresh user data from API
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const userResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!userResponse.ok) {
        setLoading(false);
        return;
      }

      const userData = await userResponse.json();
      console.log('Raw API response:', userData);
      
      // Handle API response format: {success: true, user: ...}
      const user = userData.user;
      if (!user) {
        console.error('No user data in response:', userData);
        setLoading(false);
        return;
      }
      
      const joinedCommunityIds = user.joinedCommunities || [];
      
      console.log('Extracted user:', user);
      console.log('User joined communities:', joinedCommunityIds);
      
      // Get all communities
      const response = await communitiesAPI.getAll();
      const allCommunities = response.data.communities || [];
      
      console.log('All communities:', allCommunities.map((c: Community) => c._id));
      
      // Filter to only show communities the user is a member of
      const userCommunities = allCommunities.filter((c: Community) => {
        const isJoined = joinedCommunityIds.some((id: any) => {
          // Handle both string and object IDs
          const idStr = typeof id === 'string' ? id : id._id || id.toString();
          return idStr === c._id;
        });
        return isJoined;
      });
      
      console.log('User communities:', userCommunities);
      
      setCommunities(userCommunities);
    } catch (error) {
      console.error('Failed to load communities:', error);
      showToast('Failed to load communities', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveCommunity = async (communityId: string, communityName: string) => {
    if (!confirm(`Are you sure you want to leave "${communityName}"?`)) {
      return;
    }

    try {
      setLeavingId(communityId);
      await communitiesAPI.leave(communityId);
      showToast(`Left ${communityName} successfully! 👋`);
      
      // Refresh user data
      const token = localStorage.getItem('token');
      if (token) {
        const userResponse = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          localStorage.setItem('user', JSON.stringify(userData.user));
        }
      }
      
      // Reload communities list
      await loadCommunities();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to leave community', 'error');
    } finally {
      setLeavingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-communities-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>🏘️ My Communities</h2>
            <p className="modal-subtitle">Manage your community memberships</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <MotorcycleLoader size="medium" text="Loading communities..." />
            </div>
          ) : communities.length === 0 ? (
            <div className="empty-state" style={{ padding: '3rem 1rem' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏘️</p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                You haven't joined any communities yet
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Go to the Communities page to join one!
              </p>
            </div>
          ) : (
            <div className="communities-list">
              {communities.map((community) => (
                <div key={community._id} className="community-item">
                  <div className="community-info">
                    {community.coverImage && (
                      <img 
                        src={community.coverImage} 
                        alt={community.name}
                        className="community-avatar"
                      />
                    )}
                    {!community.coverImage && (
                      <div className="community-avatar-placeholder">
                        🏘️
                      </div>
                    )}
                    <div className="community-details">
                      <h3>{community.name}</h3>
                      <p className="community-meta">
                        📍 {community.city} • 🏍️ {community.bikeType}
                      </p>
                      <p className="community-description">{community.description}</p>
                      {community.memberCount && (
                        <p className="community-members">
                          👥 {community.memberCount} members
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-leave-community"
                    onClick={() => handleLeaveCommunity(community._id, community.name)}
                    disabled={leavingId === community._id}
                  >
                    {leavingId === community._id ? '...' : '🚪 Leave'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCommunitiesModal;

