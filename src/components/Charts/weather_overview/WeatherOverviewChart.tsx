"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface WeatherDataPoint {
  x: string;
  y: number;
}

interface WeatherOverviewChartProps {
  data: {
    received: WeatherDataPoint[];
    due: WeatherDataPoint[];
  };
}

export function WeatherOverviewChart({ data }: WeatherOverviewChartProps) {
  // Combine received and due into one array with common x (date)
  const combinedData = data.received.map((item, index) => ({
    date: item.x,
    received: item.y,
    due: data.due[index]?.y ?? null,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={combinedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="date" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
        <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none" }} />
        <Legend />
        <Area
          type="monotone"
          dataKey="received"
          stroke="#22c55e"
          fillOpacity={1}
          fill="url(#colorReceived)"
          name="Humidity"
        />
        <Area
          type="monotone"
          dataKey="due"
          stroke="#3b82f6"
          fillOpacity={1}
          fill="url(#colorDue)"
          name="Temperature"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
