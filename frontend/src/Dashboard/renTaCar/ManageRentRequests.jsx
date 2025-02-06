import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ManageRentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequestsAndVehicles = async () => {
      try {
        const [requestsRes, vehiclesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/get-rent-requests`),
          axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/get-drivers-and-vehicles`)
        ]);

        setRequests(requestsRes.data);
        setVehicles(vehiclesRes.data.vehicles.filter((v) => v.alloted === false));
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequestsAndVehicles();
  }, []);

  const handleVehicleChange = (requestId, vehicleId) => {
    setSelectedVehicle({ ...selectedVehicle, [requestId]: vehicleId });
  };

  const updateRequestStatus = async (requestId, status) => {
    const vehicleId = selectedVehicle[requestId] || null;
    
    if (status === "Accepted" && !vehicleId) {
      toast.error("Please select a vehicle.");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_BACKEND_URL}/admin/update-rent-request/${requestId}`,
        { vehicleId, status }
      );

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, status, vehicleId } : req
        )
      );

      if (status === "Accepted") {
        setVehicles((prevVehicles) => prevVehicles.filter((v) => v._id !== vehicleId));
      }

      toast.success(`Request updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update request.");
    }
  };

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        Manage Rent Requests
      </h2>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-5">{error}</p>
      ) : (
        <div className="mt-8">
          <table className="min-w-full table-auto border border-gray-700">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Vehicle Requested</th>
                <th className="px-4 py-2 text-left">Package</th>
                <th className="px-4 py-2 text-left">Total Price</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Assign Vehicle</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="bg-gray-900 border-b border-gray-700">
                  <td className="px-4 py-2">{request.customerId?.name || "N/A"}</td>
                  <td className="px-4 py-2">{request.requested_vehicle}</td>
                  <td className="px-4 py-2">{request.package || `${request.days} Days`}</td>
                  <td className="px-4 py-2">${request.totalPrice}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        request.status === "Pending"
                          ? "bg-yellow-500"
                          : request.status === "Accepted"
                          ? "bg-green-500"
                          : request.status === "Rejected"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      } text-white text-xs`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {request.status === "Pending" && (
                      <select
                        className="px-4 py-2 bg-gray-800 text-white rounded"
                        value={selectedVehicle[request._id] || ""}
                        onChange={(e) => handleVehicleChange(request._id, e.target.value)}
                      >
                        <option value="">Select Vehicle</option>
                        {vehicles.map((vehicle) => (
                          <option key={vehicle._id} value={vehicle._id}>
                            {vehicle.vehicleNumber} - {vehicle.model}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {request.status === "Pending" && (
                      <>
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                          onClick={() => updateRequestStatus(request._id, "Accepted")}
                        >
                          Accept
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() => updateRequestStatus(request._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === "Accepted" && (
                      <button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => updateRequestStatus(request._id, "Completed")}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageRentRequests;
