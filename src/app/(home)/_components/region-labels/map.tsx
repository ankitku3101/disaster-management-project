"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
    type: "Landslide",
    lat: 27.1767,
    lng: 78.0081,
    severity: "Moderate",
    location: "Agra, UP",
  },
  {
    id: 5,
    type: "Heatwave",
    lat: 19.076,
    lng: 72.8777,
    severity: "High",
    location: "Mumbai, MH",
  },
  {
    id: 6,
    type: "Thunderstorm",
    lat: 13.0827,
    lng: 80.2707,
    severity: "Low",
    location: "Chennai, TN",
  },
];

export default function Map() {
  useEffect(() => {
    const map = L.map("map-container", {
      center: [22.9734, 78.6569], // Center of India
      zoom: 5,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    disasterHotspots.forEach((spot) => {
      const color =
        spot.severity === "Severe"
          ? "red"
          : spot.severity === "High"
          ? "orange"
          : spot.severity === "Moderate"
          ? "yellow"
          : "green";

      const iconUrl =
        color === "red"
          ? "https://upload.wikimedia.org/wikipedia/commons/e/ec/Red_dot.svg"
          : color === "orange"
          ? "https://upload.wikimedia.org/wikipedia/commons/2/2f/Orange_dot.svg"
          : color === "yellow"
          ? "https://upload.wikimedia.org/wikipedia/commons/e/e0/Yellow_dot.svg"
          : "https://upload.wikimedia.org/wikipedia/commons/a/a6/Marker_dot_green.svg";

      const customIcon = new L.Icon({
        iconUrl,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
        popupAnchor: [0, -10],
      });

      L.marker([spot.lat, spot.lng], { icon: customIcon })
        .addTo(map)
        .bindPopup(
          `<strong>${spot.type}</strong><br/>Location: ${spot.location}<br/>Severity: ${spot.severity}`
        );
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="h-[600px] w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      <div
        id="map-container"
        className="h-full w-full rounded-lg"
        style={{ minHeight: "100%", height: "100%" }}
      />
    </div>
  );
}
