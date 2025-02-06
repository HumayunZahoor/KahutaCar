import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const RentACar = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId } = auth;

  const packages = [
    { name: "Daily", pricePerDay: 20 },
    { name: "Weekly", pricePerDay: 120 },
    { name: "Ten Days", pricePerDay: 180 },
    { name: "Fortnightly", pricePerDay: 350 },
    { name: "Monthly", pricePerDay: 600 },
  ];

  const vehicleTypes = ["Car", "Bike", "Truck", "Bus", "Other"];

  const [selectedPackage, setSelectedPackage] = useState("");
  const [days, setDays] = useState("");
  const [requestedVehicle, setRequestedVehicle] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const calculateTotalPrice = (pkg, customDays) => {
    if (pkg) {
      const packageData = packages.find((p) => p.name === pkg);
      setTotalPrice(packageData ? packageData.pricePerDay : 0);
    } else if (customDays) {
      setTotalPrice(customDays * 20); // Assume $20 per day if no package is selected
    } else {
      setTotalPrice(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!requestedVehicle) {
      toast.error("Please select a vehicle type.");
      return;
    }

    if (!selectedPackage && !days) {
      toast.error("Please select a package or enter custom days.");
      return;
    }

    const requestData = {
      customerId: userId,
      package: selectedPackage,
      requested_vehicle: requestedVehicle,
      days: days ? parseInt(days) : 0,
      totalPrice,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/ride/rent-a-car`,
        requestData
      );
      toast.success("Rent request submitted successfully!");
      setDays("");
      setSelectedPackage("");
      setRequestedVehicle("");
      setTotalPrice(0);
    } catch (error) {
      toast.error("Failed to submit request.");
    }
  };

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold">Rent Request</h1>
      <h2 className="text-xl text-cyan-600 mt-2">Request to rent a vehicle</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-gray-300">Requested Vehicle</span>
          <select
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            value={requestedVehicle}
            onChange={(e) => setRequestedVehicle(e.target.value)}
          >
            <option value="">Select Vehicle</option>
            {vehicleTypes.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-300">Package</span>
          <select
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            value={selectedPackage}
            onChange={(e) => {
              setSelectedPackage(e.target.value);
              setDays("");
              calculateTotalPrice(e.target.value, "");
            }}
          >
            <option value="">Select Package</option>
            {packages.map((pkg) => (
              <option key={pkg.name} value={pkg.name}>
                {pkg.name} - Rs. {pkg.pricePerDay}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-gray-300">Custom Days</span>
          <input
            type="number"
            className="w-full p-2 mt-1 bg-gray-800 rounded"
            value={days}
            disabled={selectedPackage !== ""}
            onChange={(e) => {
              setDays(e.target.value);
              setSelectedPackage("");
              calculateTotalPrice("", e.target.value);
            }}
          />
        </label>

        <p className="text-lg text-green-400">
          Total Price: Rs. {totalPrice}
        </p>

        <button
          type="submit"
          className="w-full p-3 mt-4 bg-cyan-600 rounded hover:bg-cyan-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RentACar;
