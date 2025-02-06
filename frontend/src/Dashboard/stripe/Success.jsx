import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa'; 
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [amount, setAmount] = useState(null);

  // Extract session_id from URL query params
  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Fetch session details using the session_id
      axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/ride/verify-session`, { sessionId })
        .then(response => {
          const { amount } = response.data; // Assuming your backend returns the amount
          setAmount(amount / 100); // Convert cents to dollars
        })
        .catch(error => {
          console.error('Error verifying session:', error);
        });

      const timer = setTimeout(() => {
        navigate('/KahutaCarGo/book-ride');
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [sessionId, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-cyan-600 via-black to-gray-950 text-white">
      <div className="bg-black rounded-lg shadow-lg p-8 text-center text-gray-300">
        <FaCheckCircle className="text-cyan-600 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-2">Congratulations!</h1>
        <p className="text-lg mb-4">Your payment has been successfully completed in <strong>KahutaCarGo</strong>.</p>
        {amount && (
          <p className="text-md">You have paid <strong>Rs{amount}</strong> for your ride. Thank you!</p>
        )}
        <p className="text-md mt-4">Redirecting you to the booking page...</p>
      </div>
    </div>
  );
};

export default Success;
