import { useState, useEffect } from 'react';
import { blogAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const Blog = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await blogAPI.getAll({ limit: 20 });
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Load posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Loading Blog! 📝" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="blog-page">
          <h1>📝 Blog</h1>
          <p>Stories, tips, and insights from the riding community</p>
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>📝 No blog posts yet. Stay tuned!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map((post) => (
                <div key={post._id} className="blog-card">
                  <span className="blog-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-meta">
                    <span>👤 {post.author?.name}</span>
                    <span>⏱️ {post.readTime} min read</span>
                    <span>👁️ {post.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Blog;

