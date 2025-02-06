import Admin from '../models/admin.model.js';
import Driver from '../models/driver.model.js';
import Vehicle from '../models/vehicle.model.js';
import User from '../models/users.model.js';
import RentRequest from '../models/rentReq.model.js';
import Ride from '../models/ride.model.js';

export const saveAdminDetails = async (req, res) => {
    try {
        const { id, name, role, email } = req.body;
        // console.log(id, name, role, email);

        let admin = await Admin.findOne({ id });

        if (admin) {
            return res.status(200).json({ message: 'Admin details already exist' });
        }

        admin = new Admin({ userId: id, name, role, email });
        await admin.save();

        res.status(201).json({ message: 'Admin details saved successfully', admin });
    } catch (error) {
        res.status(500).json({ message: 'Error saving admin details', error });
    }
};

//---------------------------------------------------

export const getDriversAndVehicles = async (req, res) => {
    try {
        const drivers = await Driver.find().populate({
            path: "userId",
            select: "role" 
        }).exec();

        const vehicles = await Vehicle.find().populate({
            path: "userId",
            select: "role" 
        }).exec();

        res.status(200).json({
            drivers,
            vehicles
        });
    } catch (error) {
        console.error("Error fetching drivers and vehicles:", error);
        res.status(500).json({ message: "Failed to fetch drivers and vehicles" });
    }
};


//--------------------------------------------


export const toggleDriverStatus = async (req, res) => {
    const { id } = req.body;

    try {
        const driver = await Driver.findById(id);
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }

        if (!driver.userId) {
            return res.status(404).json({ message: "Driver user ID not found" });
        }

        const user = await User.findById(driver.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "Driver") {
            user.role = "Customer"; 
        } else {
            user.role = "Driver"; 
        }

        await user.save();

        res.status(200).json({ message: `Driver role updated to ${user.role}`, role: user.role });
    } catch (error) {
        console.error("Error toggling driver status:", error);
        res.status(500).json({ message: "Server error, failed to toggle driver status" });
    }
};

// --------------------------------------------
export const toggleVehicleStatus = async (req, res) => {
    const { id } = req.body;

    try {
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        if (vehicle.status === "Approved") {
            vehicle.status = "Pending";
            await vehicle.save();
            return res.status(200).json({ message: "Vehicle status set to Pending", status: "Pending" });
        } else {
            vehicle.status = "Approved";
            await vehicle.save();
            return res.status(200).json({ message: "Vehicle approved", status: "Approved" });
        }
    } catch (error) {
        console.error("Error toggling vehicle status:", error);
        res.status(500).json({ message: "Server error, failed to toggle vehicle status" });
    }
};


// --------------------------------------------

export const allotVehicleToDriver = async (req, res) => {
    const { driverId, vehicleId } = req.body;
  
    try {
      const driver = await Driver.findById(driverId);
      if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
      }
  
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
  
      if (driver.alotedVehicle) {
        const previousVehicle = await Vehicle.findById(driver.alotedVehicle);
        if (previousVehicle) {
          previousVehicle.alloted = false;
          await previousVehicle.save();
        }
      }
  
      driver.alotedVehicle = vehicleId;
      await driver.save();
  
      vehicle.alloted = true;
      await vehicle.save();
  
      res.status(200).json({
        driver,
        vehicle
      });
    } catch (error) {
      console.error("Error allotting vehicle to driver:", error);
      res.status(500).json({ message: "Server error, failed to allot vehicle to driver" });
    }
  };
  
  // --------------------------------------------


export const updateRentRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { vehicleId, status } = req.body;

    if (!requestId || !status) {
      return res.status(400).json({ message: "Request ID and status are required." });
    }

    let updateFields = { status };

    if (status === "Accepted") {
      if (!vehicleId) {
        return res.status(400).json({ message: "Vehicle ID is required to accept the request." });
      }

      updateFields.vehicleId = vehicleId;

      // Update vehicle's allotted status to true
      await Vehicle.findByIdAndUpdate(vehicleId, { alloted: true });
    }

    if (status === "Completed") {
      updateFields.endDate = Date.now();

      // Find the assigned vehicle and update its allotted status to false
      const rentRequest = await RentRequest.findById(requestId);
      if (rentRequest?.vehicleId) {
        await Vehicle.findByIdAndUpdate(rentRequest.vehicleId, { alloted: false });
      }
    }

    const updatedRequest = await RentRequest.findByIdAndUpdate(
      requestId,
      updateFields,
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Rent request not found." });
    }

    res.status(200).json({ message: "Rent request updated successfully.", updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


  
  // --------------------------------------------

  export const getAllRentRequests = async (req, res) => {
    try {
      const rentRequests = await RentRequest.find()
        .populate("customerId", "name email")  
        .populate("vehicleId", "vehicleNumber model") 
        .sort({ createdAt: -1 });
  
      res.status(200).json(rentRequests);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  