import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CitizenDashboard = () => {
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch logged-in user and their issues
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      // Get user info
      const userRes = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      // Get only this user's issues
      const issuesRes = await axios.get(`${API_BASE_URL}/issues/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(issuesRes.data);

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  // Real counts from database data
  const total = issues.length;
  const resolved = issues.filter(i => i.status === "Resolved").length;
  const inProgress = issues.filter(i => i.status === "In Progress").length;
  const pending = issues.filter(i => i.status === "Pending").length;

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-[100px]">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">

        {/* ✅ Correct Dynamic Name */}
        <h1 className="text-2xl font-semibold mb-6">
          Welcome, {user.name}!
        </h1>

        {/* ✅ Real Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{total}</p>
            <p>Total Issues</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{resolved}</p>
            <p>Resolved</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{inProgress}</p>
            <p>In Progress</p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{pending}</p>
            <p>Pending</p>
          </div>
        </div>

        {/* ✅ Real Issues From Database */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Reported Issues</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-gray-50 p-4 rounded-xl shadow border border-gray-200"
              >
                <div className="flex justify-between mb-2">
                  <span
                    className={`px-3 py-1 text-sm rounded-full ${
                      issue.status === "Resolved"
                        ? "bg-green-200 text-green-800"
                        : issue.status === "In Progress"
                        ? "bg-yellow-200 text-yellow-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {issue.status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-1">
                  {issue.issueTitle}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {issue.issueDescription}
                </p>

                <p className="text-sm text-gray-500">
                  <strong>Address:</strong> {issue.address}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Category:</strong> {issue.category}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Priority:</strong> {issue.priority}
                </p>
              </div>
            ))}

            {issues.length === 0 && (
              <p className="text-gray-500">You have not reported any issues yet.</p>
            )}
          </div>
        </div>

        {/* Report Issue Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/reportissue")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Report New Issue
          </button>
        </div>

      </div>
    </div>
  );
};

export default CitizenDashboard;
