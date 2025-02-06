import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthForm from './auth/AuthForm';
import DashboardLayout from './Dashboard/DashboardLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashboard/Dashboard';
import RegisterVehicle from './Dashboard/vehicleRegistration/RegisterVehicle';
import RegisterDriver from './Dashboard/driverRegistration/RegisterDriver';
import DriverProfile from './Dashboard/profiles/DriverProfile';
import LocationButton from './Dashboard/LocationButton/LocationButton';
import LiveLocationMap from './Dashboard/LocationButton/LiveLocationMap';
import Management from './Dashboard/managment/Management';
import AllotVehicleToDriver from './Dashboard/AllotVehicleToDriver/AllotVehicleToDriver';
import Vehicle from './Dashboard/vehicleProfile/Vehicle';
import Bookride from './Dashboard/bookAride/Bookride';
import ManageRide from './Dashboard/ManageRide/ManageRide';
import MyRide from './Dashboard/MyRide/MyRide';
import Success from './Dashboard/stripe/Success';
import Cancel from './Dashboard/stripe/Cancel';
import Feedback from './Dashboard/feedback/Feedback';
import AllFeedbacks from './Dashboard/feedback/AllFeedbacks';
import CompletedRides from './Dashboard/CompletedRides/CompletedRides';
import RentACar from './Dashboard/renTaCar/RentACar';
import MyRentRequests from './Dashboard/renTaCar/MyRentRequests';
import ManageRentRequests from './Dashboard/renTaCar/ManageRentRequests';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/KahutaCarGo" element={<DashboardLayout />}>
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="register-vehicle" element={<RegisterVehicle />} />
          <Route path="register-driver" element={<RegisterDriver />} />
          <Route path="driver-profile" element={<DriverProfile />} />
          <Route path="location" element={<LocationButton />} />
          <Route path="live-location" element={<LiveLocationMap />} />
          <Route path="management" element={<Management />} />
          <Route path="allot-vehicle-to-driver" element={<AllotVehicleToDriver />} />
          <Route path="vehicle" element={<Vehicle />} />
          <Route path="book-ride" element={<Bookride />} />
          <Route path="manage-ride" element={<ManageRide />} />
          <Route path="get-my-ride" element={<MyRide />} />
          <Route path="Success" element={<Success />} />
          <Route path="Cancel" element={<Cancel />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="get-feedbacks" element={<AllFeedbacks />} />
          <Route path="get-completed-rides" element={<CompletedRides />} />
          <Route path="rent-a-car" element={<RentACar />} />
          <Route path="my-rent-requests" element={<MyRentRequests />} />
          <Route path="manage-rent-requests" element={<ManageRentRequests />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}
