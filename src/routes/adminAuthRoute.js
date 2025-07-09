import express from 'express';
import { adminSignup, adminLogin, adminLogout, getadmin } from '../controllers/adminAuthController.js';
import {authenticate_Admin} from '../middlewares/adminAuthMiddleware.js';
const adminAuthRouter = express.Router();

adminAuthRouter.post('/admin-signup', adminSignup);
adminAuthRouter.post('/admin-login', adminLogin);
adminAuthRouter.get('/admin-logout',authenticate_Admin, adminLogout);
adminAuthRouter.get('/admin-me',authenticate_Admin, getadmin);

export default adminAuthRouter;
