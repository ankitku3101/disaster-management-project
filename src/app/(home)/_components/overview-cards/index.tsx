"use client";

import { useEffect, useState } from "react";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export function OverviewCardsGroup() {
  const [locationData, setLocationData] = useState({
    location: "Fetching...",
    postal: "Fetching...",
    timezone: "Fetching...",
    coordinates: "Fetching...",
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        setLocationData({
          location: `${data.city}, ${data.country_name}`,
          postal: data.postal,
          timezone: data.timezone,
          coordinates: `${data.latitude}, ${data.longitude}`,
        });
      } catch (error) {
        setLocationData({
          location: "Unavailable",
          postal: "Unavailable",
          timezone: "Unavailable",
          coordinates: "Unavailable",
        });
      }
    };

    fetchLocation();
  }, []);

  return (
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
  );
}
