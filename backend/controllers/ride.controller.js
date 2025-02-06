import Ride from "../models/ride.model.js";
import User from "../models/users.model.js";
import Driver from "../models/driver.model.js";
import Admin from "../models/admin.model.js";
import RentRequest from "../models/rentReq.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const bookRide = async (req, res) => {
  const { customerId, driverId, startLocation, endLocation, status } = req.body;

  try {
    const customer = await User.findById(customerId);
    const driver = await Driver.findById(driverId).populate("userId");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }
    if (!driver) {
      return res.status(404).json({ message: "Driver not found." });
    }

    const ride = new Ride({
      customerId,
      driverId,
      startLocation,
      endLocation,
      status: status || "Pending",
    });

    await ride.save();
    return res.status(201).json({ message: "Ride booked successfully wait for driver approval", ride });
  } catch (error) {
    console.error("Error booking ride:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};


//------------------------------------------------

export const getRidesByDriver = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const driver = await Driver.findOne({ userId });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const rides = await Ride.find({ driverId: driver._id })
      .populate('customerId', 'name') 
      .exec();

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
};

//------------------------------------------------

export const updateRideStatus = async (req, res) => {
  try {
    const { rideId, status } = req.body;

    if (!rideId || !status) {
      return res.status(400).json({ message: "Ride ID and status are required" });
    }

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.driver_status = status;
    await ride.save();

    res.status(200).json({ message: `Ride ${status} successfully`, driver_status: status });
  } catch (error) {
    console.error("Error updating ride status:", error);
    res.status(500).json({ message: "Failed to update ride status" });
  }
};


//------------------------------------------------


export const getMyRides = async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const rides = await Ride.find({ customerId }).populate('driverId', 'name'); 
    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ message: "Failed to fetch rides" });
  }
};

// ------------------------------------------------

// const stripe = new Stripe('sk_test_51PrAEqKzHh91dh6pWPuz8kVAlRuAQRrQUP03KsYktxHtBC60L2NjjFgduMtZo2SKwNCX5dDPdrWxjX7d5OwZO6M400yk1AlAXi');


export const updateRideStatusbyCustomer = async (req, res) => {
  try {
    const { rideId, status, amount, endLocation } = req.body;
    // console.log(amount);

    if (!["Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    
    ride.status = status;
    ride.endLocation = endLocation;
    ride.fare = amount;
    const updatedRide = await ride.save();

    if (updatedRide.status === "Completed") {
      const admin = await Admin.findOne();
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // Increment admin's balance
      admin.balance += amount;
      await admin.save();

      // Create Stripe session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Ride payment: ${rideId}`, // You can use a dummy name here like "Ride Payment"
                description: `Payment for ride ID: ${rideId}`, // Dummy description
              },
              unit_amount: amount * 100, // Stripe expects amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/KahutaCarGo/Success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/KahutaCarGo/Cancel`,
        metadata: {
          rideId: ride._id.toString(), // Passing ride ID to metadata
          rideName: "Ride Payment", // Dummy name
          description: "Payment for completed ride", // Dummy description
          userName: "Dummy User", // Replace with actual user data if available
          userEmail: "dummyuser@example.com", // Replace with actual user data if available
        },
      });

      return res.status(200).json({ sessionId: session.id, ride });
    }

    res.status(200).json(updatedRide);
  } catch (error) {
    console.error("Error updating ride status:", error);
    res.status(500).json({ message: "Failed to update ride status" });
  }
};


//------------------------------------------------

export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the checkout session from Stripe using the session_id
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // You can access session details here like amount_total, payment_status, etc.
    const amount = session.amount_total; // This is the total amount in cents

    res.status(200).json({ amount });
  } catch (error) {
    console.error("Error verifying session:", error);
    res.status(500).json({ message: "Failed to verify session" });
  }
};


//--------------------------------------------

export const getCompletedRides = async (req, res) => {
  try {
    const completedRides = await Ride.find({
      status: "Completed"
    }).populate("driverId", "name"); 

    if (!completedRides || completedRides.length === 0) {
      return res.status(404).json({ message: "No completed rides found." });
    }

    res.status(200).json(completedRides);
  } catch (error) {
    console.error("Error fetching completed rides:", error);
    res.status(500).json({ message: "Failed to fetch completed rides." });
  }
};

//--------------------------------------------


export const createRentRequest = async (req, res) => {
  try {
    const { customerId, package: selectedPackage, requested_vehicle, days, totalPrice } = req.body;

    if (!customerId || !requested_vehicle) {
      return res.status(400).json({ message: "Customer ID and vehicle type are required." });
    }

    if (!selectedPackage && !days) {
      return res.status(400).json({ message: "Either package or days must be provided." });
    }

    const rentRequest = new RentRequest({
      customerId,
      package: selectedPackage,
      requested_vehicle,
      days: days || 0,
      totalPrice,
      paid: false
    });

    await rentRequest.save();
    res.status(201).json({ message: "Rent request created successfully!", rentRequest });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --------------------------------------------
export const getRentRequestsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required." });
    }

    const rentRequests = await RentRequest.find({ customerId }).sort({ createdAt: -1 });
    res.status(200).json(rentRequests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// --------------------------------------------


export const payRent = async (req, res) => {
  try {
    const { rentRequestId, totalPrice, userId } = req.body;

    if (!rentRequestId || !totalPrice || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Fetch the rent request
    const rentRequest = await RentRequest.findById(rentRequestId);
    if (!rentRequest) {
      return res.status(404).json({ message: "Rent request not found" });
    }
    rentRequest.paid = true;
    await rentRequest.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Rent for ${rentRequest.requested_vehicle}`,
            },
            unit_amount: totalPrice * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/KahutaCarGo/Success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/KahutaCarGo/Cancel`,
      metadata: { rentRequestId, userId },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ message: "Payment processing failed" });
  }
};
