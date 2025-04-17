import { WeatherChartWrapper } from "@/components/Charts/weather_overview/WeatherChartWrapper"; // ✅ use wrapper
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
    <>
      {/* 👇 Overview Cards Section */}
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      {/* 👇 Main Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* 🟦 Weather Overview Chart */}
        <div className="col-span-12 xl:col-span-7 ">
          <WeatherChartWrapper /> {/* ✅ FIXED: No more undefined chartData */}
        </div>

        {/* 🟥 Disaster Alerts */}
        <div className="col-span-12 xl:col-span-5">
          <DisasterAlertsCard />
        </div>

        {/* 🟨 Region Labels */}
        <div className="col-span-12">
          <RegionLabels />
        </div>

        {/* 🟩 Community Crowd Reports */}
        <div className="col-span-12">
          <CrowdReportSection />
        </div>

        {/* 🟧 Safety Tips + WeatherCard
        <div className="col-span-12 xl:col-span-8">
          <SafetyTips />
        </div> */}
        {/* <div className="col-span-12 xl:col-span-4">
          <WeatherCard />
        </div> */}

        {/* 🟫 Top Channels Placeholder */}
        <div className="col-span-12">
          <Suspense fallback={<TopChannelsSkeleton />}>
            {/* <TopChannels /> */}
          </Suspense>
        </div>
      </div>  
    </>
  );
}
