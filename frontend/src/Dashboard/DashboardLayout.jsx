import React, { useState, useEffect } from 'react';
import { 
    FaAngleLeft, 
    FaAngleRight, 
} from 'react-icons/fa';
import { RiDashboardFill } from "react-icons/ri";
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function DashboardLayout() {
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);
    const { role } = auth;

    useEffect(() => {
        const verifyLogin = async () => {
            try {
                await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/verifyLogin`);
            } catch (error) {
                navigate('/');
            }
        };
        verifyLogin();
    }, [navigate]);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const adminLinks = [
        { href: '/KahutaCarGo/Dashboard', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Dashboard' },
        { href: '/KahutaCarGo/management', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Management' },
        { href: '/KahutaCarGo/allot-vehicle-to-driver', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Allot Vehicle' },
        { href: '/KahutaCarGo/get-feedbacks', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Feedback' },
        { href: '/KahutaCarGo/get-completed-rides', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Completed Rides' },
        { href: '/KahutaCarGo/manage-rent-requests', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Manage Rent Requests' },
    ];

    const driverLinks = [
        { href: '/KahutaCarGo/Dashboard', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Dashboard' },
        { href: '/KahutaCarGo/driver-profile', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Profile' },
        { href: '/KahutaCarGo/location', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Location' },
        { href: '/KahutaCarGo/register-vehicle', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Register Vehicle' },
        { href: '/KahutaCarGo/vehicle', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Vehicle' },
        { href: '/KahutaCarGo/manage-ride', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Manage Ride' },
    ];

    const userLinks = [
        { href: '/KahutaCarGo/Dashboard', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Dashboard' },
        { href: '/KahutaCarGo/register-vehicle', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Register Vehicle' },
        { href: '/KahutaCarGo/register-driver', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Register Driver' },
        { href: '/KahutaCarGo/vehicle', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Vehicle' },
        { href: '/KahutaCarGo/book-ride', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Book Ride' },
        { href: '/KahutaCarGo/get-my-ride', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'My Ride' },
        { href: '/KahutaCarGo/feedback', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Feedback' },
        { href: '/KahutaCarGo/rent-a-car', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'Rent a Car' },
        { href: '/KahutaCarGo/my-rent-requests', icon: <RiDashboardFill size="18" className="text-cyan-500" />, label: 'My Rent Requests' },
    ];

    const sidebarLinks = () => {
        switch (role) {
            case 'Admin':
                return adminLinks;
            case 'Driver':
                return driverLinks;
            case 'Customer':
                return userLinks;
            default:
                return [];
        }
    };

    return (
        <div className="relative flex flex-col">
            <Navbar />
            <div className="w-full flex">
                <div 
                    className={`${isSidebarVisible ? 'w-1/6' : 'w-auto'} p-5 min-h-[90vh] text-cyan-600 flex flex-col space-y-6 relative transition-all duration-300`}
                >
                    <button
                        className="absolute top-2 right-1 bg-white rounded-full shadow p-1 hover:bg-gray-200 transition"
                        onClick={toggleSidebar}
                    >
                        {isSidebarVisible ? (
                            <FaAngleLeft size="25" className="text-cyan-600 text-base" />
                        ) : (
                            <FaAngleRight size="25" className="text-cyan-600 text-base" />
                        )}
                    </button>

                    {isSidebarVisible && (
                        <div className="space-y-4">
                            {sidebarLinks().map((link) => (
                                <a 
                                    key={link.href} 
                                    href={link.href} 
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-white hover:text-cyan-600 transition"
                                >
                                    {link.icon}
                                    <span className="text-sm font-medium">{link.label}</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="min-h-[90vh] w-full bg-gray-100 p-5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
