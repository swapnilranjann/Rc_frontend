import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: 'var(--bg-light)',
    }}>
      <div style={{
        background: 'white',
        padding: '4rem 3rem',
        borderRadius: '20px',
        boxShadow: 'var(--shadow)',
        maxWidth: '600px',
      }}>
        <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🏍️</div>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: 'var(--text-dark)',
          fontWeight: 800
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          color: 'var(--text-dark)'
        }}>
          Page Not Found
        </h2>
        <p style={{
          color: 'var(--text-light)',
          marginBottom: '2rem',
          lineHeight: 1.6,
          fontSize: '1.1rem'
        }}>
          Looks like this route doesn't exist. Let's get you back on track!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            className="btn btn-primary"
            style={{ textDecoration: 'none' }}
          >
            🏠 Go Home
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            📊 Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

