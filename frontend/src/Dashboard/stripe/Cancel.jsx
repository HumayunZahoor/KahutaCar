import React, { useEffect } from 'react';
import { FaTimesCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom'; 

const Cancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/KahutaCarGo/book-ride');
    }, 3000); 
    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-red-500 via-pink-500 to-gray-950 text-white">
      <div className="bg-black rounded-lg shadow-lg p-8 text-center text-gray-300">
        <FaTimesCircle className="text-red-500 text-6xl mb-4" />
        <h1 className="text-3xl font-bold mb-2">Action Canceled</h1>
        <p className="text-lg mb-4">The shop creation process has been canceled in <strong>KahutaCarGo</strong>.</p>
        <p className="text-md">If this was a mistake, you can restart the process at any time.</p>
        <p className="text-md mt-4">Redirecting you to the booking page...</p>
      </div>
    </div>
  );
}

export default Cancel;
