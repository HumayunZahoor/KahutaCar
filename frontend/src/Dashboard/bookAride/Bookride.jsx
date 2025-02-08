import React, { useState, useEffect } from "react";
import { FaRoad, FaMapMarkerAlt, FaCar, FaDollarSign } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import getLocationName from "./getLocationName"; // Import the reverse geocoding function

const Bookride = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth;

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [location, setLocation] = useState(null);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  const [startLocationName, setStartLocationName] = useState(""); // Store the start location name
  const [driverLocations, setDriverLocations] = useState({}); // Store driver locations

  const getLocation = async () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });

          // Fetch the user's location name
          getLocationName(lat, lon, (locationName) => {
            setStartLocationName(locationName);
          });

          await getDriversAndVehicles(lat, lon);
        },
        (error) => {
          console.error("Error occurred while getting location:", error);
          toast.error("Failed to get location.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }

    setLoading(false);
  };

  const getDriversAndVehicles = async (lat, lon) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/admin/get-drivers-and-vehicles`
      );
      const allDrivers = response.data.drivers;
      const allVehicles = response.data.vehicles;

      const filtered = allDrivers.filter((driver) => {
        const driverLat = driver.location.coordinates[1];
        const driverLon = driver.location.coordinates[0];

        const distance = getDistance(lat, lon, driverLat, driverLon);
        const isWithinRange = distance <= 4; // 4 km range

        const vehicleTypeMatch = selectedVehicleType
          ? driver.vehicleType === selectedVehicleType
          : true;

        return isWithinRange && vehicleTypeMatch;
      });

      setDrivers(filtered);
      setVehicles(allVehicles);
      setFilteredDrivers(filtered);

      // Fetch and store driver location names
      filtered.forEach((driver) => {
        const driverLat = driver.location.coordinates[1];
        const driverLon = driver.location.coordinates[0];

        getLocationName(driverLat, driverLon, (locationName) => {
          setDriverLocations((prev) => ({
            ...prev,
            [driver._id]: locationName,
          }));
        });
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to fetch drivers and vehicles.");
    }
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleBookRide = async (driverId) => {
    if (!location) {
      toast.error("Please refresh location.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/ride/book-ride`,
        {
          customerId: userId,
          driverId,
          startLocation: {
            type: "Point",
            coordinates: [location.lon, location.lat],
          },
          endLocation: {
            type: "Point",
            coordinates: [0, 0], 
          },
          status: "Pending",
        }
      );
      toast.success("Ride booked successfully.");
    } catch (error) {
      console.error("Error booking ride:", error);
      toast.error("Failed to book ride.");
    }
  };

  useEffect(() => {
    getLocation();
  }, [selectedVehicleType]);

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        <FaRoad className="text-cyan-600" /> Book A Ride
      </h2>
      <p className="mt-2 text-gray-400">Book rides, track your journey, and manage payments.</p>

      <div className="mt-6">
        <button
          onClick={getLocation}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Fetching Location..." : "Refresh Location"}
        </button>

        {location && (
          <div className="mt-4">
            <p className="text-gray-300">
              <FaMapMarkerAlt className="inline mr-2" />
              Location: Latitude: {location.lat}, Longitude: {location.lon}
            </p>
            {startLocationName && (
              <p className="text-gray-300">
                <strong>Start Location: </strong> {startLocationName}
              </p>
            )}
          </div>
        )}

        <div className="mt-6">
          <select
            value={selectedVehicleType}
            onChange={(e) => setSelectedVehicleType(e.target.value)}
            className="p-2 border border-cyan-600 rounded text-gray-950"
          >
            <option value="">Select Vehicle Type</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
            <option value="Bus">Bus</option>
          </select>
        </div>

        <div className="mt-8">
          {filteredDrivers.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold text-cyan-600 mb-4">Available Drivers</h3>
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Vehicle Type</th>
                    <th className="px-4 py-2 text-left">Location</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver) => (
                    <tr key={driver._id} className="bg-gray-900">
                      <td className="px-4 py-2">{driver.name}</td>
                      <td className="px-4 py-2">{driver.vehicleType}</td>
                      <td className="px-4 py-2">{driverLocations[driver._id] || "Fetching..."}</td>
                      <td className="px-4 py-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded"
                          onClick={() => handleBookRide(driver._id)}
                        >
                          Book Ride
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400">No drivers available in your range.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookride;
