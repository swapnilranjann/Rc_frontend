import PageTransition from '../components/PageTransition';

const Maintenance = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="maintenance-page">
          <h1>🔧 Maintenance Guide</h1>
          <section>
            <h2>Daily Checks</h2>
            <ul>
              <li>✓ Tire pressure and tread</li>
              <li>✓ Brake function</li>
              <li>✓ Lights (headlight, taillight, indicators)</li>
              <li>✓ Chain tension and lubrication</li>
            </ul>
          </section>
          <section>
            <h2>Weekly</h2>
            <ul>
              <li>Clean and lube chain</li>
              <li>Check all fluid levels</li>
              <li>Inspect brake pads</li>
              <li>Clean air filter</li>
            </ul>
          </section>
          <section>
            <h2>Monthly</h2>
            <ul>
              <li>Engine oil check</li>
              <li>Battery terminals cleaning</li>
              <li>Suspension check</li>
              <li>Full bike wash</li>
            </ul>
          </section>
          <section>
            <h2>Every 5000 km</h2>
            <ul>
              <li>Oil change</li>
              <li>Oil filter replacement</li>
              <li>Spark plug inspection</li>
              <li>Brake fluid change</li>
            </ul>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default Maintenance;

