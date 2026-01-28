import React from "react";

const AdminDashboard = () => {
  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">
        {/* Top summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Total Reports', 'Resolved Issues', 'Pending Issues', 'Response Time'].map((title, idx) => (
            <div
              key={idx}
              className="border p-4 rounded-2xl shadow-sm text-center bg-gray-50"
            >
              <h4 className="text-lg font-semibold">{title}</h4>
              <p className="text-sm text-gray-500">
                Status for the {title.toLowerCase()} based on the past month report
              </p>
            </div>
          ))}
        </div>

        {/* Recent Reports Table */}
        <div className="rounded-2xl border p-4 bg-white">
          <h3 className="text-xl font-semibold mb-4">Recent Reports</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-600">
                <th className="pb-2">Issue</th>
                <th className="pb-2">Location</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Large potholes', 'tiger hill, sodala', 'Pending', '12/12/2024'],
                ['Broken StreetLights', 'yuvraj house, jagatpura', 'Resolved', '12/12/2024'],
                ['Garbage', 'Tisha house, tonk road', 'In Progress', '12/12/2024']
              ].map(([issue, location, status, date], idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{issue}</td>
                  <td>{location}</td>
                  <td>
                    <span
                      className={`text-white px-3 py-1 rounded-full text-xs font-medium ${
                        status === 'Pending'
                          ? 'bg-red-400'
                          : status === 'Resolved'
                          ? 'bg-green-400'
                          : 'bg-yellow-400'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>{date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Manage Departments */}
        <div className="rounded-2xl border p-4 space-y-6 bg-white">
          <h3 className="text-lg font-semibold">Manage Departments</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border p-4">
              <h4 className="font-semibold mb-2">Issued By Categories</h4>
              {[
                ['Road Issues', 45],
                ['Lightings', 25],
                ['Garbage', 30]
              ].map(([label, percent], idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm">{label}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border p-4">
              <h4 className="font-semibold mb-2">Response Time By Departments</h4>
              <div className="text-center h-40 flex items-end justify-around">
                {['Road Dept', 'Lighting', 'Garbage'].map((dept, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="w-4 bg-gray-400 rounded-t-md" style={{ height: `${50 + idx * 20}px` }}></div>
                    <span className="text-sm mt-1">{dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-2xl">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded-md flex-grow"
          />
          <select className="border p-2 rounded-md">
            <option>All Types</option>
          </select>
          <select className="border p-2 rounded-md">
            <option>All Status</option>
          </select>
          <select className="border p-2 rounded-md">
            <option>All Priority</option>
          </select>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-2xl p-4 bg-white">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs px-2 py-1 bg-red-300 rounded-full">Pending</span>
              <span className="text-xs text-gray-500">2h ago</span>
            </div>
            <h4 className="font-semibold mb-1">Large Pothole</h4>
            <p className="text-sm mb-2">Lorem ipsum tere esi sas ki tesi...</p>
            <p className="text-sm text-gray-600 mb-1">📍 Tisha ka pihar, sehopura</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">Titri Pareek</span>
              <span className="px-3 py-1 bg-red-200 rounded-full text-xs">High Priority</span>
            </div>
          </div>

          <div className="border rounded-2xl p-4 bg-white">
            <h4 className="font-semibold mb-1">Title of the Problem</h4>
            <p className="text-sm mb-2">Description of the problem</p>
            <p className="text-sm text-gray-600 mb-1">📍 address</p>
            <div className="flex justify-between items-center">
              <span className="text-sm">citizen name</span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs">Low</span>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center space-x-2 pt-6">
          <button className="px-3 py-1 border rounded-lg">Previous</button>
          {[1, 2, 3].map((n) => (
            <button key={n} className="px-3 py-1 border rounded-lg">
              {n}
            </button>
          ))}
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 border rounded-lg">q</button>
          <button className="px-3 py-1 border rounded-lg">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
