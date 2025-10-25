interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({ size = 'medium', message, fullScreen = false }: LoadingSpinnerProps) => {
  const sizeMap = {
    small: '30px',
    medium: '40px',
    large: '60px'
  };

  const containerClass = fullScreen ? 'loading-spinner-fullscreen' : 'loading-spinner-container';

  return (
    <div className={containerClass}>
      <div className="spinner" style={{ width: sizeMap[size], height: sizeMap[size] }}></div>
      {message && <p className="loading-message">{message}</p>}

      <style>{`
        .loading-spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .loading-spinner-fullscreen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        }

        .spinner {
          border: 3px solid var(--border, #e5e7eb);
          border-top-color: var(--primary, #FF4D00);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-message {
          margin-top: 1rem;
          color: var(--text-secondary, #6b7280);
          font-size: 0.9375rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;

