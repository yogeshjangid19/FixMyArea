import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MunicipalDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch issues from backend
  const fetchIssues = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_BASE_URL}/issues`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, limit: 6 },
      });

      setIssues(res.data.issues);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching issues:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues(currentPage);
  }, [currentPage]);

  // Update issue status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/issues/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh issues after update
      fetchIssues(currentPage);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Pagination handler
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">

        <h2 className="text-2xl font-bold">Municipal Dashboard</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded-xl text-center bg-gray-50">
            <h4 className="font-semibold">Total Reports</h4>
            <p className="text-xl font-bold">{issues.length}</p>
          </div>

          <div className="border p-4 rounded-xl text-center bg-gray-50">
            <h4 className="font-semibold">Resolved Issues</h4>
            <p className="text-xl font-bold">
              {issues.filter((i) => i.status === "Resolved").length}
            </p>
          </div>

          <div className="border p-4 rounded-xl text-center bg-gray-50">
            <h4 className="font-semibold">Pending Issues</h4>
            <p className="text-xl font-bold">
              {issues.filter((i) => i.status === "Pending").length}
            </p>
          </div>
        </div>

        {/* Issues Table */}
        <div className="rounded-xl border p-4">
          <h3 className="text-xl font-semibold mb-4">Reported Issues</h3>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-2">Title</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Address</th>
                <th className="pb-2">Priority</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Update Status</th>
              </tr>
            </thead>

            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} className="border-t">
                  <td className="py-2">{issue.issueTitle}</td>
                  <td>{issue.category}</td>
                  <td>{issue.address}</td>
                  <td className="capitalize">{issue.priority}</td>

                  <td>
                    <span
                      className={`text-white px-3 py-1 rounded-full text-xs font-medium ${
                        issue.status === "Pending"
                          ? "bg-red-400"
                          : issue.status === "Resolved"
                          ? "bg-green-500"
                          : "bg-yellow-400"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </td>

                  <td>
                    <select
                      className="border rounded px-2 py-1"
                      value={issue.status}
                      onChange={(e) =>
                        handleStatusChange(issue._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}

              {issues.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No issues found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3 py-1 border rounded-lg"
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded-lg ${
                currentPage === i + 1 ? "bg-gray-300" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3 py-1 border rounded-lg"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default MunicipalDashboard;
