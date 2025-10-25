import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  categories: string[];
  tags: string[];
  coverImage?: string;
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

const Blog = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categories: '',
    tags: '',
    coverImage: ''
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll({ limit: 50 });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Load posts error:', error);
      showToast('Failed to load blog posts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showToast('Title is required! 📝', 'error');
      return;
    }
    if (formData.title.trim().length < 5) {
      showToast('Title must be at least 5 characters! 📝', 'error');
      return;
    }
    if (!formData.content.trim()) {
      showToast('Content is required! 📄', 'error');
      return;
    }
    if (formData.content.trim().length < 50) {
      showToast('Content must be at least 50 characters! 📄', 'error');
      return;
    }
    if (!formData.categories.trim()) {
      showToast('At least one category is required! 🏷️', 'error');
      return;
    }

    try {
      const categoriesArray = formData.categories.split(',').map(c => c.trim()).filter(c => c);
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      await blogAPI.create({
        title: formData.title,
        content: formData.content,
        categories: categoriesArray,
        tags: tagsArray,
        coverImage: formData.coverImage || undefined
      });

      showToast('Blog post created successfully! 🎉', 'success');
      setShowCreateModal(false);
      setFormData({
        title: '',
        content: '',
        categories: '',
        tags: '',
        coverImage: ''
      });
      loadPosts();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create blog post', 'error');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await blogAPI.like(postId);
      loadPosts();
    } catch (error) {
      showToast('Failed to like post', 'error');
    }
  };

  const handleComment = async (postId: string) => {
    const text = commentText[postId]?.trim();
    
    if (!text) {
      showToast('Comment cannot be empty! 💬', 'error');
      return;
    }

    if (text.length < 2) {
      showToast('Comment must be at least 2 characters! 💬', 'error');
      return;
    }

    try {
      await blogAPI.comment(postId, { text });
      setCommentText({ ...commentText, [postId]: '' });
      showToast('Comment added! 💬', 'success');
      loadPosts();
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  const isLiked = (post: BlogPost) => {
    return post.likes.includes(user?._id || '');
  };

  const toggleComments = (postId: string) => {
    setExpandedComments({
      ...expandedComments,
      [postId]: !expandedComments[postId]
    });
  };

  const togglePost = (postId: string) => {
    setExpandedPosts({
      ...expandedPosts,
      [postId]: !expandedPosts[postId]
    });
  };

  if (loading) {
    return <MotorcycleLoader size="large" text="Lets Ride! 🏍️" />;
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="blog-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          
          <div className="blog-header">
            <div>
              <h1>📝 Blog</h1>
              <p>Stories, tips, and insights from the riding community</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              ✍️ Write Post
            </button>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              <p>📝 No blog posts yet. Be the first to share your story!</p>
            </div>
          ) : (
            <div className="blog-posts-list">
              {posts.map((post) => (
                <div key={post._id} className="blog-post-card">
                  {post.coverImage && (
                    <div className="blog-cover">
                      <img src={post.coverImage} alt={post.title} />
                    </div>
                  )}
                  
                  <div className="blog-post-content">
                    <div className="blog-post-header">
                      <div className="blog-author">
                        <div className="avatar">
                          {post.author.profileImage ? (
                            <img src={post.author.profileImage} alt={post.author.name} />
                          ) : (
                            post.author.name[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <h4>{post.author.name}</h4>
                          <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="blog-categories">
                        {post.categories.map((cat, i) => (
                          <span key={i} className="category-badge">{cat}</span>
                        ))}
                      </div>
                    </div>

                    <h2>{post.title}</h2>
                    
                    <div className="blog-text">
                      {expandedPosts[post._id] ? (
                        <p>{post.content}</p>
                      ) : (
                        <p>{post.content.substring(0, 200)}...</p>
                      )}
                      {post.content.length > 200 && (
                        <button 
                          className="read-more-btn"
                          onClick={() => togglePost(post._id)}
                        >
                          {expandedPosts[post._id] ? 'Show Less' : 'Read More'}
                        </button>
                      )}
                    </div>

                    {post.tags.length > 0 && (
                      <div className="blog-tags">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="blog-actions">
                      <button 
                        className={`action-btn ${isLiked(post) ? 'liked' : ''}`}
                        onClick={() => handleLike(post._id)}
                      >
                        {isLiked(post) ? '❤️' : '🤍'} {post.likes.length}
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => toggleComments(post._id)}
                      >
                        💬 {post.comments.length}
                      </button>
                      <button className="action-btn">
                        🔗 Share
                      </button>
                    </div>

                    {expandedComments[post._id] && (
                      <div className="comments-section">
                        {post.comments.map((comment, i) => (
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
                            value={commentText[post._id] || ''}
                            onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                          />
                          <button onClick={() => handleComment(post._id)}>Send</button>
                        </div>
                      </div>
                    )}
                  </div>
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
              <h2>✍️ Write Blog Post</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreatePost}>
              <div className="form-group">
                <label>Title * (min 5 characters)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., My Epic Leh-Ladakh Journey"
                />
                <span className="char-count">{formData.title.length} characters</span>
              </div>

              <div className="form-group">
                <label>Content * (min 50 characters)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your story, tips, or insights..."
                  rows={10}
                />
                <span className="char-count">{formData.content.length} characters</span>
              </div>

              <div className="form-group">
                <label>Categories * (comma-separated)</label>
                <input
                  type="text"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="e.g., Travel, Adventure, Tips"
                />
                <span className="helper-text">Suggested: Travel, Adventure, Tips, Maintenance, Safety, Gear</span>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., himalayan, royalenfield, touring"
                />
              </div>

              <div className="form-group">
                <label>Cover Image URL (optional)</label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default Blog;
