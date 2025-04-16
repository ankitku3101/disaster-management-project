"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon not found issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Disaster Hotspot Data
const disasterHotspots = [
  {
    id: 1,
    type: "Flood",
    lat: 26.8467,
    lng: 80.9462,
    severity: "High",
    location: "Lucknow, UP",
  },
  {
    id: 2,
    type: "Earthquake",
    lat: 28.6139,
    lng: 77.209,
    severity: "Moderate",
    location: "Delhi",
  },
  {
    id: 3,
    type: "Cyclone",
    lat: 15.2993,
    lng: 74.124,
    severity: "Severe",
    location: "Goa",
  },
  {
    id: 4,
    type: "Heatwave",
    lat: 22.5726,
    lng: 88.3639,
    severity: "Moderate",
    location: "Kolkata",
  },
];

export default function Map() {
  useEffect(() => {
    const map = L.map("mapOne").setView([22.9734, 78.6569], 5); // Center on India

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    disasterHotspots.forEach((spot) => {
      const color =
        spot.severity === "Severe"
          ? "red"
          : spot.severity === "High"
          ? "orange"
          : "yellow";

      const marker = L.circleMarker([spot.lat, spot.lng], {
        radius: 10,
        fillColor: color,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).addTo(map);

      marker.bindPopup(
        `<strong>${spot.type}</strong><br/>Location: ${spot.location}<br/>Severity: ${spot.severity}`
      );
    });

    // Cleanup: Remove the map when component unmounts
    return () => {
      map.remove(); // This properly cleans up the map
    };
  }, []); // Empty dependency array, run once on mount

  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-gray-900">
      <div
        id="mapOne"
        className="h-full w-full rounded-xl"
        style={{ zIndex: 1 }}
      />
    </div>
  );
}
