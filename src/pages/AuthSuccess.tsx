import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(token, user);
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/', { replace: true });
      }
    } else {
      navigate('/', { replace: true });
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="auth-success">
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;

