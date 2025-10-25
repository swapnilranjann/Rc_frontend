import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const tips = [
  { category: 'Pre-Ride', icon: '🔧', title: 'Bike Inspection', desc: 'Check tires, brakes, lights, and oil before every ride' },
  { category: 'Safety', icon: '🦺', title: 'Proper Gear', desc: 'Always wear helmet, jacket, gloves, and boots' },
  { category: 'Riding', icon: '🏍️', title: 'Defensive Riding', desc: 'Assume others don\'t see you. Stay alert and visible' },
  { category: 'Weather', icon: '🌧️', title: 'Check Forecast', desc: 'Always check weather before long rides. Avoid riding in heavy rain' },
  { category: 'Group', icon: '👥', title: 'Stay Together', desc: 'Use hand signals. Don\'t overtake the leader' },
  { category: 'Fuel', icon: '⛽', title: 'Plan Stops', desc: 'Know fuel station locations. Don\'t let tank go below 25%' },
  { category: 'Night', icon: '🌙', title: 'Night Riding', desc: 'Reduce speed, use high beam wisely, wear reflective gear' },
  { category: 'Long Distance', icon: '🛣️', title: 'Take Breaks', desc: 'Stop every 2 hours. Stretch and hydrate' }
];

const RideTips = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="tips-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          
          {/* Hero Section */}
          <div className="tips-hero">
            <div className="hero-content">
              <h1>💡 Ride Tips</h1>
              <p>Essential tips for every rider</p>
              <div className="hero-badges">
                <span className="hero-badge">Safety First</span>
                <span className="hero-badge">Expert Advice</span>
                <span className="hero-badge">Pro Tips</span>
              </div>
            </div>
          </div>

          {/* Main Tips Section */}
          <div className="tips-sections-grid">
            <div className="tips-section-card">
              <div className="section-header">
                <span className="section-icon-large">🏍️</span>
                <h2>Essential Riding Tips</h2>
              </div>
              <div className="tips-items-grid">
                {tips.map((tip, i) => (
                  <div key={i} className="tip-item">
                    <span className="item-icon">{tip.icon}</span>
                    <div className="item-content">
                      <h4>{tip.title}</h4>
                      <p>{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Tips Section */}
          <div className="tips-tips-section">
            <h2>Quick Reference Tips</h2>
            <div className="tips-grid-compact">
              {tips.slice(0, 4).map((tip, i) => (
                <div key={i} className="tip-card-compact">
                  <span className="tip-icon-large">{tip.icon}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="tips-cta">
            <h2>Ready to Ride Safely?</h2>
            <p>Join our community of experienced riders and share your own tips!</p>
            <div className="cta-buttons">
              <Link to="/communities" className="btn btn-secondary">
                Join Communities
              </Link>
              <Link to="/events" className="btn btn-secondary">
                Find Rides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RideTips;

