"use client";

import { useEffect, useState } from "react";
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudLightning, 
  Wind, 
  Droplets,
  CloudDrizzle,
  CloudFog,
  CloudSnow,
  CloudHail,
  Cloudy,
  SunDim,
  CloudSun
} from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  country_name: string;
}

export function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    try {
      console.log('[WeatherCard] Fetching location from ipapi.co...');
      const response = await fetch('https://ipapi.co/json/');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[WeatherCard] Location data received:', data);

      if (!data.latitude || !data.longitude) {
        throw new Error('Invalid location data received');
      }

      setLocationData({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country_name: data.country_name
      });

      return { latitude: data.latitude, longitude: data.longitude };
    } catch (err) {
      console.error('[WeatherCard] Error fetching location:', err);
      throw new Error('Failed to get location data');
    }
  };

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      console.log('[WeatherCard] Fetching weather data with coordinates:', { lat, lon });
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('[WeatherCard] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('[WeatherCard] Weather data received:', data);

      // Validate the required fields
      if (!data || typeof data.temperature !== 'number' || !data.condition) {
        console.error('[WeatherCard] Invalid weather data structure:', data);
        throw new Error('Invalid weather data received');
      }

      setWeatherData(data);
    } catch (err) {
      console.error('[WeatherCard] Error fetching weather:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to get weather data');
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await fetchLocation();
      await fetchWeather(location.latitude, location.longitude);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      console.error('[WeatherCard] Error in fetchData:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className="text-yellow-500" size={36} />;
      
      case 'partly cloudy':
      case 'partly sunny':
        return <CloudSun className="text-gray-400" size={36} />;
      
      case 'cloudy':
      case 'clouds':
      case 'overcast':
        return <Cloudy className="text-gray-500" size={36} />;
      
      case 'mist':
      case 'fog':
      case 'haze':
        return <CloudFog className="text-gray-400" size={36} />;
      
      case 'drizzle':
      case 'light rain':
        return <CloudDrizzle className="text-blue-400" size={36} />;
      
      case 'rain':
      case 'moderate rain':
        return <CloudRain className="text-blue-500" size={36} />;
      
      case 'heavy rain':
      case 'extreme rain':
        return (
          <div className="relative">
            <CloudRain className="text-blue-600" size={36} />
            <CloudRain className="text-blue-400 absolute top-1 left-1" size={36} />
          </div>
        );
      
      case 'thunderstorm':
      case 'thunder':
        return <CloudLightning className="text-purple-500" size={36} />;
      
      case 'snow':
      case 'light snow':
        return <CloudSnow className="text-blue-200" size={36} />;
      
      case 'heavy snow':
        return (
          <div className="relative">
            <CloudSnow className="text-blue-200" size={36} />
            <CloudSnow className="text-white absolute top-1 left-1" size={36} />
          </div>
        );
      
      case 'hail':
      case 'sleet':
        return <CloudHail className="text-blue-300" size={36} />;
      
      case 'dust':
      case 'sand':
      case 'smoke':
        return <SunDim className="text-yellow-600" size={36} />;
      
      default:
        return <Cloud className="text-gray-500" size={36} />;
    }
  };

  if (loading) {
    return (
      <div className="rounded-[10px] bg-gray-900 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          Current Weather
        </h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="h-8 bg-gray-800 rounded w-1/2"></div>
          <div className="h-4 bg-gray-800 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[10px] bg-gray-900 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          Current Weather
        </h2>
        <p className="text-red-400">{error}</p>
        <button 
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="rounded-[10px] bg-gray-900 p-6 shadow-xl text-white">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-1">
            Current Weather
          </h2>
          {locationData && (
            <p className="text-gray-400 text-sm">
              {locationData.city}, {locationData.country_name}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Weather Display */}
          <div className="flex items-start gap-4">
            {getWeatherIcon(weatherData.condition)}
            <div>
              <p className="text-4xl font-bold">{weatherData.temperature}°C</p>
              <p className="text-gray-400 capitalize">{weatherData.condition}</p>
            </div>
          </div>

          {/* Weather Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Droplets className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Humidity</p>
                <p className="font-medium">{weatherData.humidity}%</p>
              </div>
            </div>

            {weatherData.windSpeed > 0 && (
              <div className="flex items-center gap-2">
                <Wind className="text-gray-400" size={20} />
                <div>
                  <p className="text-sm text-gray-400">Wind Speed</p>
                  <p className="font-medium">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 