import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Development-only component for testing without OAuth
const DevAuthButton = () => {
  const { login, isAuthenticated, logout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Only show in development
  if (import.meta.env.PROD) return null;

  const handleDevLogin = async () => {
    try {
      setLoading(true);
      
      // Fetch the first seeded user from backend
      const usersResponse = await axios.get(`${API_URL}/users`);
      const firstUser = usersResponse.data.users?.[0];
      
      if (!firstUser) {
        alert('No users found in database! Run: npm run seed-all');
        return;
      }

      // Create a dev token by simulating OAuth flow
      // Since we don't have password auth, we'll create a special dev endpoint
      // For now, let's use the user's Google ID to generate a token
      const authResponse = await axios.post(`${API_URL}/auth/dev-login`, {
        userId: firstUser._id
      });

      if (authResponse.data.success) {
        login(authResponse.data.token, authResponse.data.user);
      } else {
        alert('Dev login failed!');
      }
    } catch (error: any) {
      console.error('Dev login error:', error);
      alert(error.response?.data?.message || 'Dev login failed! Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return (
      <button
        onClick={logout}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10000,
          padding: '12px 24px',
          background: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        🚪 Logout (Dev Mode)
      </button>
    );
  }

  return (
    <button
      onClick={handleDevLogin}
      disabled={loading}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 10000,
        padding: '12px 24px',
        background: loading ? '#999' : 'linear-gradient(135deg, #FF4D00, #CC3D00)',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        fontSize: '14px',
        fontWeight: 600,
        cursor: loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 4px 15px rgba(255, 77, 0, 0.3)',
        fontFamily: 'Poppins, sans-serif',
        opacity: loading ? 0.7 : 1
      }}
    >
      {loading ? '⏳ Logging in...' : '🔓 DEV LOGIN (Test Mode)'}
    </button>
  );
};

export default DevAuthButton;

