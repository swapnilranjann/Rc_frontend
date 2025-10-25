import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { successStoriesAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

interface SuccessStory {
  _id: string;
  title: string;
  story: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  images: string[];
  likes: string[];
  comments: Array<{
    user: {
      _id: string;
      name: string;
      profileImage?: string;
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

const SuccessStories = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expandedStories, setExpandedStories] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    images: ''
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const response = await successStoriesAPI.getAll({ limit: 50 });
      setStories(response.data.stories || []);
    } catch (error) {
      console.error('Load stories error:', error);
      showToast('Failed to load success stories', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToast('Title is required! 🌟', 'error');
      return;
    }
    if (formData.title.trim().length < 5) {
      showToast('Title must be at least 5 characters! 🌟', 'error');
      return;
    }
    if (!formData.story.trim()) {
      showToast('Story is required! 📖', 'error');
      return;
    }
    if (formData.story.trim().length < 50) {
      showToast('Story must be at least 50 characters! 📖', 'error');
      return;
    }

    try {
      const imagesArray = formData.images
        .split('\n')
        .map(url => url.trim())
        .filter(url => url);

      await successStoriesAPI.create({
        title: formData.title,
        story: formData.story,
        images: imagesArray
      });

      showToast('Success story submitted! 🎉', 'success');
      setShowCreateModal(false);
      setFormData({
        title: '',
        story: '',
        images: ''
      });
      loadStories();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to submit story', 'error');
    }
  };

  const handleLike = async (storyId: string) => {
    try {
      await successStoriesAPI.like(storyId);
      loadStories();
    } catch (error) {
      showToast('Failed to like story', 'error');
    }
  };

  const handleComment = async (storyId: string) => {
    const text = commentText[storyId]?.trim();
    
    if (!text) {
      showToast('Comment cannot be empty! 💬', 'error');
      return;
    }

    if (text.length < 2) {
      showToast('Comment must be at least 2 characters! 💬', 'error');
      return;
    }

    try {
      await successStoriesAPI.comment(storyId, { text });
      setCommentText({ ...commentText, [storyId]: '' });
      showToast('Comment added! 💬', 'success');
      loadStories();
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  const handleShare = (story: SuccessStory) => {
    const shareText = `Check out this amazing story: ${story.title}`;
    if (navigator.share) {
      navigator.share({
        title: story.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
        showToast('Link copied to clipboard! 📋', 'success');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      showToast('Link copied to clipboard! 📋', 'success');
    }
  };

  const isLiked = (story: SuccessStory) => {
    return story.likes.includes(user?._id || '');
  };

  const toggleComments = (storyId: string) => {
    setExpandedComments({
      ...expandedComments,
      [storyId]: !expandedComments[storyId]
    });
  };

  const toggleStory = (storyId: string) => {
    setExpandedStories({
      ...expandedStories,
      [storyId]: !expandedStories[storyId]
    });
  };

  if (loading) {
    return <MotorcycleLoader size="large" text="Lets Ride! 🏍️" />;
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="stories-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          
          <div className="stories-header">
            <div>
              <h1>🌟 Success Stories</h1>
              <p>Inspiring journeys from our community</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              ✍️ Share Your Story
            </button>
          </div>

          {stories.length === 0 ? (
            <div className="empty-state">
              <p>🌟 No stories yet. Be the first to share your journey!</p>
            </div>
          ) : (
            <div className="stories-list">
              {stories.map((story) => (
                <div key={story._id} className="story-card-full">
                  <div className="story-header">
                    <div className="story-author">
                      <div className="avatar">
                        {story.user?.profileImage ? (
                          <img src={story.user.profileImage} alt={story.user?.name || 'User'} />
                        ) : (
                          story.user?.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </div>
                      <div>
                        <h4>{story.user?.name || 'Anonymous'}</h4>
                        <span className="story-date">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h2>{story.title}</h2>
                  
                  {story.images.length > 0 && (
                    <div className="story-images">
                      {story.images.slice(0, 3).map((img, i) => (
                        <img key={i} src={img} alt={`${story.title} - ${i + 1}`} />
                      ))}
                      {story.images.length > 3 && (
                        <div className="more-images">+{story.images.length - 3} more</div>
                      )}
                    </div>
                  )}

                  <div className="story-text">
                    {expandedStories[story._id] ? (
                      <p>{story.story}</p>
                    ) : (
                      <p>{story.story.substring(0, 300)}...</p>
                    )}
                    {story.story.length > 300 && (
                      <button 
                        className="read-more-btn"
                        onClick={() => toggleStory(story._id)}
                      >
                        {expandedStories[story._id] ? 'Show Less' : 'Read More'}
                      </button>
                    )}
                  </div>

                  <div className="story-actions">
                    <button 
                      className={`action-btn ${isLiked(story) ? 'liked' : ''}`}
                      onClick={() => handleLike(story._id)}
                    >
                      {isLiked(story) ? '❤️' : '🤍'} {story.likes.length}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => toggleComments(story._id)}
                    >
                      💬 {story.comments.length}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => handleShare(story)}
                    >
                      🔗 Share
                    </button>
                  </div>

                  {expandedComments[story._id] && (
                    <div className="comments-section">
                      {story.comments.map((comment, i) => (
                        <div key={i} className="comment-item">
                          <div className="avatar-small">
                            {comment.user.profileImage ? (
                              <img src={comment.user.profileImage} alt={comment.user.name} />
                            ) : (
                              comment.user.name[0].toUpperCase()
                            )}
                          </div>
                          <div className="comment-content">
                            <strong>{comment.user.name}</strong>
                            <p>{comment.text}</p>
                          </div>
                        </div>
                      ))}
                      <div className="add-comment">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText[story._id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [story._id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(story._id)}
                        />
                        <button onClick={() => handleComment(story._id)}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✍️ Share Your Success Story</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateStory}>
              <div className="form-group">
                <label>Title * (min 5 characters)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., My First Solo Ride to Spiti Valley"
                />
                <span className="char-count">{formData.title.length} characters</span>
              </div>

              <div className="form-group">
                <label>Your Story * (min 50 characters)</label>
                <textarea
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                  placeholder="Share your journey, challenges, and achievements..."
                  rows={10}
                />
                <span className="char-count">{formData.story.length} characters</span>
              </div>

              <div className="form-group">
                <label>Images (one URL per line, optional)</label>
                <textarea
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  rows={4}
                />
                <span className="helper-text">Add up to 5 images to showcase your journey</span>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Share Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default SuccessStories;
