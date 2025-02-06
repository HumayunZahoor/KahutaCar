import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaIdCard, FaCar, FaPhoneAlt, FaCalendarAlt, FaUserTie } from "react-icons/fa";
import { MdAttachMoney, MdOutlinePayments } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GiPathDistance } from "react-icons/gi";

const Vehicle = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/vehicle/get-vehicles?userId=${userId}`);
        setVehicles(response.data);
      } catch (err) {
        setError("Failed to fetch vehicle details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchVehicles();
    }

  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-950 shadow-md rounded-md min-h-screen">
      <h1 className="text-3xl font-bold text-white border-b border-cyan-600 pb-3">
        Vehicle Details
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-5">{error}</p>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-400 text-center mt-5">No vehicles registered.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div key={vehicle._id} className="border border-gray-800 bg-gray-900 p-5 my-5 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-cyan-600 flex items-center gap-2">
              <FaCar className="text-cyan-600" /> {vehicle.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-gray-300">
              <p className="flex items-center gap-2"><FaIdCard className="text-cyan-600" /> <strong>Vehicle Number:</strong> {vehicle.vehicleNumber}</p>
              <p className="flex items-center gap-2"><AiOutlineFieldNumber className="text-cyan-600" /> <strong>Model:</strong> {vehicle.model}</p>
              <p className="flex items-center gap-2"><FaCar className="text-cyan-600" /> <strong>Type:</strong> {vehicle.type}</p>
              <p className="flex items-center gap-2"><FaUserTie className="text-cyan-600" /> <strong>Brand:</strong> {vehicle.brand}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-600" /> <strong>Registered On:</strong> {new Date(vehicle.registrationDate).toLocaleDateString()}</p>
              <p className="flex items-center gap-2"><MdAttachMoney className="text-cyan-600" /> <strong>Requested Amount:</strong> Rs. {vehicle.requestedAmount}</p>
              <p className="flex items-center gap-2"><MdOutlinePayments className="text-cyan-600" /> <strong>Payment Type:</strong> {vehicle.paymentType}</p>
              <p className="flex items-center gap-2"><strong>Status:</strong> {vehicle.isAvailable ? "Available" : "Not Available"}</p>
              <p className="flex items-center gap-2"><strong>Alloted:</strong> {vehicle.alloted ? "Yes" : "No"}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Vehicle;
