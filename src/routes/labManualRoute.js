import express from 'express';
import { addLabManual, getAllLabManuals ,updateLabManual ,deleteLabManual } from '../controllers/labManualController.js';
import { authenticate_Admin } from '../middlewares/adminAuthMiddleware.js';

const labManualRouter = express.Router();

labManualRouter.post('/add-labManual',authenticate_Admin, addLabManual);
labManualRouter.get('/fetch-labManuals', getAllLabManuals);
labManualRouter.put('/update-labManual',authenticate_Admin, updateLabManual);
labManualRouter.delete('/delete-labManual',authenticate_Admin, deleteLabManual);

export default labManualRouter;
