import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "users"},
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver"},
  fare: { type: Number, default: 0 },
  startLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  endLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  status: { type: String, enum: ["Pending", "Completed", "Cancelled"], default: "Pending" },
  driver_status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  bookedAt: { type: Date, default: Date.now }
});


RideSchema.index({ startLocation: "2dsphere", endLocation: "2dsphere" }); 
const Ride = mongoose.model("Ride", RideSchema);
export default Ride;
