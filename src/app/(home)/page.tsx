import { WeatherOverview } from "@/components/Charts/weather_overview";
// import { TopChannels } from "@/components/Tables/top-channels";
import { TopChannelsSkeleton } from "@/components/Tables/top-channels/skeleton";
import { createTimeFrameExtractor } from "@/utils/timeframe-extractor";
import { Suspense } from "react";
import { DisasterAlertsCard } from "./_components/DisasterAlertsCard";
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RegionLabels } from "./_components/region-labels";
import { CrowdReportSection } from "./_components/CrowdReportSection"; 
import SafetyTips from "./_components/SafetyTips";
import { WeatherCard } from "./_components/WeatherCard";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Top Section - Overview Cards */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg">
        <Suspense fallback={<OverviewCardsSkeleton />}>
          <OverviewCardsGroup />
        </Suspense>
      </div>

      {/* Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Overview - Larger Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <WeatherOverview
            className="w-full h-full"
            key={extractTimeFrame("weather_overview")}
            timeFrame={extractTimeFrame("weather_overview")?.split(":")[1]}
          />
        </div>

        {/* Current Weather Card */}
        <div className="lg:col-span-1">
          <WeatherCard />
        </div>
      </div>

      {/* Alerts and Region Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disaster Alerts - Dark theme styling */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1f2d] rounded-xl shadow-lg h-[500px] overflow-hidden">
            <div className="h-full p-6">
              <h2 className="text-[#ff6b6b] text-xl font-semibold mb-6">Real-time Disaster Alerts</h2>
              <div className="h-[calc(100%-2rem)] overflow-y-auto pr-2 space-y-4">
                <Suspense fallback={null}>
                  <DisasterAlertsCard />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Region Labels - Map section with title */}
        <div className="lg:col-span-2">
          <div className="bg-[#1a1f2d] rounded-xl shadow-lg h-[500px] overflow-hidden">
            <div className="h-full">
              <div className="p-6 pb-2">
                <h2 className="text-white text-xl font-semibold">India Disaster Map</h2>
              </div>
              <div className="h-[calc(100%-4rem)]">
                <RegionLabels />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community and Safety Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crowd Reports */}
        <div className="bg-[#1a1f2d] rounded-xl shadow-lg p-6">
          <CrowdReportSection />
        </div>

        {/* Safety Tips */}
        <div className="bg-[#1a1f2d] rounded-xl shadow-lg p-6">
          <SafetyTips />
        </div>
      </div>

      {/* Additional Content - Full Width */}
      <div className="bg-[#1a1f2d] rounded-xl shadow-lg">
        <Suspense fallback={<TopChannelsSkeleton />}>
          {/* Reserved for future content */}
        </Suspense>
      </div>
    </div>
  );
}
