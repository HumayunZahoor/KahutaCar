import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AllotVehicleToDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState({});

  useEffect(() => {
    const fetchDriversAndVehicles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/get-drivers-and-vehicles`);
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

  const handleVehicleChange = (driverId, vehicleId) => {
    setSelectedVehicle({ ...selectedVehicle, [driverId]: vehicleId });
  };

  const allotVehicleToDriver = async (driverId) => {
    const vehicleId = selectedVehicle[driverId];
    if (!vehicleId) {
      alert("Please select a vehicle for this driver");
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/allot-vehicle-to-driver`, {
        driverId,
        vehicleId
      });

      const { driver, vehicle } = response.data;

      setDrivers((prevDrivers) =>
        prevDrivers.map((d) => (d._id === driverId ? { ...d, alotedVehicle: vehicleId } : d))
      );

      setVehicles((prevVehicles) =>
        prevVehicles.map((v) =>
          v._id === vehicleId ? { ...v, status: "alloted" } : v
        )
      );

    //   alert(`Vehicle ${vehicleId} has been successfully allotted to Driver ${driverId}`);
      toast.success(`Vehicle ${vehicleId} has been successfully allotted to Driver ${driverId}`, { type: 'success' });
    } catch (error) {
      console.error("Error allotting vehicle to driver", error);
      toast.error(error.response.data.message, { type: 'error' });
    }
  };

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        Allot Vehicle to Driver
      </h2>
      <p className="mt-2 text-gray-400">Manage vehicle allotment to drivers.</p>

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
                  <th className="px-4 py-2 text-left">Allot Vehicle</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {drivers
                .filter((driver) => driver.userId.role === "Driver")
                .map((driver) => (
                  <tr key={driver._id} className="bg-gray-900">
                    <td className="px-4 py-2">{driver.name}</td>
                    <td className="px-4 py-2">{driver.contactNumber}</td>
                    <td className="px-4 py-2">{driver.experience} years</td>
                    <td className="px-4 py-2">{driver.vehicleType}</td>
                    <td className="px-4 py-2">
                      <select
                        className="px-4 py-2 bg-gray-800 text-white rounded"
                        value={selectedVehicle[driver._id] || ""}
                        onChange={(e) => handleVehicleChange(driver._id, e.target.value)}
                      >
                        <option value="">Select Vehicle</option>
                        {vehicles
                        .filter((vehicle) => vehicle.alloted === false)
                        .map((vehicle) => (
                          <option key={vehicle._id} value={vehicle._id}>
                            {vehicle.vehicleNumber} - {vehicle.model}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => allotVehicleToDriver(driver._id)}
                      >
                        Allot Vehicle
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

export default AllotVehicleToDriver;
