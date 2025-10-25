import { useContext, useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import { Post } from '../types';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ToastContainer';
import MessagesModal from '../components/MessagesModal';
import NotificationsModal from '../components/NotificationsModal';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';
import PageTransition from '../components/PageTransition';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, isAuthenticated, loading, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const { toasts, showToast, removeToast } = useToast();
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
      loadUnreadCounts();
      
      // Refresh unread counts every 30 seconds
      const interval = setInterval(loadUnreadCounts, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadPosts = async () => {
    try {
      const response = await postsAPI.getAll({ limit: 20 });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadUnreadCounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const [messagesRes, notificationsRes] = await Promise.all([
        axios.get(`${API_URL}/messages/unread/count`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/notifications/unread/count`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setUnreadMessages(messagesRes.data.count || 0);
      setUnreadNotifications(notificationsRes.data.count || 0);
    } catch (error) {
      console.error('Failed to load unread counts:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    // Get user's first community
    const firstCommunity = user?.joinedCommunities?.[0];
    let communityId: string | undefined;
    
    if (typeof firstCommunity === 'string') {
      communityId = firstCommunity;
    } else if (firstCommunity && typeof firstCommunity === 'object' && '_id' in firstCommunity) {
      communityId = (firstCommunity as any)._id;
    }
    
    if (!communityId) {
      showToast('Please join a community first!', 'error');
      return;
    }

    setIsPosting(true);
    try {
      await postsAPI.create({
        content: postContent,
        community: communityId,
        postType: 'general'
      });
      setPostContent('');
      showToast('Post created! 🎉');
      loadPosts();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create post', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      await postsAPI.like(postId);
      showToast('Post liked! ❤️');
      loadPosts();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to like post', 'error');
      console.error('Failed to like post:', error);
    }
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId: string, value: string) => {
    setCommentText(prev => ({
      ...prev,
      [postId]: value
    }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    try {
      await postsAPI.comment(postId, { content: text });
      showToast('Comment added! 💬');
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      loadPosts();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to add comment', 'error');
      console.error('Failed to comment:', error);
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleShare = (postId: string) => {
    const postUrl = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(postUrl);
    showToast('Link copied to clipboard! 🔗');
  };

  const handleNotifications = () => {
    setShowNotifications(true);
    // Refresh counts when modal closes
  };

  const handleMessages = () => {
    setShowMessages(true);
    // Refresh counts when modal closes
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
    loadUnreadCounts();
  };

  const handleCloseMessages = () => {
    setShowMessages(false);
    loadUnreadCounts();
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Lets Ride to Dashboard! 🏍️" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageTransition>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {showMessages && <MessagesModal onClose={handleCloseMessages} />}
      {showNotifications && <NotificationsModal onClose={handleCloseNotifications} />}
      <div className="dashboard">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="logo">🏍️ RiderConnect</div>
        <div className="search-bar">
          <input type="text" placeholder="Search communities, riders, events..." />
          <span className="search-icon">🔍</span>
        </div>
        <div className="top-bar-actions">
          <button className="icon-btn" title="Notifications" onClick={handleNotifications}>
            🔔{unreadNotifications > 0 && <span className="badge">{unreadNotifications}</span>}
          </button>
          <button className="icon-btn" title="Messages" onClick={handleMessages}>
            💬{unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
          </button>
          <button className="icon-btn" onClick={logout} title="Logout">
            🚪
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <Link to="/dashboard" className="sidebar-item active">
            <span>🏠</span> <span>Feed</span>
          </Link>
          <Link to="/communities" className="sidebar-item">
            <span>🏘️</span> <span>Communities</span>
          </Link>
          <Link to="/events" className="sidebar-item">
            <span>📅</span> <span>Events</span>
          </Link>
          <Link to="/rides" className="sidebar-item">
            <span>🗺️</span> <span>My Rides</span>
          </Link>
          <Link to="/profile" className="sidebar-item">
            <span>👤</span> <span>Profile</span>
          </Link>
        </aside>

        {/* Main */}
        <main className="main-content">
          <h1>Welcome, {user?.name}! 👋</h1>
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-header">
                <div>
                  <div className="stat-value">{user?.joinedCommunities?.length || 0}</div>
                  <div className="stat-label">Communities</div>
                </div>
                <div className="stat-icon primary">🏘️</div>
              </div>
            </div>
            <div className="stat-card success">
              <div className="stat-header">
                <div>
                  <div className="stat-value">{user?.registeredEvents?.length || 0}</div>
                  <div className="stat-label">Events Joined</div>
                </div>
                <div className="stat-icon success">📅</div>
              </div>
            </div>
            <div className="stat-card info">
              <div className="stat-header">
                <div>
                  <div className="stat-value">{(user?.registeredEvents?.length || 0) * 2}</div>
                  <div className="stat-label">Total Rides</div>
                </div>
                <div className="stat-icon info">🏍️</div>
              </div>
            </div>
          </div>

          {/* Create Post */}
          <div className="create-post">
            <div className="avatar">{user?.name?.[0] || 'R'}</div>
            <textarea 
              placeholder="Share your ride story... 🏍️" 
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              disabled={isPosting}
            ></textarea>
            <button 
              className="btn-small btn-primary" 
              onClick={handleCreatePost}
              disabled={isPosting || !postContent.trim()}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>

          {/* Feed */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Feed</h2>
            </div>
            {loadingPosts ? (
              <MotorcycleLoader size="medium" text="Lets Ride! 🏍️" />
            ) : posts.length === 0 ? (
              <div className="feed-placeholder">
                <p>No posts yet! Join communities and create your first post.</p>
              </div>
            ) : (
              <div className="feed">
                {posts.map((post) => (
                  <div key={post._id} className="post-card">
                    <div className="post-header">
                      <div className="post-author">
                        <div className="avatar">
                          {typeof post.author === 'object' && post.author.name?.[0] || 'U'}
                        </div>
                        <div className="author-info">
                          <div className="author-name">
                            {typeof post.author === 'object' ? post.author.name : 'User'}
                          </div>
                          <div className="post-meta">
                            {typeof post.community === 'object' ? post.community.name : 'Community'} • {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="post-content">
                      <p>{post.content}</p>
                    </div>
                    <div className="post-actions">
                      <button 
                        className="action-btn"
                        onClick={() => handleLikePost(post._id)}
                      >
                        ❤️ {post.likes?.length || 0} Likes
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => toggleComments(post._id)}
                      >
                        💬 {post.comments?.length || 0} Comments
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => handleShare(post._id)}
                      >
                        🔗 Share
                      </button>
                    </div>

                    {/* Comments Section */}
                    {expandedComments[post._id] && (
                      <div className="comments-section">
                        {/* Existing Comments */}
                        {post.comments && post.comments.length > 0 && (
                          <div className="comments-list">
                            {post.comments.map((comment, idx) => (
                              <div key={idx} className="comment-item">
                                <div className="comment-avatar">
                                  {typeof comment.author === 'object' && comment.author.name?.[0] || 'U'}
                                </div>
                                <div className="comment-content">
                                  <div className="comment-author">
                                    {typeof comment.author === 'object' ? comment.author.name : 'User'}
                                  </div>
                                  <div className="comment-text">{comment.content}</div>
                                  <div className="comment-meta">
                                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Comment */}
                        <div className="add-comment">
                          <div className="avatar">{user?.name?.[0] || 'U'}</div>
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={commentText[post._id] || ''}
                            onChange={(e) => handleCommentChange(post._id, e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter' && !submittingComment[post._id]) {
                                handleCommentSubmit(post._id);
                              }
                            }}
                            disabled={submittingComment[post._id]}
                          />
                          <button 
                            className="btn-small btn-primary"
                            onClick={() => handleCommentSubmit(post._id)}
                            disabled={!commentText[post._id]?.trim() || submittingComment[post._id]}
                          >
                            {submittingComment[post._id] ? '...' : 'Post'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="widget">
            <h3 className="widget-title">Upcoming Events 📅</h3>
            <div className="event-item">
              <div className="event-date">📅 Tomorrow</div>
              <div className="event-title">Mumbai to Lonavala Ride</div>
              <div className="event-location">📍 Gateway of India</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </PageTransition>
  );
};

export default Dashboard;

