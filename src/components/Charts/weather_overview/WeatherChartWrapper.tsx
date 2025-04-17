"use client";

import { useEffect, useState } from "react";
import { WeatherOverviewChart } from "./WeatherOverviewChart";

interface WeatherDataPoint {
  x: string;
  y: number;
}

interface WeatherData {
  received: WeatherDataPoint[];
  due: WeatherDataPoint[];
}

export function WeatherChartWrapper() {
  const [chartData, setChartData] = useState<WeatherData>({
    received: [],
    due: [],
  });

  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  const dummyMonthlyData = {
    received: [
      { x: "Jan", y: 30 },
      { x: "Feb", y: 45 },
      { x: "Mar", y: 50 },
      { x: "Apr", y: 35 },
      { x: "May", y: 60 },
      { x: "Jun", y: 40 },
    ],
    due: [
      { x: "Jan", y: 25 },
      { x: "Feb", y: 40 },
      { x: "Mar", y: 55 },
      { x: "Apr", y: 30 },
      { x: "May", y: 50 },
      { x: "Jun", y: 35 },
    ],
  };

  const dummyYearlyData = {
    received: [
      { x: "2020", y: 350 },
      { x: "2021", y: 420 },
      { x: "2022", y: 390 },
      { x: "2023", y: 480 },
    ],
    due: [
      { x: "2020", y: 300 },
      { x: "2021", y: 370 },
      { x: "2022", y: 400 },
      { x: "2023", y: 450 },
    ],
  };

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        console.log("[WeatherChartWrapper] Fetching IP-based location...");

        const res_ip = await fetch("https://ipapi.co/json");
        const data_ip = await res_ip.json();

        console.log("[WeatherChartWrapper] Location data:", data_ip);

        const url = `https://mole-model-drake.ngrok-free.app/get-past-weather?start=2024-12-12@lat=${data_ip.latitude}&lon=${data_ip.longitude}`;
        console.log("[WeatherChartWrapper] Fetching past weather from:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Weather API error! Status: ${res.status}`);
        }

        const data = await res.json();
        console.log("[WeatherChartWrapper] Weather data:", data);

        const formatted: WeatherData = {
          received: data?.received?.map((item: any) => ({
            x: item.date,
            y: item.value,
          })) || [],
          due: data?.due?.map((item: any) => ({
            x: item.date,
            y: item.value,
          })) || [],
        };

        setChartData(formatted);  // Set the chart data
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };

    fetchWeatherData();
  }, []);

  // Select data based on monthly or yearly view
  const chartDataToUse = view === "monthly" ? dummyMonthlyData : dummyYearlyData;

  return (
    <div className="rounded-[10px] bg-gray-900 p-6 shadow-xl text-white w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Weather Overview</h2>
        <select
          className="bg-gray-800 text-white px-3 py-1 rounded"
          value={view}
          onChange={(e) => setView(e.target.value as "monthly" | "yearly")}
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-800 rounded w-1/3" />
          <div className="h-64 bg-gray-800 rounded w-full" />
        </div>
      ) : (
        <WeatherOverviewChart data={chartDataToUse} />
      )}
    </div>
  );
}
