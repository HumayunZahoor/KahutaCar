import React from "react";
import { FaUsers, FaChartBar, FaMoneyBillWave, FaClipboardList, FaServer } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        <FaUsers className="text-cyan-600" /> Admin Panel
      </h2>
      <p className="mt-2 text-gray-400">Manage users, monitor system, and track revenue.</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaChartBar /> User Statistics
          </h3>
          <p>Total Users: 1500</p>
          <p>Active Drivers: 400</p>
          <p>Active Customers: 1100</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaMoneyBillWave /> Revenue Overview
          </h3>
          <p>Monthly Revenue: Rs75,000</p>
          <p>Top Earning Driver: Jane Smith - Rs3000</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaClipboardList /> Operational Logs
          </h3>
          <p>Active Reports: 12</p>
          <p>System Updates: Weekly</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaServer /> System Health
          </h3>
          <p>Server Status: Online</p>
          <p>Last Downtime: 2 weeks ago</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
