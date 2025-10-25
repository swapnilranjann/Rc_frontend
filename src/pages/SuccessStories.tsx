import { useState, useEffect } from 'react';
import { successStoriesAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const SuccessStories = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const response = await successStoriesAPI.getAll({ limit: 20 });
      setStories(response.data.stories || []);
    } catch (error) {
      console.error('Load stories error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Loading Stories! 🌟" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="stories-page">
          <h1>🌟 Success Stories</h1>
          <p>Inspiring journeys from our community</p>
          {stories.length === 0 ? (
            <div className="empty-state">
              <p>🌟 No stories yet. Share yours!</p>
            </div>
          ) : (
            <div className="stories-grid">
              {stories.map((story) => (
                <div key={story._id} className="story-card">
                  <span className="story-category">{story.category}</span>
                  <h3>{story.title}</h3>
                  <p>{story.story}</p>
                  <div className="story-meta">
                    <span>👤 {story.user?.name}</span>
                    {story.rideDetails && (
                      <span>🏍️ {story.rideDetails.bike}</span>
                    )}
                    <span>❤️ {story.likes?.length || 0} likes</span>
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

export default SuccessStories;

