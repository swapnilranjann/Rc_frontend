import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MotorcycleLoader from './ui/MotorcycleLoader';

const NavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);

    // Hide loader after a short delay to show animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="navigation-loader">
      <MotorcycleLoader size="large" text="Lets Ride! 🏍️" />
    </div>
  );
};

export default NavigationLoader;

