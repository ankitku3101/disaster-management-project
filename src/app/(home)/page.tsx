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
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <WeatherOverview
          className="col-span-12 xl:col-span-7"
          key={extractTimeFrame("weather_overview")}
          timeFrame={extractTimeFrame("weather_overview")?.split(":")[1]}
        />

        <Suspense fallback={null}>
          <DisasterAlertsCard />
        </Suspense>

        <RegionLabels />

        {/* ✅ Community Crowd Report Section */}
        <CrowdReportSection />

        {/* ✅ Safety Tips Section */}
        <div className="col-span-12">
          <SafetyTips />
        </div>

        <div className="col-span-12 grid xl:col-span-8">
          <Suspense fallback={<TopChannelsSkeleton />}>
            {/* <TopChannels /> */}
          </Suspense>
        </div>
      </div>
    </>
  );
}
