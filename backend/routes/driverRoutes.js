import express from "express";
import { registerDriver , getUserDrivers , updateDriverLocation } from "../controllers/driver.controller.js";

const driverRoutes = express.Router();

driverRoutes.post("/register-driver", registerDriver);
driverRoutes.get("/get-driver", getUserDrivers);
driverRoutes.post("/update-location", updateDriverLocation);

export default driverRoutes;
