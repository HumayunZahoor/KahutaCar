import React from "react";
import { FaTaxi, FaWallet, FaHistory, FaHeadset, FaMapMarkerAlt } from "react-icons/fa";

const CustomerDashboard = () => {
  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        <FaTaxi className="text-cyan-600" /> Customer Panel
      </h2>
      <p className="mt-2 text-gray-400">Book rides, track your journey, and manage payments.</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaHistory /> Recent Rides
          </h3>
          <p>Ride 1: 15 miles - Rs20</p>
          <p>Ride 2: 8 miles - Rs10</p>
          <p>Ride 3: 18 miles - Rs25</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaWallet /> Wallet Balance
          </h3>
          <p>Available Balance: Rs75</p>
          <p>Last Recharge: Rs30</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaMapMarkerAlt /> Saved Locations
          </h3>
          <p>Home: Downtown Ave</p>
          <p>Work: Tech Hub Street</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaHeadset /> Customer Support
          </h3>
          <p>Contact: 24/7 Support Available</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
