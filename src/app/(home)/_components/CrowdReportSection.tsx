'use client';
import { useState } from 'react';
import { ReportForm } from './crowdsourcedreporting/ReportForm';
import { ReportList } from './crowdsourcedreporting/ReportList';
import { UserReport } from '@/types/report';

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
        <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400">📝 Community Disaster Reports</h2>
        <ReportForm onSubmit={handleNewReport} />
        <ReportList reports={reports} onDelete={handleDeleteReport} />
      </div>
    </div>
  );
};
