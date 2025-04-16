'use client';
import { UserReport } from '@/types/report';

type Props = {
  reports: UserReport[];
  onDelete: (timestamp: string) => void;
};

export function ReportList({ reports, onDelete }: Props) {
  return (
    <div className="space-y-6">
      {reports.map((report, index) => (
        <div key={index} className="p-4 border rounded bg-gray-50 dark:bg-gray-800 relative">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => onDelete(report.timestamp)}
              className="text-sm text-red-600 hover:text-red-800 bg-transparent border-none"
              title="Delete report"
            >
              ❌
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-300">{new Date(report.timestamp).toLocaleString()}</div>
          <div className="font-bold text-lg text-red-700 dark:text-red-400">{report.disasterType.toUpperCase()}</div>
          <div className="text-md text-gray-700 dark:text-gray-100">{report.location} {report.pincode}</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-200">{report.description}</p>
          {report.imageUrl && (
            <img src={report.imageUrl} alt="Report Image" className="mt-3 rounded w-full max-h-60 object-cover" />
          )}
          <div className="text-xs text-gray-400 mt-1">Reported by: {report.name}</div>
        </div>
      ))}
    </div>
  );
}
