import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authenticate_Admin(req, res, next) {
  const admin_token = req.cookies.admin_token;

  if (!admin_token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(admin_token, JWT_SECRET);
    req.admin = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
