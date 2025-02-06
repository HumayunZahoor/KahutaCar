import React, { useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from '../store/slices/auth';
import { toast } from 'react-toastify';

axios.defaults.withCredentials = true;

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const { role, isLogin, name } = auth;

    const handleLogout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/logout`);
            if (response.data === 'Logged out successfully') {
                dispatch(setAuthData({ isLogin: false, role: '', name: '', email: '', id: '' }));
                toast.success(response.data, { type: 'success' });
                navigate('/');
            }
        } catch (error) {
            console.error("Error logging out", error);
            toast.error("Error logging out. Please try again.");
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/getUser`);
                const data = response.data.user;
                dispatch(setAuthData({ isLogin: true, _id: data._id, role: data.role, name: data.name, email: data.email }));
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between bg-cyan-600 text-white px-4 py-3 shadow-md">
            <div className="flex items-center w-full md:w-auto">
                <img
                    src="/cargo.png"
                    alt="KahutaCargo Logo"
                    className="h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-cyan-800"
                />
                <h2 className="text-xl md:text-2xl font-bold ml-3 text-black hidden md:block">
                    KahutaCarGo
                </h2>
                <button
                    className="md:hidden ml-auto px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

            <div className="flex flex-col items-center md:items-center md:flex-row md:space-x-6 w-full md:w-auto mt-3 md:mt-0">
                <p className="text-white font-medium text-lg">
                    Hello, <span className="text-black font-semibold capitalize">{name}</span>
                </p>
                <button
                    className="hidden md:inline-block px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-800"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
