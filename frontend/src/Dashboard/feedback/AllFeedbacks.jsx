import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const AllFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/feedback/get-feedbacks`);
        setFeedbacks(response.data);
      } catch (err) {
        setError('Failed to fetch feedbacks. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-white border-b border-cyan-600 pb-3">
        All Feedbacks
      </h1>

      {loading ? (
        <p className="text-gray-400 text-center mt-5">Loading feedbacks...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-5">{error}</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-gray-400 text-center mt-5">No feedback available.</p>
      ) : (
        <div className="mt-6">
          {feedbacks.map((feedback) => (
            <div key={feedback._id} className="border border-gray-800 bg-gray-900 p-5 my-5 shadow-lg rounded-lg">
              <div className="flex items-center gap-4">
                <FaUserCircle className="text-cyan-600 text-3xl" />
                <div>
                  <p className="text-cyan-600 font-semibold">{feedback.name}</p>
                  <p className="text-gray-400">{feedback.email}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-300">{feedback.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllFeedbacks;
