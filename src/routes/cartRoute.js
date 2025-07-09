import express from 'express';
import { addToCart, getCartItems, deleteCartItem, clearCart } from '../controllers/cartController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const cartRouter = express.Router();

cartRouter.post('/add-to-cart',authenticateToken, addToCart);
cartRouter.get('/fetch-cart', authenticateToken, getCartItems);
cartRouter.delete('/delete-cart', authenticateToken, deleteCartItem);
cartRouter.delete('/clear-cart', authenticateToken, clearCart);

export default cartRouter;
  