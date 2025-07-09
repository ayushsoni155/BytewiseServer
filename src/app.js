import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import subjectsRouter from './routes/subjectRoute.js';
import notesRouter from './routes/notesRoute.js';
import adminAuthRouter from './routes/adminAuthRoute.js';
import videosRouter from './routes/videosRoute.js';
import labManualRouter from './routes/labManualRoute.js';
import coursesRouter from './routes/courseRoute.js';
import cartRouter from './routes/cartRoute.js';
import userRouter from './routes/userRoutes.js';
import ordersRouter from './routes/ordersRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS with specific origin and credentials
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/admin-auth', adminAuthRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/videos', videosRouter);
app.use('/api/lab-manuals', labManualRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/user', userRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/feedback', feedbackRouter);

app.get('/', (req, res) => {
  res.send('Express MVC server is running 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});