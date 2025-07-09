import express from 'express';
import { placeOrder, getMyOrders,cancelOrder } from '../controllers/ordersController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const ordersRouter = express.Router();

ordersRouter.post('/place-order',authenticateToken, placeOrder);
ordersRouter.get('/fetch-orders',authenticateToken, getMyOrders);
ordersRouter.delete('/cancel-order',authenticateToken, cancelOrder);

export default ordersRouter;
