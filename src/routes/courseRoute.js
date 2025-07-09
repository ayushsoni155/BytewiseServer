import express from 'express';
import { addcourse, getAllcourses, updatecourses, deletecourse } from '../controllers/coursesController.js';
import { authenticate_Admin } from '../middlewares/adminAuthMiddleware.js';

const coursesRouter = express.Router();

coursesRouter.post('/add-courses',authenticate_Admin, addcourse);
coursesRouter.get('/fetch-courses', getAllcourses);
coursesRouter.put('/update-courses',authenticate_Admin, updatecourses);
coursesRouter.delete('/delete-courses',authenticate_Admin, deletecourse);

export default coursesRouter;
