import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

const safetyData = [
  {
    category: 'Essential Gear',
    icon: '🛡️',
    color: '#10b981',
    items: [
      { icon: '🪖', title: 'Helmet', desc: 'ISI/DOT certified, full-face recommended for maximum protection' },
      { icon: '🧥', title: 'Jacket', desc: 'Abrasion-resistant with CE-certified armor at elbows, shoulders, and back' },
      { icon: '🧤', title: 'Gloves', desc: 'Full-finger with knuckle protection and palm sliders' },
      { icon: '👢', title: 'Boots', desc: 'Ankle-high with non-slip sole and toe/heel protection' },
      { icon: '👖', title: 'Riding Pants', desc: 'Reinforced with knee and hip armor' },
      { icon: '🦺', title: 'Reflective Gear', desc: 'High-visibility vest for night riding' }
    ]
  },
  {
    category: 'Riding Techniques',
    icon: '🏍️',
    color: '#3b82f6',
    items: [
      { icon: '👀', title: 'Vision', desc: 'Look where you want to go, not at obstacles. Your bike follows your eyes' },
      { icon: '🛑', title: 'Braking', desc: 'Use both brakes: front 70%, rear 30%. Progressive, not sudden' },
      { icon: '🔄', title: 'Cornering', desc: 'Counter-steering for turns above 20 km/h. Lean with the bike' },
      { icon: '⚡', title: 'Following Distance', desc: 'Maintain 2-second gap. Increase in rain or poor visibility' },
      { icon: '🎯', title: 'Lane Position', desc: 'Stay in the dominant lane position for visibility' },
      { icon: '🌧️', title: 'Wet Conditions', desc: 'Reduce speed by 30%, avoid painted lines and metal surfaces' }
    ]
  },
  {
    category: 'Emergency Response',
    icon: '🚨',
    color: '#ef4444',
    items: [
      { icon: '📞', title: 'Emergency Numbers', desc: 'Keep 112 (India emergency) and local contacts handy' },
      { icon: '🩹', title: 'First-Aid Kit', desc: 'Carry bandages, antiseptic, pain relievers, and emergency medicines' },
      { icon: '🔦', title: 'Essential Tools', desc: 'Flashlight, multi-tool, tire repair kit, and spare fuses' },
      { icon: '📱', title: 'Live Location', desc: 'Share your route and live location on long rides' },
      { icon: '🆘', title: 'Breakdown Protocol', desc: 'Move to safe spot, use hazard lights, call for help' },
      { icon: '🏥', title: 'Medical Info', desc: 'Keep emergency contact and blood group info on your bike' }
    ]
  },
  {
    category: 'Pre-Ride Checks',
    icon: '✅',
    color: '#f59e0b',
    items: [
      { icon: '🛞', title: 'Tires', desc: 'Check pressure, tread depth, and look for damage' },
      { icon: '🛑', title: 'Brakes', desc: 'Test both brakes, check fluid levels and pad wear' },
      { icon: '💡', title: 'Lights', desc: 'Verify headlight, taillight, indicators, and brake light' },
      { icon: '⛓️', title: 'Chain', desc: 'Check tension, lubrication, and sprocket condition' },
      { icon: '🛢️', title: 'Fluids', desc: 'Engine oil, coolant, and brake fluid levels' },
      { icon: '🔊', title: 'Sounds', desc: 'Listen for unusual noises during startup' }
    ]
  }
];

const tips = [
  { icon: '🌙', title: 'Night Riding', desc: 'Reduce speed, use high beam wisely, wear reflective gear' },
  { icon: '🏔️', title: 'Mountain Roads', desc: 'Lower gear, watch for loose gravel, respect hairpin bends' },
  { icon: '🌧️', title: 'Monsoon Riding', desc: 'Avoid puddles, reduce speed, increase following distance' },
  { icon: '🏙️', title: 'City Traffic', desc: 'Stay alert, anticipate sudden stops, watch blind spots' }
];

const SafetyGuide = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="safety-page">
          <Link to="/dashboard" className="back-to-dashboard">
            ← Back to Dashboard
          </Link>

          {/* Hero Section */}
          <div className="safety-hero">
            <div className="hero-content">
              <h1>🦺 Safety Guide</h1>
              <p>Your complete guide to safe and responsible riding</p>
              <div className="hero-badges">
                <span className="hero-badge">🛡️ Gear Up</span>
                <span className="hero-badge">🏍️ Ride Smart</span>
                <span className="hero-badge">🚨 Stay Prepared</span>
              </div>
            </div>
          </div>

          {/* Safety Sections */}
          <div className="safety-sections-grid">
            {safetyData.map((section, i) => (
              <div key={i} className="safety-section-card" style={{ '--accent-color': section.color } as any}>
                <div className="section-header">
                  <span className="section-icon-large">{section.icon}</span>
                  <h2>{section.category}</h2>
                </div>
                <div className="safety-items-grid">
                  {section.items.map((item, j) => (
                    <div key={j} className="safety-item">
                      <span className="item-icon">{item.icon}</span>
                      <div className="item-content">
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="safety-tips-section">
            <h2>💡 Quick Safety Tips</h2>
            <div className="tips-grid-compact">
              {tips.map((tip, i) => (
                <div key={i} className="tip-card-compact">
                  <span className="tip-icon-large">{tip.icon}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="safety-cta">
            <div className="cta-content">
              <h2>🚨 Remember: Safety First, Always!</h2>
              <p>The best ride is a safe ride. Gear up, ride smart, and come home safely.</p>
              <div className="cta-buttons">
                <Link to="/maintenance" className="btn btn-primary">
                  🔧 Maintenance Guide
                </Link>
                <Link to="/gear" className="btn btn-secondary">
                  🧥 Gear Reviews
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SafetyGuide;
