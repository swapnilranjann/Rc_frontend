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
          <div className="tips-header">
            <h1>💡 Ride Tips</h1>
            <p>Essential tips for every rider</p>
          </div>
          <div className="tips-grid">
            {tips.map((tip, i) => (
              <div key={i} className="tip-card">
                <span className="tip-icon">{tip.icon}</span>
                <span className="tip-category">{tip.category}</span>
                <h3>{tip.title}</h3>
                <p>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RideTips;

