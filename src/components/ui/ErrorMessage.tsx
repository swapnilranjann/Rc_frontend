interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

const ErrorMessage = ({ message, onRetry, fullScreen = false }: ErrorMessageProps) => {
  const containerClass = fullScreen ? 'error-message-fullscreen' : 'error-message-container';

  return (
    <div className={containerClass}>
      <div className="error-icon">⚠️</div>
      <h3>Oops! Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try Again
        </button>
      )}

      <style>{`
        .error-message-container,
        .error-message-fullscreen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          text-align: center;
        }

        .error-message-fullscreen {
          min-height: 100vh;
        }

        .error-icon {
          font-size: 4rem;
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .error-message-container h3,
        .error-message-fullscreen h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          color: var(--text, #1f2937);
        }

        .error-message-container p,
        .error-message-fullscreen p {
          color: var(--danger, #ef4444);
          margin: 0 0 1.5rem 0;
          max-width: 400px;
        }
      `}</style>
    </div>
  );
};

export default ErrorMessage;

