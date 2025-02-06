import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRoad, FaDollarSign, FaCheckCircle, FaChartPie, FaCalendarAlt, FaCar, FaUserTie, FaMapMarkerAlt } from "react-icons/fa";
import {toast} from 'react-toastify';

const Management = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDriversAndVehicles = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/get-drivers-and-vehicles`);
          console.log(response.data);
          setDrivers(response.data.drivers);
          setVehicles(response.data.vehicles);
        } catch (err) {
          setError("Failed to fetch data.");
        } finally {
          setLoading(false);
        }
      };
      
    fetchDriversAndVehicles();
  }, []);

  const toggleDriverStatus = async (id, currentRole) => {
    try {
      const newRole = currentRole === "Driver" ? "Customer" : "Driver";
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/toggle-driver-status`, {
        id,
        role: newRole
      });
       toast.success(response.data.message, { type: 'success' });
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) =>
          driver._id === id ? { ...driver, userId: { ...driver.userId, role: newRole } } : driver
        )
      );
    } catch (error) {
      console.error("Error toggling driver status", error);
      toast.error(error.response.data.message, { type: 'error' });
    }
  };

  const toggleVehicleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Pending" ? "Approved" : "Pending"; 
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/toggle-vehicle-status`, {
        id,
        status: newStatus
      });
      toast.success(response.data.message, { type: 'success' });
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === id ? { ...vehicle, status: response.data.status } : vehicle
        )
      );
    } catch (error) {
      toast.error(error.response.data.message, { type: 'error' });
      console.error("Error toggling vehicle status", error);
    }
  };

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        <FaRoad className="text-cyan-600" /> Driver and Vehicle Management
      </h2>
      <p className="mt-2 text-gray-400">Manage drivers and vehicles, view their availability, and toggle their status.</p>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-5">{error}</p>
      ) : (
        <div className="mt-8">
          <div className="border-t border-cyan-600 pt-4">
            <h3 className="text-xl font-semibold text-cyan-600 mb-4">Drivers</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Contact</th>
                  <th className="px-4 py-2 text-left">Experience</th>
                  <th className="px-4 py-2 text-left">Vehicle Type</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver._id} className="bg-gray-900">
                    <td className="px-4 py-2">{driver.name}</td>
                    <td className="px-4 py-2">{driver.contactNumber}</td>
                    <td className="px-4 py-2">{driver.experience} years</td>
                    <td className="px-4 py-2">{driver.vehicleType}</td>
                    <td className="px-4 py-2">{driver.location.coordinates[0]}, {driver.location.coordinates[1]}</td>
                    <td className="px-4 py-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => toggleDriverStatus(driver._id, driver.userId.role)}
                      >
                        {driver.userId.role === "Driver" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-cyan-600 pt-4 mt-6">
            <h3 className="text-xl font-semibold text-cyan-600 mb-4">Vehicles</h3>
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Vehicle Number</th>
                  <th className="px-4 py-2 text-left">Model</th>
                  <th className="px-4 py-2 text-left">Brand</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="bg-gray-900">
                    <td className="px-4 py-2">{vehicle.vehicleNumber}</td>
                    <td className="px-4 py-2">{vehicle.model}</td>
                    <td className="px-4 py-2">{vehicle.brand}</td>
                    <td className="px-4 py-2">{vehicle.type}</td>
                    <td className="px-4 py-2">{vehicle.status}</td>
                    <td className="px-4 py-2">
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded"
                        onClick={() => toggleVehicleStatus(vehicle._id, vehicle.status)}
                      >
                        {vehicle.status === "Pending" ? "Approve" : "Set to Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
