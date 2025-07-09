import express from 'express';
import { addvideo, getAllvideos, updatevideo, deletevideo } from '../controllers/videoController.js';
import { authenticate_Admin } from '../middlewares/adminAuthMiddleware.js';

const videosRouter = express.Router();

videosRouter.post('/add-video',authenticate_Admin, addvideo);
videosRouter.get('/fetch-videos', getAllvideos);
videosRouter.put('/update-video',authenticate_Admin, updatevideo);
videosRouter.delete('/delete-video',authenticate_Admin, deletevideo);

export default videosRouter;
