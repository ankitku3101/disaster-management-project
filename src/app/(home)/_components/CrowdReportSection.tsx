// components/CrowdReportSection.tsx
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

  return (
    <div className="col-span-12 xl:col-span-5 flex justify-center">
      <div className="rounded-[10px] bg-white py-6 shadow-1 dark:bg-gray-dark dark:shadow-card w-full">
        <h2 className="mb-5.5 px-7.5 text-body-2xlg font-bold text-blue-600 dark:text-blue-400">
          📝 Community Disaster Reports
        </h2>

        <div className="px-7.5">
          <ReportForm onSubmit={handleNewReport} />
          <ReportList reports={reports} />
        </div>
      </div>
    </div>
  );
};
