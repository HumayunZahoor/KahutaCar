import express from 'express';
import { saveAdminDetails , getDriversAndVehicles , toggleDriverStatus , toggleVehicleStatus , allotVehicleToDriver , getAllRentRequests , updateRentRequestStatus} from '../controllers/admin.controller.js';

const adminRoutes = express.Router();

adminRoutes.post('/save-details', saveAdminDetails);
adminRoutes.get("/get-drivers-and-vehicles", getDriversAndVehicles);
adminRoutes.post("/toggle-driver-status", toggleDriverStatus);
adminRoutes.post("/toggle-vehicle-status", toggleVehicleStatus);
adminRoutes.post("/allot-vehicle-to-driver", allotVehicleToDriver);
adminRoutes.get("/get-rent-requests", getAllRentRequests);
adminRoutes.put("/update-rent-request/:requestId", updateRentRequestStatus);


export default adminRoutes;
