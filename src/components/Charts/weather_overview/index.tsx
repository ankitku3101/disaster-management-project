import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getWeatherOverviewData } from "@/services/charts.services";
import { WeatherOverviewChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function WeatherOverview({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const data = await getWeatherOverviewData(timeFrame); // 🌤️ your custom function

  return (
    <div
      className={cn(
        "grid gap-2 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Weather Stats
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="weather_overview" />
      </div>

      <WeatherOverviewChart data={data} />

      <dl className="grid divide-stroke text-center dark:divide-dark-3 sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="dark:border-dark-3 max-sm:mb-3 max-sm:border-b max-sm:pb-3">
          <dt className="text-xl font-bold text-dark dark:text-white">
            {data?.temperatureAvg}°C
          </dt>
          <dd className="font-medium dark:text-dark-6">Avg. Temperature</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-dark dark:text-white">
            {data?.humidityAvg}%
          </dt>
          <dd className="font-medium dark:text-dark-6">Avg. Humidity</dd>
        </div>
      </dl>
    </div>
  );
}
