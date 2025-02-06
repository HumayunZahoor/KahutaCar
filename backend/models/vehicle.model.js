import mongoose from "mongoose";
import { type } from "os";

const VehicleSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["Car", "Bike", "Truck", "Bus", "Other"], required: true },
    model: { type: String, required: true },
    brand: { type: String, required: true },
    color: { type: String, required: true },
    paymentType: { type: String, enum: ["Daily", "Weekly", "Monthly"], required: true },
    requestedAmount: { type: Number, required: true },
    registrationDate: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true },
    alloted:{type: Boolean, default: false},
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
export default Vehicle;