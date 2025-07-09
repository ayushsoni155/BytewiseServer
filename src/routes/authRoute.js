import express from 'express';
import { signup, login, logout, me } from '../controllers/authController.js';
import {authenticateToken} from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/logout',authenticateToken, logout);
authRouter.get('/me',authenticateToken, me);

export default authRouter;
