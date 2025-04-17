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
  CloudSun,
} from "lucide-react";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

interface LocationData {
  city: string;
  country_name: string;
}

export function WeatherCard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationRes = await fetch("https://ipapi.co/json/");
        const location = await locationRes.json();
        setLocationData({
          city: location.city,
          country_name: location.country_name,
        });

        const weatherRes = await fetch(
          `/api/weather?lat=${location.latitude}&lon=${location.longitude}`
        );
        const weather = await weatherRes.json();

        setWeatherData(weather);
      } catch (err) {
        console.error("WeatherCard Error:", err);
      }
    };

    fetchData();
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
      case "sunny":
        return <Sun size={32} className="text-yellow-500" />;
      case "partly cloudy":
      case "partly sunny":
        return <CloudSun size={32} className="text-blue-700" />;
      case "cloudy":
      case "clouds":
        return <Cloudy size={32} className="text-blue-700" />;
      case "fog":
      case "haze":
        return <CloudFog size={32} className="text-blue-700" />;
      case "drizzle":
        return <CloudDrizzle size={32} className="text-blue-400" />;
      case "rain":
        return <CloudRain size={32} className="text-blue-500" />;
      case "heavy rain":
        return (
          <div className="relative">
            <CloudRain className="text-blue-600" size={32} />
            <CloudRain className="text-blue-400 absolute top-1 left-1" size={32} />
          </div>
        );
      case "thunder":
        return <CloudLightning size={32} className="text-purple-500" />;
      case "snow":
        return <CloudSnow size={32} className="text-blue-200" />;
      case "hail":
      case "sleet":
        return <CloudHail size={32} className="text-blue-300" />;
      case "dust":
      case "smoke":
        return <SunDim size={32} className="text-yellow-600" />;
      default:
        return <Cloud size={32} className="text-gray-500" />;
    }
  };

  if (!weatherData) return null;

  return (
    <div className="rounded-[10px] p-6 shadow-1 bg-gradient-to-br from-zinc-500 to-emerald-400 text-black space-y-6">
      {/* Icon and Temperature */}
      <div className="flex items-center gap-4">
        {getWeatherIcon(weatherData.condition)}
        <div>
          <p className="text-heading-6 font-bold">{weatherData.temperature}°C</p>
          <p className="text-sm capitalize text-black-6">{weatherData.condition}</p>
        </div>
      </div>

      {/* Location */}
      {locationData && (
        <p className="text-sm font-medium text-black-6">
          {locationData.city}, {locationData.country_name}
        </p>
      )}

      {/* Extra Info */}
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <Droplets className="text-black-400" size={20} />
          <span className="text-sm">{weatherData.humidity}%</span>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="text-black-400" size={20} />
          <span className="text-sm">{weatherData.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}
