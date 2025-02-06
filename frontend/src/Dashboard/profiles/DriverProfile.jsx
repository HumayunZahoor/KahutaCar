import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaIdCard, FaCar, FaPhoneAlt, FaCalendarAlt, FaUserTie } from "react-icons/fa";
import { MdAttachMoney, MdOutlinePayments } from "react-icons/md";
import { AiOutlineFieldNumber } from "react-icons/ai";
import { GiPathDistance } from "react-icons/gi";

const DriverProfile = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth; 

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/driver/get-driver?userId=${userId}`);
        setDrivers(response.data);
      } catch (err) {
        setError("Failed to fetch driver details.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDrivers();
    }

    // const updateLocation = async (latitude, longitude) => {
    //   try {
    //     await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/driver/update-location`, {
    //       userId,
    //       latitude,
    //       longitude,
    //     });
    //   } catch (error) {
    //     console.error("Error updating location:", error);
    //   }
    // };

    // if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition((position) => {
    //     const lat = position.coords.latitude;
    //     const lon = position.coords.longitude;
    //     updateLocation(lat, lon); 
    //   }, (error) => {
    //     console.error("Error occurred while tracking location:", error);
    //   }, {
    //     enableHighAccuracy: true,
    //     maximumAge: 0,
    //     timeout: 5000
    //   });
    // }

  }, [userId]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-950 shadow-md rounded-md min-h-screen">
      <h1 className="text-3xl font-bold text-white border-b border-cyan-600 pb-3">
        Driver Profile
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-5">{error}</p>
      ) : drivers.length === 0 ? (
        <p className="text-gray-400 text-center mt-5">No drivers registered.</p>
      ) : (
        drivers.map((driver) => (
          <div key={driver._id} className="border border-gray-800 bg-gray-900 p-5 my-5 shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold text-cyan-600 flex items-center gap-2">
              <FaUserTie className="text-cyan-600" /> {driver.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-gray-300">
              <p className="flex items-center gap-2"><FaIdCard className="text-cyan-600" /> <strong>CNIC:</strong> {driver.cnic}</p>
              <p className="flex items-center gap-2"><AiOutlineFieldNumber className="text-cyan-600" /> <strong>License:</strong> {driver.licenseNumber}</p>
              <p className="flex items-center gap-2"><FaPhoneAlt className="text-cyan-600" /> <strong>Contact:</strong> {driver.contactNumber}</p>
              <p className="flex items-center gap-2"><GiPathDistance className="text-cyan-600" /> <strong>Experience:</strong> {driver.experience} years</p>
              <p className="flex items-center gap-2"><FaCar className="text-cyan-600" /> <strong>Vehicle Type:</strong> {driver.vehicleType}</p>
              <p className="flex items-center gap-2"><MdOutlinePayments className="text-cyan-600" /> <strong>Payment:</strong> {driver.paymentType}</p>
              <p className="flex items-center gap-2"><MdAttachMoney className="text-cyan-600" /> <strong>Requested Amount:</strong> Rs. {driver.requestedAmount}</p>
              <p className="flex items-center gap-2"><MdAttachMoney className="text-cyan-600" /> <strong>Balance:</strong> Rs. {driver.balance}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-600" /> <strong>Registered On:</strong> {new Date(driver.registrationDate).toLocaleDateString()}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-cyan-600" /> <strong>Updated On:</strong> {new Date(driver.updatedAt).toLocaleDateString()}</p>

              {driver.alotedVehicle && (
                <p className="flex items-center gap-2"><FaCar className="text-cyan-600" /> <strong>Assigned Vehicle:</strong> {driver.alotedVehicle.name} ({driver.alotedVehicle.model})</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default DriverProfile;
