import express from 'express';
import { bookRide , getRidesByDriver , updateRideStatus , updateRideStatusbyCustomer , getMyRides , verifySession ,getCompletedRides , createRentRequest , getRentRequestsByCustomer} from '../controllers/ride.controller.js';

const rideRoutes = express.Router();

rideRoutes.post('/book-ride', bookRide);
rideRoutes.get("/get-rides", getRidesByDriver);
rideRoutes.post("/update-ride-status", updateRideStatus);
rideRoutes.post("/update-ride-statusby-customer", updateRideStatusbyCustomer);
rideRoutes.get("/get-my-ride", getMyRides);
rideRoutes.post('/verify-session' , verifySession);
rideRoutes.get("/get-completed-rides", getCompletedRides);
rideRoutes.post("/rent-a-car", createRentRequest);
rideRoutes.get("/rent-requests/:customerId", getRentRequestsByCustomer);


export default rideRoutes;
