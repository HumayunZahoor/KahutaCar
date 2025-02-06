import express from 'express';
import { submitFeedback, getAllFeedbacks } from '../controllers/feedback.controller.js';

const fbRoutes = express.Router();


fbRoutes.post('/write-feedback', submitFeedback);
fbRoutes.get('/get-feedbacks', getAllFeedbacks);


export default fbRoutes;
