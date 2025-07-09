import express from 'express';
import {submitFeedback, getMyFeedback, getAllFeedback } from '../controllers/feedbackController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const feedbackRouter = express.Router();

feedbackRouter.post('/submit-feedback',authenticateToken, submitFeedback);
feedbackRouter.get('/fetch-feedback', authenticateToken, getMyFeedback);
feedbackRouter.get('/all-feedback', getAllFeedback);


export default feedbackRouter;
