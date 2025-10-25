import { useState, useEffect } from 'react';
import './WeatherWidget.css';

interface WeatherWidgetProps {
  eventDate?: string;
  location?: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

const WeatherWidget = ({ eventDate, location }: WeatherWidgetProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo weather data (for now, until API key is added)
  const demoWeather: WeatherData = {
    temp: 28,
    condition: 'Sunny',
    icon: '☀️',
    humidity: 45,
    windSpeed: 12,
    description: 'Perfect riding weather! Clear skies expected.',
  };

  useEffect(() => {
    // Check if we have the necessary data
    if (!eventDate || !location) {
      return;
    }

    // Check if API key is available
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    if (!apiKey) {
      // Use demo data
      setWeather(demoWeather);
      return;
    }

    // Fetch real weather data
    fetchWeather(location, apiKey);
  }, [eventDate, location]);

  const fetchWeather = async (loc: string, apiKey: string) => {
    setLoading(true);
    setError(null);

    try {
      // OpenWeatherMap API call
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Weather data unavailable');
      }

      const data = await response.json();

      setWeather({
        temp: Math.round(data.main.temp),
        condition: data.weather[0].main,
        icon: getWeatherIcon(data.weather[0].main),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        description: data.weather[0].description,
      });
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Using demo weather data');
      setWeather(demoWeather);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string): string => {
    const icons: Record<string, string> = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Fog: '🌫️',
      Haze: '🌁',
    };
    return icons[condition] || '🌤️';
  };

  const getWeatherAdvice = (temp: number, condition: string): string => {
    if (temp > 35) return '🔥 Very hot! Stay hydrated and take frequent breaks.';
    if (temp > 30) return '☀️ Hot weather. Carry water and wear light gear.';
    if (temp < 15) return '❄️ Cold weather. Wear warm riding gear.';
    if (condition === 'Rain' || condition === 'Thunderstorm') {
      return '⚠️ Rain expected. Consider waterproof gear and check road conditions.';
    }
    return '✅ Great riding conditions! Perfect weather for the road.';
  };

  const formatEventDate = (date: string): string => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return d.toLocaleDateString('en-US', options);
  };

  if (!eventDate || !location) {
    return (
      <div className="weather-widget-container">
        <div className="weather-placeholder">
          <div className="placeholder-icon">🌤️</div>
          <p>Enter event date and location to see weather forecast</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="weather-widget-container">
        <div className="weather-loading">
          <div className="loading-spinner">🌀</div>
          <p>Fetching weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-widget-container">
      <div className="weather-header">
        <div className="weather-icon-large">{weather?.icon || '🌤️'}</div>
        <div className="weather-title">
          <h4>Weather Forecast</h4>
          <p>{location} • {eventDate && formatEventDate(eventDate)}</p>
        </div>
      </div>

      {weather && (
        <>
          <div className="weather-main">
            <div className="weather-temp">
              {weather.temp}°C
              <span className="temp-label">{weather.condition}</span>
            </div>
            <div className="weather-details">
              <div className="weather-detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="weather-detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-label">Wind</span>
                <span className="detail-value">{weather.windSpeed} km/h</span>
              </div>
            </div>
          </div>

          <div className="weather-advice">
            <span className="advice-icon">🏍️</span>
            <p>{getWeatherAdvice(weather.temp, weather.condition)}</p>
          </div>

          {error && (
            <div className="weather-note demo">
              <span className="note-icon">ℹ️</span>
              <span className="note-text">
                Demo weather data shown. Add <code>VITE_WEATHER_API_KEY</code> to .env for real forecasts!
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WeatherWidget;

