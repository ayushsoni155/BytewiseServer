import express from 'express';
import { changePassword, updateuser, deleteuser,verifyEnrollment } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

userRouter.put('/change-password', changePassword);
userRouter.post('/verify-enrollment', verifyEnrollment);
userRouter.put('/update-user',authenticateToken, updateuser);
userRouter.delete('/delete-user',authenticateToken, deleteuser);

export default userRouter;
