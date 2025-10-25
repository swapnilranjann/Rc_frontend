import { useState, useEffect } from 'react';
import { routesAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import MotorcycleLoader from '../components/ui/MotorcycleLoader';

const PopularRoutes = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const response = await routesAPI.getAll({ featured: true, limit: 20 });
      setRoutes(response.data.routes || []);
    } catch (error) {
      console.error('Load routes error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="full-page-loader">
        <MotorcycleLoader size="large" text="Loading Routes! 🛣️" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="page-container">
        <div className="routes-page">
          <h1>🛣️ Popular Routes</h1>
          <p>Discover India's most scenic motorcycle routes</p>
          {routes.length === 0 ? (
            <div className="empty-state">
              <p>🗺️ No routes yet. Be the first to add one!</p>
            </div>
          ) : (
            <div className="routes-grid">
              {routes.map((route) => (
                <div key={route._id} className="route-card">
                  <h3>{route.title}</h3>
                  <p>{route.description}</p>
                  <div className="route-meta">
                    <span>📍 {route.startLocation?.name} → {route.endLocation?.name}</span>
                    <span>📏 {route.distance} km</span>
                    <span>⭐ {route.rating?.average || 0}/5</span>
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

export default PopularRoutes;

