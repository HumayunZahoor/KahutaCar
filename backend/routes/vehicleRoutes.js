import express from "express";
import { registerVehicle , getUserVehicles} from "../controllers/vehicle.controller.js";

const vehicleRoutes = express.Router();

vehicleRoutes.post("/register-vehicle", registerVehicle);
vehicleRoutes.get("/get-vehicles", getUserVehicles);

export default vehicleRoutes;
