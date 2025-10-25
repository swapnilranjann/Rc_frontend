import PageTransition from '../components/PageTransition';

const SafetyGuide = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="safety-page">
          <h1>🦺 Safety Guide</h1>
          <section>
            <h2>Essential Gear</h2>
            <ul>
              <li>🪖 <strong>Helmet:</strong> ISI/DOT certified, full-face recommended</li>
              <li>🧥 <strong>Jacket:</strong> Abrasion-resistant with armor</li>
              <li>🧤 <strong>Gloves:</strong> Full-finger, knuckle protection</li>
              <li>👢 <strong>Boots:</strong> Ankle-high, non-slip sole</li>
            </ul>
          </section>
          <section>
            <h2>Riding Techniques</h2>
            <ul>
              <li>👀 Look where you want to go, not at obstacles</li>
              <li>🛑 Use both brakes, front 70% rear 30%</li>
              <li>🔄 Counter-steering for turns above 20 km/h</li>
              <li>⚡ Maintain safe following distance (2 seconds)</li>
            </ul>
          </section>
          <section>
            <h2>Emergency Response</h2>
            <ul>
              <li>📞 Keep emergency numbers handy (112)</li>
              <li>🩹 Carry first-aid kit always</li>
              <li>🔦 Keep flashlight and basic tools</li>
              <li>📱 Share live location on long rides</li>
            </ul>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default SafetyGuide;

