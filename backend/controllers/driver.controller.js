import Driver from "../models/driver.model.js";
import User from "../models/users.model.js";
import Vehicle from "../models/vehicle.model.js";
import mongoose from "mongoose";

export const registerDriver = async (req, res) => {
  try {
    const { userId, name, cnic, licenseNumber, contactNumber, experience, vehicleType, paymentType, requestedAmount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingDriver = await Driver.findOne({ $or: [{ licenseNumber }, { cnic } , { userId }] });
    if (existingDriver) {
      return res.status(400).json({ message: "Driver with this CNIC or License Number or User ID already registered" });
    }

    const user_Id = await User.findOne({ _id: userId });
    if (!user_Id) {
      return res.status(400).json({ message: "User not found" });
    } 

    const driver = new Driver({
      userId,
      name,
      cnic,
      licenseNumber,
      contactNumber,
      experience,
      vehicleType,
      paymentType,
      requestedAmount,
      alotedVehicle: null,
      isAvailable: true,
      balance: 0,
      location: { type: "Point", coordinates: [0, 0] },
    });

    await driver.save();
    res.status(201).json({ message: "Driver registered successfully", driver });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//------------------------------------------------
export const getUserDrivers = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const drivers = await Driver.find({ userId })
      .populate({
        path: 'alotedVehicle', 
        select: 'vehicleNumber name model brand' 
      });

    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



//------------------------------------------------

export const updateDriverLocation = async (req, res) => {
  const { userId, latitude, longitude } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Find and update the driver's location directly
    const driver = await Driver.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId) }, // Correct usage with 'new'
      { $set: { "location.coordinates": [longitude, latitude] } },
      { new: true, upsert: false } // `new: true` ensures the returned document is the updated one
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver location updated successfully", driver });
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Server error, failed to update location" });
  }
};






