// components/crowdsourcedreporting/ReportList.tsx
'use client';

import { UserReport } from '@/types/report';

type Props = {
  reports: UserReport[];
};

export const ReportList = ({ reports }: Props) => {
  return (
    <div className="space-y-4 max-h-[300px] overflow-y-auto">
      {reports.length === 0 && (
        <p className="text-sm text-gray-500">No reports submitted yet.</p>
      )}
      {reports.map((report) => (
        <div
          key={report.id}
          className="border rounded p-3 bg-gray-50"
        >
          <p className="text-sm mb-1">{report.description}</p>
          {report.mediaUrl && (
            <div className="mt-2">
              {report.mediaUrl.endsWith('.mp4') ? (
                <video controls className="w-full max-h-48 rounded">
                  <source src={report.mediaUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={report.mediaUrl}
                  alt="Report media"
                  className="w-full max-h-48 object-cover rounded"
                />
              )}
            </div>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};
