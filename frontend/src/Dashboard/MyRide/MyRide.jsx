import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

// Load Stripe with your public key
// const stripePromise = loadStripe('pk_test_51PrAEqKzHh91dh6pmnjWOwenujoLxq8wPkJ8guDBw93dCHNtm2KO3rrVOt0gGlkOoxfzLNjjnHixrt4Z0f4xWujy00vfSDjdRd');
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const MyRide = () => {
  const auth = useSelector((state) => state.auth);
  const { id: customerId } = auth;

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_BACKEND_URL}/ride/get-my-ride?customerId=${customerId}`
        );
        setRides(response.data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [customerId]);

  const getLocation = async () => {
    setLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });
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

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const handleComplete = async (rideId) => {
    if (!location) {
      toast.error("Please refresh location.");
      return;
    }

    try {
      const ride = rides.find((ride) => ride._id === rideId);
      const startLat = ride.startLocation.coordinates[1];
      const startLon = ride.startLocation.coordinates[0];
      const endLat = location.lat;
      const endLon = location.lon;

      const distance = getDistance(startLat, startLon, endLat, endLon);
      const calculatedAmount = Math.max(distance * 100, 20);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/ride/update-ride-statusby-customer`,
        {
          rideId,
          status: "Completed",
          amount: calculatedAmount,
          endLocation: {
            type: "Point",
            coordinates: [endLon, endLat],
          },
        }
      );

      if (calculatedAmount > 0) {
        const stripe = await stripePromise;
        const { sessionId } = response.data; // Get sessionId from backend
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          toast.error("Failed to redirect to payment.");
        }
      } else {
        toast.success("Ride marked as completed, no payment required.");
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride._id === rideId ? { ...ride, status: "Completed", amount: calculatedAmount } : ride
          )
        );
      }
    } catch (error) {
      toast.error("Failed to mark ride as completed.");
      console.error("Error completing ride:", error);
    }
  };

  const handleCancel = async (rideId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/ride/update-ride-statusby-customer`,
        {
          rideId,
          status: "Cancelled",
        }
      );
      toast.success("Ride marked as cancelled.");
      setRides((prevRides) =>
        prevRides.map((ride) =>
          ride._id === rideId ? { ...ride, status: "Cancelled" } : ride
        )
      );
    } catch (error) {
      toast.error("Failed to mark ride as cancelled.");
      console.error("Error cancelling ride:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
        My Ride
      </h2>
      <p className="mt-2 text-gray-400">View and manage your ongoing and pending rides.</p>

      <div className="mt-4">
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
          </div>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading rides...</p>
      ) : (
        <div className="mt-6">
          {rides.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Driver Name</th>
                  <th className="px-4 py-2 text-left">Start Location</th>
                  <th className="px-4 py-2 text-left">End Location</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {rides
                  .filter((ride) => ride.status === "Pending" ) // Only show pending rides
                  .map((ride) => (
                    <tr key={ride._id} className="bg-gray-900">
                      <td className="px-4 py-2">{ride.driverId.name}</td>
                      <td className="px-4 py-2">
                        {ride.startLocation.coordinates[0]}, {ride.startLocation.coordinates[1]}
                      </td>
                      <td className="px-4 py-2">
                        {ride.endLocation.coordinates[0]}, {ride.endLocation.coordinates[1]}
                      </td>
                      <td className="px-4 py-2">{ride.status}</td>
                      <td className="px-4 py-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                          onClick={() => handleComplete(ride._id)}
                        >
                          <FaCheckCircle /> Mark as Completed
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() => handleCancel(ride._id)}
                        >
                          <FaTimesCircle /> Mark as Cancelled
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-400">No pending rides available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRide;
