import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    name: { type: String, required: true },
    cnic: { type: String, required: true, unique: true }, 
    licenseNumber: { type: String, required: true, unique: true },
    alotedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    balance: { type: Number, default: 0 },
    contactNumber: { type: String, required: true },
    experience: { type: Number, required: true }, 
    vehicleType: { type: String, enum: ["Car", "Bike", "Truck", "Bus", "Other"], required: true },
    paymentType: { type: String, enum: ["Daily", "Weekly", "Monthly"], required: true },
    requestedAmount: { type: Number, required: true },
    registrationDate: { type: Date, default: Date.now },
    isAvailable: { type: Boolean, default: true }, 
    location: { 
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }
    },
  },
  { timestamps: true, versionKey: false } 
);

DriverSchema.index({ location: "2dsphere" }); 

const Driver = mongoose.model("Driver", DriverSchema);
export default Driver;
