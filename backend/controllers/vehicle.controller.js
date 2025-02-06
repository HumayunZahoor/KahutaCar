import Vehicle from '../models/vehicle.model.js';


export const registerVehicle = async (req, res) => {
  try {
    const { userId, vehicleNumber, name, type, model, brand, color, paymentType, requestedAmount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle already registered" });
    }

    const vehicle = new Vehicle({
      userId,
      vehicleNumber,
      name,
      type,
      model,
      brand,
      color,
      paymentType,
      requestedAmount,
    });

    await vehicle.save();
    res.status(201).json({ message: "Vehicle registered successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//----------------------------------------------------------------
export const getUserVehicles = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const vehicles = await Vehicle.find({ userId });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
