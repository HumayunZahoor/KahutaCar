import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const RegisterDriver = () => {
    const auth = useSelector((state) => state.auth);
    const { id: userId, name, email } = auth; 

    const [formData, setFormData] = useState({
        name: "",
        cnic: "",
        licenseNumber: "",
        contactNumber: "",
        experience: "",
        vehicleType: "Car",
        paymentType: "Daily",
        requestedAmount: "",
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/driver/register-driver`, { ...formData, userId });
            toast.success(response.data.message, { type: 'success' });
            setFormData({
                name: "",
                cnic: "",
                licenseNumber: "",
                contactNumber: "",
                experience: "",
                vehicleType: "Car",
                paymentType: "Daily",
                requestedAmount: "",
            })
        } catch (error) {
            toast.error(error.response?.data?.message || "Error registering driver", { type: 'error' });
        }
    };

    return (
        <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
            <h1 className="text-2xl font-bold">Driver Registration</h1>
            <h2 className="text-xl text-cyan-600 mt-2">Register your driver with us</h2>

            <form className="mt-6 space-y-4 text-black flex flex-col items-center justify-center" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Driver Name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required />
                <input type="text" name="cnic" placeholder="CNIC Number" value={formData.cnic} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required />
                <input type="text" name="licenseNumber" placeholder="License Number" value={formData.licenseNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required />
                <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required />
                <input type="number" name="experience" placeholder="Experience (Years)" value={formData.experience} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required />
                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Truck">Truck</option>
                    <option value="Bus">Bus</option>
                    <option value="Other">Other</option>
                </select>
                <select name="paymentType" value={formData.paymentType} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                </select>
                <input type="number" name="requestedAmount" placeholder="Requested Amount" value={formData.requestedAmount} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded bg-cyan-600" required />
                <button type="submit" className="w-auto px-4 bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition">Register Driver</button>
            </form>
        </div>
    );
};

export default RegisterDriver;
