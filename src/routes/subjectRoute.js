import express from 'express';
import { addsubject, getAllsubjects, updatesubjects, deletesubject } from '../controllers/subjectController.js';
import { authenticate_Admin } from '../middlewares/adminAuthMiddleware.js';

const subjectsRouter = express.Router();

subjectsRouter.post('/add-subjects',authenticate_Admin, addsubject);
subjectsRouter.get('/fetch-subjects', getAllsubjects);
subjectsRouter.put('/update-subjects',authenticate_Admin, updatesubjects);
subjectsRouter.delete('/delete-subjects',authenticate_Admin, deletesubject);

export default subjectsRouter;
