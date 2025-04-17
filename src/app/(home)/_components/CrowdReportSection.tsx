'use client';
import { useState } from 'react';
import { ReportForm } from './crowdsourcedreporting/ReportForm';
import { ReportList } from './crowdsourcedreporting/ReportList';
import { UserReport } from '@/types/report';
import { AlertTriangle } from 'lucide-react';

export const CrowdReportSection = () => {
  const [reports, setReports] = useState<UserReport[]>([]);

  const handleNewReport = (report: UserReport) => {
    setReports((prev) => [report, ...prev]);
  };

  const handleDeleteReport = (timestamp: string) => {
    setReports((prev) => prev.filter((report) => report.timestamp !== timestamp));
  };

  return (
    <div className="col-span-12 xl:col-span-6">
      <div className="rounded-[10px] bg-white py-6 px-5 shadow-1 dark:bg-gray-dark dark:shadow-card w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-50 rounded-full">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Report a Disaster</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Share incident details and get immediate safety alerts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-800">Real-time Alerts</h3>
            </div>
            <p className="text-sm text-gray-600">Get instant safety recommendations based on your report</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Safety First</h3>
            </div>
            <p className="text-sm text-gray-600">Receive critical safety steps and evacuation guidance</p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-800">Community Support</h3>
            </div>
            <p className="text-sm text-gray-600">Help others stay informed about disaster situations</p>
          </div>
        </div>

        <ReportForm onSubmit={handleNewReport} />
        <ReportList reports={reports} onDelete={handleDeleteReport} />
      </div>
    </div>
  );
};
