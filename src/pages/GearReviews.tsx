import { Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import PageTransition from '../components/PageTransition';
import { gearReviewsAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

interface GearReview {
  _id: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  productName: string;
  productType: string;
  brand: string;
  rating: number;
  price: number;
  review: string;
  pros: string[];
  cons: string[];
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

const GearReviews = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<GearReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    productName: '',
    productType: 'Helmet',
    brand: '',
    rating: 5,
    price: 0,
    review: '',
    pros: '',
    cons: ''
  });

  useEffect(() => {
    loadReviews();
  }, [selectedType]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await gearReviewsAPI.getAll(selectedType);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      showToast('Failed to load reviews', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.productName.trim()) {
      showToast('Product name is required! 🏷️', 'error');
      return;
    }
    if (!formData.brand.trim()) {
      showToast('Brand is required! 🏭', 'error');
      return;
    }
    if (formData.price <= 0) {
      showToast('Price must be greater than 0! 💰', 'error');
      return;
    }
    if (!formData.review.trim()) {
      showToast('Review is required! 📝', 'error');
      return;
    }
    if (formData.review.trim().length < 20) {
      showToast('Review must be at least 20 characters! 📝', 'error');
      return;
    }

    try {
      const prosArray = formData.pros.split('\n').filter(p => p.trim());
      const consArray = formData.cons.split('\n').filter(c => c.trim());

      await gearReviewsAPI.create({
        ...formData,
        pros: prosArray,
        cons: consArray
      });

      showToast('Review posted successfully! 🎉', 'success');
      setShowCreateModal(false);
      setFormData({
        productName: '',
        productType: 'Helmet',
        brand: '',
        rating: 5,
        price: 0,
        review: '',
        pros: '',
        cons: ''
      });
      loadReviews();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Failed to create review', 'error');
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      await gearReviewsAPI.like(reviewId);
      loadReviews();
    } catch (error) {
      showToast('Failed to like review', 'error');
    }
  };

  const handleComment = async (reviewId: string) => {
    const text = commentText[reviewId]?.trim();
    
    if (!text) {
      showToast('Comment cannot be empty! 💬', 'error');
      return;
    }

    if (text.length < 2) {
      showToast('Comment must be at least 2 characters! 💬', 'error');
      return;
    }

    try {
      await gearReviewsAPI.comment(reviewId, { text });
      setCommentText({ ...commentText, [reviewId]: '' });
      showToast('Comment added! 💬', 'success');
      loadReviews();
    } catch (error) {
      showToast('Failed to add comment', 'error');
    }
  };

  const isLiked = (review: GearReview) => {
    return review.likes.includes(user?._id || '');
  };

  const toggleComments = (reviewId: string) => {
    setExpandedComments({
      ...expandedComments,
      [reviewId]: !expandedComments[reviewId]
    });
  };

  if (loading) {
    return <MotorcycleLoader size="large" text="Lets Ride! 🏍️" />;
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="gear-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          
          <div className="gear-header">
            <div>
              <h1>🧥 Gear Reviews</h1>
              <p>Real reviews from real riders</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
              ✍️ Write Review
            </button>
          </div>

          <div className="gear-filters">
            <button 
              className={`filter-btn ${selectedType === '' ? 'active' : ''}`}
              onClick={() => setSelectedType('')}
            >
              All
            </button>
            {['Helmet', 'Jacket', 'Gloves', 'Boots', 'Pants', 'Rain Gear', 'Accessories'].map(type => (
              <button 
                key={type}
                className={`filter-btn ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>

          {reviews.length === 0 ? (
            <div className="empty-state">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="gear-reviews-grid">
              {reviews.map(review => (
                <div key={review._id} className="gear-review-card">
                  <div className="review-header">
                    <div className="review-user">
                      <div className="avatar">
                        {review.user.profileImage ? (
                          <img src={review.user.profileImage} alt={review.user.name} />
                        ) : (
                          review.user.name[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4>{review.user.name}</h4>
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="gear-type-badge">{review.productType}</span>
                  </div>

                  <div className="review-product">
                    <h3>{review.productName}</h3>
                    <p className="brand">{review.brand}</p>
                    <div className="review-meta">
                      <div className="rating">
                        {'⭐'.repeat(review.rating)}
                        <span>{review.rating}/5</span>
                      </div>
                      <div className="price">₹{review.price.toLocaleString()}</div>
                    </div>
                  </div>

                  <p className="review-text">{review.review}</p>

                  {review.pros.length > 0 && (
                    <div className="pros-cons">
                      <h5>✅ Pros:</h5>
                      <ul>
                        {review.pros.map((pro, i) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons.length > 0 && (
                    <div className="pros-cons">
                      <h5>❌ Cons:</h5>
                      <ul>
                        {review.cons.map((con, i) => (
                          <li key={i}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="review-actions">
                    <button 
                      className={`action-btn ${isLiked(review) ? 'liked' : ''}`}
                      onClick={() => handleLike(review._id)}
                    >
                      {isLiked(review) ? '❤️' : '🤍'} {review.likes.length}
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => toggleComments(review._id)}
                    >
                      💬 {review.comments.length}
                    </button>
                  </div>

                  {expandedComments[review._id] && (
                    <div className="comments-section">
                      {review.comments.map((comment, i) => (
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
                          value={commentText[review._id] || ''}
                          onChange={(e) => setCommentText({ ...commentText, [review._id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(review._id)}
                        />
                        <button onClick={() => handleComment(review._id)}>Send</button>
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>✍️ Write Gear Review</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateReview}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g., Royal Enfield Himalayan"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Product Type *</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  >
                    <option value="Helmet">Helmet</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Gloves">Gloves</option>
                    <option value="Boots">Boots</option>
                    <option value="Pants">Pants</option>
                    <option value="Rain Gear">Rain Gear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Royal Enfield"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="e.g., 3500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Review * (min 20 characters)</label>
                <textarea
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  placeholder="Share your detailed experience with this product..."
                  rows={4}
                />
                <span className="char-count">{formData.review.length} characters</span>
              </div>

              <div className="form-group">
                <label>Pros (one per line)</label>
                <textarea
                  value={formData.pros}
                  onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                  placeholder="Excellent ventilation&#10;ISI certified&#10;Comfortable fit"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Cons (one per line)</label>
                <textarea
                  value={formData.cons}
                  onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                  placeholder="Slightly heavy&#10;Limited color options"
                  rows={3}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default GearReviews;
