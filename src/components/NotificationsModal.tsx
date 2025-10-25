import { useState, useEffect } from 'react';
import axios from 'axios';

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'event' | 'community' | 'follow' | 'mention' | 'system';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface NotificationsModalProps {
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const NotificationsModal = ({ onClose }: NotificationsModalProps) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications || []);
      setError('');
    } catch (err: any) {
      console.error('Load notifications error:', err);
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err: any) {
      console.error('Mark as read error:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err: any) {
      console.error('Mark all as read error:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err: any) {
      console.error('Delete notification error:', err);
    }
  };

  const getIcon = (type: string) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      event: '📅',
      community: '🏘️',
      follow: '👤',
      mention: '📢',
      system: 'ℹ️'
    };
    return icons[type as keyof typeof icons] || '🔔';
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content notifications-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>🔔 Notifications</h2>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} unread</span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Filters */}
        <div className="notification-filters">
          <button 
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({notifications.length})
          </button>
          <button 
            className={filter === 'unread' ? 'active' : ''}
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button 
              className="mark-all-read"
              onClick={markAllAsRead}
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Content */}
        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>❌ {error}</p>
              <button className="btn btn-primary" onClick={loadNotifications}>
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>No notifications</h3>
              <p>{filter === 'unread' ? 'You\'re all caught up!' : 'No notifications yet'}</p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map(notification => (
                <div 
                  key={notification._id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                  onClick={() => !notification.read && markAsRead(notification._id)}
                >
                  <div className="notification-icon">{getIcon(notification.type)}</div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h4>{notification.title}</h4>
                      <span className="notification-time">{getTimeAgo(notification.createdAt)}</span>
                    </div>
                    <p>{notification.message}</p>
                    {notification.sender && (
                      <div className="notification-sender">
                        {notification.sender.avatar && (
                          <img src={notification.sender.avatar} alt={notification.sender.name} />
                        )}
                        <span>{notification.sender.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="notification-actions">
                    {!notification.read && (
                      <button 
                        className="mark-read-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification._id);
                        }}
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .notifications-modal {
          width: 100%;
          max-width: 600px;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .unread-count {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: var(--accent);
          color: white;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: var(--text-secondary);
          line-height: 1;
          padding: 0;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: var(--bg-secondary);
          color: var(--text);
        }

        .notification-filters {
          display: flex;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
        }

        .notification-filters button {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .notification-filters button:hover {
          background: var(--bg-secondary);
        }

        .notification-filters button.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .notification-filters .mark-all-read {
          margin-left: auto;
          background: var(--accent);
          color: white;
          border-color: var(--accent);
        }

        .notification-filters .mark-all-read:hover {
          opacity: 0.9;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.2s;
          cursor: pointer;
        }

        .notification-item:hover {
          background: var(--bg-secondary);
        }

        .notification-item.unread {
          background: #f0f7ff;
        }

        .notification-item.unread:hover {
          background: #e6f2ff;
        }

        .notification-icon {
          font-size: 1.5rem;
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .notification-header h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
        }

        .notification-time {
          font-size: 0.75rem;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .notification-content p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .notification-sender {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .notification-sender img {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
        }

        .notification-sender span {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .notification-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .notification-actions button {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.6;
          transition: opacity 0.2s;
          padding: 0.25rem;
        }

        .notification-actions button:hover {
          opacity: 1;
        }

        .loading-state, .error-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-icon {
          font-size: 4rem;
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin: 0;
        }

        .error-state p {
          color: var(--danger);
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .notifications-modal {
            max-width: 100%;
            max-height: 90vh;
            margin: 0;
            border-radius: 16px 16px 0 0;
          }

          .notification-filters {
            padding: 0.75rem 1rem;
          }

          .notification-item {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationsModal;
