import { useState, useEffect } from 'react';
import { followAPI } from '../services/api';
import './FollowersFollowingModal.css';

interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  city?: string;
  bikeType?: string;
  bikeModel?: string;
  bio?: string;
}

interface FollowersFollowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  initialTab?: 'followers' | 'following';
}

const FollowersFollowingModal = ({
  isOpen,
  onClose,
  userId,
  initialTab = 'followers'
}: FollowersFollowingModalProps) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(initialTab);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [followingStatus, setFollowingStatus] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentUserId = JSON.parse(localStorage.getItem('user') || '{}')._id;

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, userId, activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 'followers') {
        const response = await followAPI.getFollowers(userId);
        setFollowers(response.data.followers || []);
        
        // Load following status for each follower
        const statuses: Record<string, boolean> = {};
        for (const follower of response.data.followers || []) {
          try {
            const statusRes = await followAPI.getStatus(follower._id);
            statuses[follower._id] = statusRes.data.isFollowing;
          } catch (err) {
            statuses[follower._id] = false;
          }
        }
        setFollowingStatus(statuses);
      } else {
        const response = await followAPI.getFollowing(userId);
        setFollowing(response.data.following || []);
        
        // For following tab, all users are followed by definition
        const statuses: Record<string, boolean> = {};
        (response.data.following || []).forEach((user: User) => {
          statuses[user._id] = true;
        });
        setFollowingStatus(statuses);
      }
    } catch (err: any) {
      console.error('Load data error:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    try {
      await followAPI.follow(targetUserId);
      setFollowingStatus(prev => ({ ...prev, [targetUserId]: true }));
    } catch (err: any) {
      console.error('Follow error:', err);
      alert(err.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    try {
      await followAPI.unfollow(targetUserId);
      setFollowingStatus(prev => ({ ...prev, [targetUserId]: false }));
      
      // If we're on the following tab, remove the user from the list
      if (activeTab === 'following') {
        setFollowing(prev => prev.filter(u => u._id !== targetUserId));
      }
    } catch (err: any) {
      console.error('Unfollow error:', err);
      alert(err.response?.data?.message || 'Failed to unfollow user');
    }
  };

  const renderUserList = (users: User[]) => {
    if (loading) {
      return <div className="follow-loading">Loading... 🏍️</div>;
    }

    if (error) {
      return <div className="follow-error">❌ {error}</div>;
    }

    if (users.length === 0) {
      return (
        <div className="follow-empty">
          <span className="empty-icon">{activeTab === 'followers' ? '👥' : '🤝'}</span>
          <p>No {activeTab} yet</p>
        </div>
      );
    }

    return (
      <div className="follow-user-list">
        {users.map((user) => (
          <div key={user._id} className="follow-user-item">
            <div className="follow-user-avatar">
              {user.profileImage ? (
                <img src={user.profileImage} alt={user.name} />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
              )}
            </div>
            
            <div className="follow-user-info">
              <h4 className="follow-user-name">{user.name}</h4>
              {user.city && user.bikeType && (
                <p className="follow-user-meta">
                  📍 {user.city} • 🏍️ {user.bikeType}
                  {user.bikeModel && ` ${user.bikeModel}`}
                </p>
              )}
              {user.bio && <p className="follow-user-bio">{user.bio}</p>}
            </div>

            {/* Don't show follow button for current user */}
            {currentUserId !== user._id && (
              <div className="follow-user-actions">
                {followingStatus[user._id] ? (
                  <button
                    className="btn btn-unfollow"
                    onClick={() => handleUnfollow(user._id)}
                  >
                    ✓ Following
                  </button>
                ) : (
                  <button
                    className="btn btn-follow"
                    onClick={() => handleFollow(user._id)}
                  >
                    + Follow
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  const currentList = activeTab === 'followers' ? followers : following;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="follow-modal" onClick={(e) => e.stopPropagation()}>
        <div className="follow-modal-header">
          <div className="follow-header-content">
            <h2 className="follow-modal-title">
              {activeTab === 'followers' ? '👥 Followers' : '🤝 Following'}
            </h2>
            <span className="follow-count">
              {activeTab === 'followers' ? followers.length : following.length} {activeTab}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="follow-tabs">
          <button
            className={`follow-tab ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-label">Followers</span>
            <span className="tab-badge">{followers.length}</span>
          </button>
          <button
            className={`follow-tab ${activeTab === 'following' ? 'active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            <span className="tab-icon">🤝</span>
            <span className="tab-label">Following</span>
            <span className="tab-badge">{following.length}</span>
          </button>
        </div>

        <div className="follow-modal-content">
          {renderUserList(currentList)}
        </div>
      </div>
    </div>
  );
};

export default FollowersFollowingModal;

