import { formatMessageTime } from "@/lib/format-message-time";
import { cn } from "@/lib/utils";
import { getDisasterAlerts } from "../fetch";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export async function DisasterAlertsCard() {
  const alerts = await getDisasterAlerts();

  return (
    <div className="col-span-12 xl:col-span-5 flex justify-center">
      <div className="rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card w-full"> 
        <h2 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-red-600 dark:text-red-400">
          Real-time Disaster Alerts
        </h2>

        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              <Link
                href={alert.url || "#"}
                target="_blank"
                className="flex gap-4.5 px-7.5 py-3 items-start hover:bg-red-50 dark:hover:bg-dark-2"
              >
                <div className="pt-1">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                </div>

                <div className="flex-grow">
                  <h3 className="font-medium text-dark dark:text-white">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-dark-4 dark:text-dark-6 leading-snug line-clamp-3">
                    {alert.description}
                  </p>
                  <time
                    className="text-xs text-gray-500 dark:text-gray-400"
                    dateTime={alert.timestamp}
                  >
                    {formatMessageTime(alert.timestamp)}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
