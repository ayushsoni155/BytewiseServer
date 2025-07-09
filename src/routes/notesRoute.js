import express from 'express';
import { addNote, getAllNotes, updateNotes, deleteNote } from '../controllers/notesController.js';
import { authenticate_Admin } from '../middlewares/adminAuthMiddleware.js';

const notesRouter = express.Router();

notesRouter.post('/add-notes',authenticate_Admin, addNote);
notesRouter.get('/fetch-notes', getAllNotes);
notesRouter.put('/update-notes',authenticate_Admin, updateNotes);
notesRouter.delete('/delete-notes',authenticate_Admin, deleteNote);

export default notesRouter;
