import mongoose from "mongoose";

const RentRequestSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "users",  
    required: true 
  },
  vehicleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Vehicle", 
    default: null
  },
  package: { 
    type: String, 
    enum: ["Daily", "Weekly", "Ten Days", "Fortnightly", "Monthly"],
    default: ""
  },
  requested_vehicle: {
    type: String,
    enum: ["Car", "Bike", "Truck", "Bus", "Other"],
    required: true
  },
  startDate: { 
    type: Date, 
    default: Date.now
  },
  endDate: { 
    type: Date, 
    default: ""
  },
  days: { 
    type: Number, 
    default: 0
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected", "Completed"], 
    default: "Pending" 
  },
}, { timestamps: true });

const RentRequest = mongoose.model("RentRequest", RentRequestSchema);

export default RentRequest;
