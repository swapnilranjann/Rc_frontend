import PageTransition from '../components/PageTransition';

const gear = [
  { name: 'Royal Enfield Himalayan', type: 'Helmet', rating: 4.5, price: '₹3,500', desc: 'Excellent ventilation, ISI certified' },
  { name: 'Rynox Air GT', type: 'Jacket', rating: 4.8, price: '₹8,500', desc: 'All-weather, CE armor, great fit' },
  { name: 'Axor Apex', type: 'Helmet', rating: 4.6, price: '₹2,800', desc: 'Lightweight, good visibility' },
  { name: 'Raida TourBuddy', type: 'Gloves', rating: 4.3, price: '₹1,200', desc: 'Touchscreen compatible, knuckle guard' },
  { name: 'Solace V2', type: 'Boots', rating: 4.7, price: '₹5,500', desc: 'Waterproof, ankle protection' }
];

const GearReviews = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <div className="gear-page">
          <h1>🧥 Gear Reviews</h1>
          <div className="gear-grid">
            {gear.map((item, i) => (
              <div key={i} className="gear-card">
                <span className="gear-type">{item.type}</span>
                <h3>{item.name}</h3>
                <div className="gear-rating">⭐ {item.rating}/5</div>
                <p>{item.desc}</p>
                <div className="gear-price">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GearReviews;

