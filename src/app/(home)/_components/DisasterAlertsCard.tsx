"use client";

import { formatMessageTime } from "@/lib/format-message-time";
import { getDisasterAlerts } from "../fetch";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export async function DisasterAlertsCard() {
  const alerts = await getDisasterAlerts();

  return (
    <div className="col-span-12 xl:col-span-5 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full rounded-2xl border border-red-200 bg-white px-6 py-6 shadow-xl dark:border-red-900 dark:bg-gray-900"
      >
        <h2 className="mb-6 text-xl font-bold text-red-600 dark:text-red-400">
          🚨 Real-time Disaster Alerts
        </h2>

        <ul className="space-y-4">
          {alerts.map((alert, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg bg-red-50 px-4 py-3 transition hover:bg-red-100 dark:bg-dark-2 dark:hover:bg-dark-3"
            >
              <Link
                href={alert.url || "#"}
                target="_blank"
                className="flex gap-4 items-start"
              >
                <div className="pt-1">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                </div>

                <div className="flex-grow space-y-1">
                  <h3 className="text-base font-semibold text-dark dark:text-white">
                    {alert.title}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-400 leading-relaxed">
                    {alert.description}
                  </p>
                  <time
                    className="text-xs text-gray-500 dark:text-gray-500"
                    dateTime={alert.timestamp}
                  >
                    {formatMessageTime(alert.timestamp)}
                  </time>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
