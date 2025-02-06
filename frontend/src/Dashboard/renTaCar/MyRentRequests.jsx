import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const MyRentRequests = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth;
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/ride/rent-requests/${userId}`
        );
        setRequests(response.data);
      } catch (error) {
        toast.error("Failed to load rent requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const handlePayment = async (rentRequestId, totalPrice) => {
    try {
      const stripe = await stripePromise;
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/ride/pay-rent`,
        { rentRequestId, totalPrice, userId }
      );

      const { sessionId } = response.data;

      if (!sessionId) throw new Error("Failed to create a checkout session.");

      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) toast.error("Failed to redirect to payment.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed.");
    }
  };

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
              {request.paid === false && (
                <button
                  onClick={() => handlePayment(request._id, request.totalPrice)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded"
                >
                  Pay Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRentRequests;
