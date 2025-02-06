import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const MyRentRequests = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth;
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId) {
        // toast.error("User ID is missing!");
        return;
      }
      
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/ride/rent-requests/${userId}`
        );
        setRequests(response.data);
        console.log(response.data);
      } catch (error) {
        // toast.error("Failed to load rent requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold">My Rent Requests</h1>
      <h2 className="text-lg text-cyan-600 mt-2">View all your rental requests</h2>

      {loading ? (
        <p className="text-gray-300 mt-4">Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-300 mt-4">No rent requests found.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="p-4 bg-gray-800 rounded-lg shadow-md space-y-2 text-lg">
              <p className="text-lg font-semibold text-cyan-400">
                {request.requested_vehicle} - {request.package || `${request.days} Days`}
              </p>
              <p className="text-sm text-gray-300">Total Price: Rs. {request.totalPrice}</p>
              <p className="text-sm text-gray-300">Status: 
                <span 
                  className={`ml-2 px-2 py-1 rounded ${
                    request.status === "Pending" ? "bg-yellow-500" :
                    request.status === "Approved" ? "bg-green-500" :
                    request.status === "Rejected" ? "bg-red-500" :
                    "bg-blue-500"
                  } text-white text-xs`}
                >
                  {request.status}
                </span>
              </p>
              <p className="text-sm text-gray-400">Requested on: {new Date(request.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentRequests;
