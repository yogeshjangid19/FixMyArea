import React from "react";
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const userStats = {
    total: 12,
    resolved: 5,
    inProgress: 3,
    pending: 4,
  };

  const userIssues = [
    {
      id: 1,
      title: "Garbage not collected",
      date: "2025-04-10",
      category: "Sanitation",
      status: "Resolved",
      address: "Block C, Tonk Road",
      priority: "High",
      description: "Garbage has not been collected for 3 days",
    },
    {
      id: 2,
      title: "Street light broken",
      date: "2025-04-12",
      category: "Lighting",
      status: "Pending",
      address: "Tiger Hill, Sodala",
      priority: "Medium",
      description: "Street light near park not working",
    },
    // Add more mock data here
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Welcome, Tisha!</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{userStats.total}</p>
            <p>Total Issues</p>
          </div>
          <div className="bg-green-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{userStats.resolved}</p>
            <p>Resolved</p>
          </div>
          <div className="bg-yellow-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{userStats.inProgress}</p>
            <p>In Progress</p>
          </div>
          <div className="bg-red-100 p-4 rounded-xl text-center">
            <p className="text-xl font-bold">{userStats.pending}</p>
            <p>Pending</p>
          </div>
        </div>

        {/* User Issues */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Reported Issues</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userIssues.map((issue) => (
              <div
                key={issue.id}
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
                  <span className="text-sm text-gray-500">{issue.date}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{issue.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
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
          </div>
        </div>

        {/* Report New Issue Button */}
        <div className="text-center">
        <button
          onClick={() => navigate('/reportissue')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Report New Issue
        </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
