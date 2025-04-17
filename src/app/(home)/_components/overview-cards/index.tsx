"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { OverviewCard } from "./card";
import * as icons from "./icons";

interface LocationContextType {
  coordinates: string;
  latitude: number | null;
  longitude: number | null;
}

export const LocationContext = createContext<LocationContextType>({
  coordinates: "Fetching...",
  latitude: null,
  longitude: null
});

export function OverviewCardsGroup() {
  const [locationData, setLocationData] = useState({
    location: "Fetching...",
    postal: "Fetching...",
    timezone: "Fetching...",
    coordinates: "Fetching...",
    latitude: null as number | null,
    longitude: null as number | null
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        
        // Ensure we have valid coordinates
        if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
          throw new Error('Invalid coordinates received');
        }

        console.log('[OverviewCards] Received coordinates:', {
          latitude: data.latitude,
          longitude: data.longitude
        });

        setLocationData({
          location: `${data.city}, ${data.country_name}`,
          postal: data.postal,
          timezone: data.timezone,
          coordinates: `${data.latitude}, ${data.longitude}`,
          latitude: data.latitude,
          longitude: data.longitude
        });
      } catch (error) {
        console.error('[OverviewCards] Error fetching location:', error);
        setLocationData({
          location: "Unavailable",
          postal: "Unavailable",
          timezone: "Unavailable",
          coordinates: "Unavailable",
          latitude: null,
          longitude: null
        });
      }
    };

    fetchLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ 
      coordinates: locationData.coordinates,
      latitude: locationData.latitude,
      longitude: locationData.longitude
    }}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <OverviewCard
          label="Your Location"
          data={{ value: locationData.location }}
          Icon={icons.Location}
        />

        <OverviewCard
          label="Pin Code"
          data={{ value: `${locationData.postal}` }}
          Icon={icons.Pincode}
        />

        <OverviewCard
          label="Time Zone"
          data={{ value: `${locationData.timezone}` }}
          Icon={icons.Timezone}
        />

        <OverviewCard
          label="Lat & Long"
          data={{ value: locationData.coordinates }}
          Icon={icons.Coordinates}
        />
      </div>
    </LocationContext.Provider>
  );
}
