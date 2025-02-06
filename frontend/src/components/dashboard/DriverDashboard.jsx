import React , { useEffect } from "react";
import { FaRoad, FaDollarSign, FaCheckCircle, FaChartPie, FaCalendarAlt } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from "axios";
import { useSelector } from "react-redux";

const DriverDashboard = () => {

  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth; 

  useEffect(() => {

    const updateLocation = async (latitude, longitude) => {
      try {
        await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/driver/update-location`, {
          userId,
          latitude,
          longitude,
        });
      } catch (error) {
        console.error("Error updating location:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        updateLocation(lat, lon); 
      }, (error) => {
        console.error("Error occurred while tracking location:", error);
      }, {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      });
    }

  }, [userId]);

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        <FaRoad className="text-cyan-600" /> Driver Panel
      </h2>
      <p className="mt-2 text-gray-400">View assigned rides, manage schedules, and track earnings.</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaCalendarAlt /> Today's Schedule
          </h3>
          <p>Ride 1: 9:00 AM - Pickup at Main Street</p>
          <p>Ride 2: 11:30 AM - Drop-off at Airport</p>
          <p>Ride 3: 2:30 PM - Pickup at Mall</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaDollarSign /> Earnings Summary
          </h3>
          <p>Total Earnings: Rs650</p>
          <p>Rides Completed: 18</p>
          <p>Monthly Target: Rs2500</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaCheckCircle /> Completed Rides
          </h3>
          <p>Ride 1: Rs15</p>
          <p>Ride 2: Rs22</p>
          <p>Ride 3: Rs18</p>
        </div>

        <div className="p-4 bg-gray-900 rounded-lg">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-cyan-600">
            <FaChartPie /> Performance Overview
          </h3>
          <p>Customer Ratings: 4.8/5</p>
          <p>Fuel Efficiency: 90%</p>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
