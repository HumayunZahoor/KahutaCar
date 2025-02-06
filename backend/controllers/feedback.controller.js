import Feedback from '../models/feedback.model.js';


export const submitFeedback = async (req, res) => {
  const { userId, name, email, message } = req.body;

  try {
    if (!message || !userId || !name || !email) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newFeedback = new Feedback({
      userId,
      name,
      email,
      message,
    });

    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Failed to submit feedback. Please try again.' });
  }
};

// -----------------------------------------
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('userId', 'name email');
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Failed to fetch feedbacks.' });
  }
};
