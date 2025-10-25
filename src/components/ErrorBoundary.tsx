import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
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
            padding: '3rem',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: '600px',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>😵</div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: 1.6 }}>
              We're sorry for the inconvenience. The error has been logged and we'll look into it.
            </p>
            {this.state.error && (
              <details style={{
                background: 'var(--bg-light)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '2rem',
                textAlign: 'left',
                fontSize: '0.9rem',
                color: 'var(--text-light)',
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Error Details
                </summary>
                <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {this.state.error.toString()}
                </code>
              </details>
            )}
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '0.8rem 2rem',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 77, 0, 0.3)',
              }}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

