import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import DriverDashboard from "../components/dashboard/DriverDashboard";
import CustomerDashboard from "../components/dashboard/CustomerDashboard";
import axios from "axios";

const Dashboard = () => {
    // const [driverId, setDriverId] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState("");

    const auth = useSelector((state) => state.auth);
    const { role, id: userId, name, email } = auth;

    useEffect(() => {
        if (role === "Admin" && userId) {
            axios
                .post(`${import.meta.env.VITE_APP_BACKEND_URL}/admin/save-details`, {
                    userId,
                    name,
                    role,
                    email,
                })
                .then((response) => {
                    console.log("✅ Admin details saved:", response.data);
                })
                .catch((error) => {
                    console.error("❌ Error saving admin details:", error);
                });
        }
    }, [role, userId, name, email]);

    // // Fetch Driver ID correctly
    // useEffect(() => {
    //     const fetchDriver = async () => {
    //         try {
    //             const response = await axios.get(
    //                 `${import.meta.env.VITE_APP_BACKEND_URL}/driver/get-driver?userId=${userId}`
    //             );
    //             if (response.data && response.data.length > 0) {
    //                 setDriverId(response.data[0]._id);
    //                 console.log("🚗 Driver ID fetched:", response.data[0]._id);
    //             }
    //         } catch (err) {
    //             console.error("❌ Failed to fetch driver details:", err);
    //             setError("Error fetching driver details.");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     if (userId && role === "Driver") { // ✅ Corrected role check
    //         fetchDriver();
    //     }
    // }, [userId, role]);

    // if (loading) return <p className="text-gray-500">⏳ Loading dashboard...</p>;

    return (
        <div className="relative p-8 min-h-[90vh] bg-gray-950 text-white">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <h2 className="text-xl text-cyan-600 mt-2">Manage system statistics</h2>

            {/* {error && <p className="text-red-500">{error}</p>} */}

            {role === "Admin" && <AdminDashboard />}
            {role === "Driver" && <DriverDashboard />}
            {role === "Customer" && <CustomerDashboard />}

            {/* {role === "Driver" && driverId && (
                <>
                    <DriverLocationUpdater driverId={driverId} />
                    <LiveDriverTracker driverId={driverId} />
                </>
            )} */}
        </div>
    );
};

export default Dashboard;
