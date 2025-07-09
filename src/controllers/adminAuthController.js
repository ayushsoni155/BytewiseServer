import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/db.js';
import { validateAdminSignup, validateAdminLogin } from '../utils/adminValidator.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d'; 

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Signup controller
export async function adminSignup(req, res) {
   const { error, value } = validateAdminSignup(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }

  const { user_id, name, password } = value;

  try {
    let { data: existingUser, error } = await supabase
      .from('admin')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'admin already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    const { data, error: insertError } = await supabase.from('admin').insert([{
      user_id,
      name,
      password: hashedPassword,
    }]);

    if (insertError) throw insertError;

    // Create token and send cookie
    const admin_token = createToken({ user_id });
    res.cookie('admin_token', admin_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(201).json({ message: 'admin created successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Login controller
export async function adminLogin(req, res) {
    const { error, value } = validateAdminLogin(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(e => e.message) });
  }

  const { user_id, password } = value;

  try {
    const { data: admin, error } = await supabase
      .from('admin')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token & send cookie
    const admin_token = createToken({ user_id: admin.user_id });
    res.cookie('admin_token', admin_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.json({ message: 'Logged in successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Logout controller
export function adminLogout(req, res) {
  res.clearCookie('admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
}

// Middleware to protect routes & get current user
export async function getadmin(req, res) {
  
  try {
    const user_id = req.admin.user_id;

    const { data: admin, error } = await supabase
      .from('admin')
      .select('user_id, name')
      .eq('user_id', user_id)
      .single();

    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.json({ admin });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}