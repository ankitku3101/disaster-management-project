"use client";

import { useEffect, useState } from "react";
import Modal from "./_components/Modal"; // Updated import for the modal
import { UserReport } from "@/types/report";

export default function AdminDashboard() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10); // Number of reports per page
  const [selectedReport, setSelectedReport] = useState<UserReport | null>(null); // State to store the selected report

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("/api/get-all-reports");
        if (!res.ok) throw new Error("Failed to fetch reports");

        const data = await res.json();
        setReports(data.data); // Assuming data.data holds the report list
      } catch (err) {
        console.error(err);
        setReports([]); // fallback to empty list
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <ul className="space-y-4">
              {currentReports.map((report) => (
                <li
                  key={report._id}
                  className="border p-4 rounded-md shadow-sm hover:shadow-lg cursor-pointer"
                  onClick={() => openModal(report)} // Open modal on click
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl">{report.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{report.location}</span>
                      <span>{report.disasterType}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Previous
            </button>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage * reportsPerPage >= reports.length}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          </div>

          {/* Modal for report description */}
          {selectedReport && (
            <Modal onClose={closeModal}>
              <div>
                <h2 className="text-xl font-bold mb-4">{selectedReport.name}</h2>
                <p className="mb-4">{selectedReport.description}</p>
                <img
                  src={selectedReport.imageUrl}
                  alt="Report Image"
                  className="w-full h-auto rounded-md mb-4"
                />
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Location: {selectedReport.location}</p>
                  <p className="text-sm text-gray-500">Pincode: {selectedReport.pincode}</p>
                  <p className="text-sm text-gray-500">Disaster Type: {selectedReport.disasterType}</p>
                  <p className="text-sm text-gray-500">Timestamp: {new Date(selectedReport.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}
