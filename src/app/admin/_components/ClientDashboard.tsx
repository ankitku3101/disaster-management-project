"use client";

import { useEffect, useState } from "react";
import Modal from "./Modal";
import { UserReport } from "@/types/report";

export default function ClientDashboard() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/get-all-reports");
        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();
        setReports(data.data);
      } catch (err) {
        console.error(err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const openModal = (report: UserReport) => {
    setSelectedReport(report);
  };

  const closeModal = () => {
    setSelectedReport(null);
  };

  return (
    <div className="p-6 bg-white text-black dark:bg-[#0f172a] dark:text-white min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {currentReports.map((report) => (
              <li
                key={report._id}
                className="p-5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 shadow hover:shadow-md transition cursor-pointer"
                onClick={() => openModal(report)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-base font-medium text-gray-800 dark:text-gray-100">
                      {report.description.length > 80
                        ? report.description.slice(0, 80) + "..."
                        : report.description}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{report.location}</span>
                    <span>{report.disasterType}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * reportsPerPage >= reports.length}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {selectedReport && (
            <Modal onClose={closeModal}>
              <div>
                <h2 className="text-2xl font-bold mb-4">{selectedReport.name}</h2>
                <p className="mb-4">{selectedReport.description}</p>
                <img
                  src={selectedReport.imageUrl}
                  alt="Report Image"
                  className="w-full h-auto rounded-md mb-4"
                />
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>Location: {selectedReport.location}</p>
                  <p>Pincode: {selectedReport.pincode}</p>
                  <p>Disaster Type: {selectedReport.disasterType}</p>
                  <p>
                    Timestamp:{" "}
                    {new Date(selectedReport.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
