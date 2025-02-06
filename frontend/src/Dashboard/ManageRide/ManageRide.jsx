import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageRide = () => {
    const auth = useSelector((state) => state.auth);
    const { id: userId } = auth;

    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(""); // Track error message

    useEffect(() => {
        const fetchRides = async () => {
            try {
                setLoading(true); // Set loading to true
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/ride/get-rides?userId=${userId}`);
                setRides(response.data);
            } catch (err) {
                if (!errorMessage) { // Only show toast once
                    // toast.error("Failed to fetch rides.");
                    setErrorMessage("Failed to fetch rides."); // Prevent repeated toasts
                }
                console.error("Error fetching rides:", err);
            } finally {
                setLoading(false); // Set loading to false when the fetch is complete or failed
            }
        };

        fetchRides();
    }, [userId, errorMessage]); // Depend on errorMessage to avoid multiple toast calls

    const handleAccept = async (rideId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/ride/update-ride-status`, {
                rideId,
                status: "Accepted",
            });
            toast.success("Ride accepted.");
            setRides((prevRides) =>
                prevRides.map((ride) =>
                    ride._id === rideId ? { ...ride, driver_status: "Accepted" } : ride
                )
            );
        } catch (error) {
            toast.error("Failed to accept ride.");
            console.error("Error accepting ride:", error);
        }
    };

    const handleReject = async (rideId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/ride/update-ride-status`, {
                rideId,
                status: "Rejected",
            });
            toast.success("Ride rejected.");
            setRides((prevRides) =>
                prevRides.map((ride) =>
                    ride._id === rideId ? { ...ride, driver_status: "Rejected" } : ride
                )
            );
        } catch (error) {
            toast.error("Failed to reject ride.");
            console.error("Error rejecting ride:", error);
        }
    };

    return (
        <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
            <h2 className="text-2xl font-bold border-b border-cyan-600 pb-2 flex items-center gap-2">
                Manage Rides
            </h2>
            <p className="mt-2 text-gray-400">View and manage your ride requests.</p>

            {loading ? (
                <p className="text-gray-400 text-center mt-5">Loading rides...</p>
            ) : (
                <div className="mt-6">
                    {rides.length > 0 ? (
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Customer Name</th>
                                    <th className="px-4 py-2 text-left">Start Location</th>
                                    <th className="px-4 py-2 text-left">End Location</th>
                                    <th className="px-4 py-2 text-left">Status</th>
                                    <th className="px-4 py-2 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rides.map((ride) => (
                                    <tr key={ride._id} className="bg-gray-900">
                                        <td className="px-4 py-2">{ride.customerId.name}</td>
                                        <td className="px-4 py-2">
                                            {ride.startLocation.coordinates[0]}, {ride.startLocation.coordinates[1]}
                                        </td>
                                        <td className="px-4 py-2">
                                            {ride.endLocation.coordinates[0]}, {ride.endLocation.coordinates[1]}
                                        </td>
                                        <td className="px-4 py-2">{ride.driver_status}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                className={`px-4 py-2 ${ride.driver_status === 'Accepted' ? 'bg-gray-500' : 'bg-green-500'} text-white rounded mr-2`}
                                                onClick={() => handleAccept(ride._id)}
                                                disabled={ride.driver_status === 'Accepted'}
                                            >
                                                {ride.driver_status === 'Accepted' ? 'Accepted' : <><FaCheckCircle /> Accept</>}
                                            </button>

                                            <button
                                                className={`px-4 py-2 ${ride.driver_status === 'Rejected' ? 'bg-gray-500' : 'bg-red-500'} text-white rounded`}
                                                onClick={() => handleReject(ride._id)}
                                                disabled={ride.driver_status === 'Rejected'}
                                            >
                                                {ride.driver_status === 'Rejected' ? 'Rejected' : <><FaTimesCircle /> Reject</>}
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-400">No rides available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageRide;
