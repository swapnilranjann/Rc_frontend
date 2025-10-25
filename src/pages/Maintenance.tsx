import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const schedules = [
  {
    title: 'Daily Checks',
    subtitle: 'Before every ride',
    icon: '🌅',
    color: '#10b981',
    items: [
      { icon: '🛞', text: 'Tire pressure and tread depth' },
      { icon: '🛑', text: 'Brake function (front & rear)' },
      { icon: '💡', text: 'All lights (headlight, taillight, indicators)' },
      { icon: '⛓️', text: 'Chain tension and lubrication' },
      { icon: '🔍', text: 'Visual inspection for leaks' }
    ]
  },
  {
    title: 'Weekly Care',
    subtitle: 'Every 7 days or 200 km',
    icon: '📅',
    color: '#3b82f6',
    items: [
      { icon: '⛓️', text: 'Clean and lubricate chain' },
      { icon: '🛢️', text: 'Check all fluid levels' },
      { icon: '🛑', text: 'Inspect brake pads wear' },
      { icon: '🌬️', text: 'Clean or check air filter' },
      { icon: '🔩', text: 'Check for loose bolts/nuts' }
    ]
  },
  {
    title: 'Monthly Service',
    subtitle: 'Every 30 days or 1000 km',
    icon: '📆',
    color: '#f59e0b',
    items: [
      { icon: '🛢️', text: 'Engine oil level check' },
      { icon: '🔋', text: 'Battery terminals cleaning' },
      { icon: '🏍️', text: 'Suspension check & adjustment' },
      { icon: '💦', text: 'Full bike wash & wax' },
      { icon: '🔧', text: 'Tighten all fasteners' }
    ]
  },
  {
    title: 'Major Service',
    subtitle: 'Every 5000 km or 6 months',
    icon: '🛠️',
    color: '#ef4444',
    items: [
      { icon: '🛢️', text: 'Complete engine oil change' },
      { icon: '🔧', text: 'Oil filter replacement' },
      { icon: '⚡', text: 'Spark plug inspection/replacement' },
      { icon: '🛑', text: 'Brake fluid change' },
      { icon: '⛓️', text: 'Chain replacement (if needed)' },
      { icon: '🔍', text: 'Complete bike inspection' }
    ]
  }
];

const tips = [
  { icon: '📖', title: 'Keep Records', text: 'Maintain a service log book' },
  { icon: '🔧', title: 'Use Quality Parts', text: 'Always use OEM or quality aftermarket parts' },
  { icon: '👨‍🔧', title: 'Professional Help', text: 'Don\'t hesitate to visit a mechanic for complex issues' },
  { icon: '⏰', title: 'Be Consistent', text: 'Regular maintenance prevents costly repairs' }
];

const Maintenance = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="maintenance-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>
          <div className="maintenance-hero">
            <div className="hero-content">
              <h1>🔧 Maintenance Guide</h1>
              <p>Keep your bike in top condition with our comprehensive maintenance schedule</p>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-icon">🛞</span>
                  <span className="stat-text">Regular Care</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">⚡</span>
                  <span className="stat-text">Peak Performance</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">💰</span>
                  <span className="stat-text">Save Money</span>
                </div>
              </div>
            </div>
          </div>

          <div className="maintenance-timeline">
            {schedules.map((schedule, i) => (
              <div key={i} className="timeline-item" style={{ '--accent-color': schedule.color } as any}>
                <div className="timeline-marker">
                  <span className="marker-icon">{schedule.icon}</span>
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>{schedule.title}</h3>
                    <span className="timeline-subtitle">{schedule.subtitle}</span>
                  </div>
                  <div className="checklist">
                    {schedule.items.map((item, j) => (
                      <div key={j} className="checklist-item">
                        <span className="check-icon">{item.icon}</span>
                        <span className="check-text">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="maintenance-tips">
            <h2>💡 Pro Tips</h2>
            <div className="tips-grid">
              {tips.map((tip, i) => (
                <div key={i} className="tip-box">
                  <span className="tip-box-icon">{tip.icon}</span>
                  <h4>{tip.title}</h4>
                  <p>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="maintenance-cta">
            <div className="cta-content">
              <h2>🏍️ Need Professional Help?</h2>
              <p>Find trusted mechanics and service centers in your area</p>
              <button className="btn btn-primary">Find Service Centers</button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Maintenance;
