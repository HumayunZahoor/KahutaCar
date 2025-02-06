import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import {toast} from 'react-toastify';

const Feedback = () => {
  const auth = useSelector((state) => state.auth);
  const { id: userId, name, email } = auth;

  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackMessage) {
      setError("Please provide your feedback.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/feedback/write-feedback`,
        {
          userId,
          name,
          email,
          message: feedbackMessage
        }
      );
      setSuccess('Your feedback has been submitted successfully.');
      toast.success('Your feedback has been submitted successfully.');
      
      setFeedbackMessage('');
      setError('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again later.');
      toast.error('Failed to submit feedback. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-950 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-white border-b border-cyan-600 pb-3">
        Submit Your Feedback
      </h1>

      <form onSubmit={handleFeedbackSubmit} className="mt-6">
        <div className="mb-4">
          <label htmlFor="feedback" className="block text-white mb-2">
            Your Feedback
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
            rows="6"
            placeholder="Write your feedback here..."
          />
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-cyan-600 text-white rounded-md flex items-center justify-center gap-2 w-full"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Feedback;
