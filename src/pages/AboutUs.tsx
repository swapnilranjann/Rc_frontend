import PageTransition from '../components/PageTransition';

const AboutUs = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="about-page">
          <div className="about-hero">
            <h1>🏍️ About RiderConnect</h1>
            <p className="tagline">Connecting Riders. Creating Memories. Building Community.</p>
          </div>

          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, RiderConnect was born from a simple idea: every rider deserves a community. 
              What started as a small group of motorcycle enthusiasts in Delhi has grown into India's 
              fastest-growing rider community platform, connecting over 10,000 riders across 50+ cities.
            </p>
            <p>
              We believe in the freedom of the open road, the thrill of discovery, and the bonds formed 
              on two wheels. Whether you're a seasoned rider planning an epic Leh-Ladakh adventure or a 
              beginner looking for your first group ride, RiderConnect is your home.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <div className="mission-cards">
              <div className="mission-card">
                <span className="mission-icon">🤝</span>
                <h3>Connect Riders</h3>
                <p>Bring together riders from all backgrounds, creating a vibrant, inclusive community.</p>
              </div>
              <div className="mission-card">
                <span className="mission-icon">🛣️</span>
                <h3>Discover Routes</h3>
                <p>Help riders explore India's most beautiful roads and hidden gems.</p>
              </div>
              <div className="mission-card">
                <span className="mission-icon">🦺</span>
                <h3>Promote Safety</h3>
                <p>Educate riders on safety practices and responsible riding.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <ul className="features-list">
              <li>🏘️ <strong>500+ Communities</strong> - Find your tribe based on location, bike type, or interests</li>
              <li>📅 <strong>1,200+ Rides</strong> - Join organized rides from day trips to multi-day adventures</li>
              <li>🗺️ <strong>Route Planning</strong> - Advanced tools for planning perfect rides with cost estimates</li>
              <li>💬 <strong>Connect & Share</strong> - Share experiences, tips, and photos with fellow riders</li>
              <li>🌟 <strong>Success Stories</strong> - Get inspired by real rider journeys and achievements</li>
              <li>📝 <strong>Blog & Resources</strong> - Learn from experts about maintenance, safety, and riding tips</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-item">
                <h3>🚀 Innovation</h3>
                <p>Constantly improving our platform with world-class features</p>
              </div>
              <div className="value-item">
                <h3>❤️ Passion</h3>
                <p>Driven by our love for motorcycles and the riding community</p>
              </div>
              <div className="value-item">
                <h3>🤝 Community</h3>
                <p>Putting riders first in everything we do</p>
              </div>
              <div className="value-item">
                <h3>🦺 Safety</h3>
                <p>Promoting responsible and safe riding practices</p>
              </div>
            </div>
          </section>

          <section className="about-section stats-section">
            <h2>By The Numbers</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Active Riders</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">500+</span>
                <span className="stat-label">Communities</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">1,200+</span>
                <span className="stat-label">Rides Organized</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">50+</span>
                <span className="stat-label">Cities</span>
              </div>
            </div>
          </section>

          <section className="about-section cta-section">
            <h2>Join the Movement</h2>
            <p>Be part of India's largest motorcycle community. Your next adventure awaits!</p>
            <div className="cta-buttons">
              <a href="/communities" className="btn btn-primary">🏘️ Explore Communities</a>
              <a href="/events" className="btn btn-secondary">📅 Find Rides</a>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default AboutUs;

