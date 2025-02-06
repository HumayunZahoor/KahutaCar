import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";

const CompletedRides = () => {
  const [completedRides, setCompletedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompletedRides = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/ride/get-completed-rides`);
        setCompletedRides(response.data);
      } catch (err) {
        setError("Failed to fetch completed rides.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedRides();
  }, []);

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        Completed Rides
      </h2>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-5">{error}</p>
      ) : completedRides.length === 0 ? (
        <p className="text-gray-400 text-center mt-5">No completed rides available.</p>
      ) : (
        <table className="min-w-full table-auto mt-6">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Driver Name</th>
              <th className="px-4 py-2 text-left">Start Location</th>
              <th className="px-4 py-2 text-left">End Location</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {completedRides.map((ride) => (
              <tr key={ride._id} className="bg-gray-900">
                <td className="px-4 py-2">{ride.driverId.name}</td>
                <td className="px-4 py-2">
                  {ride.startLocation.coordinates[0]}, {ride.startLocation.coordinates[1]}
                </td>
                <td className="px-4 py-2">
                  {ride.endLocation.coordinates[0]}, {ride.endLocation.coordinates[1]}
                </td>
                <td className="px-4 py-2 flex items-center gap-2">
                  <FaCheckCircle className="text-cyan-600" />
                  {ride.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CompletedRides;
