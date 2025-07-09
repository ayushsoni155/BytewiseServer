import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from '../config/db.js';
import { validateSignup, validateLogin } from '../utils/userValidator.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '1d'; 

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Signup controller
export async function signup(req, res) {
   const { error, value } = validateSignup(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map(err => err.message) });
  }

  const { enrollment, name, mobile, password, security_question, security_answer } = value;

  try {
    let { data: existingUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('enrollment', enrollment)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password and security answer
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(security_answer, 10);

    // Insert new user
    const { data, error: insertError } = await supabase.from('users').insert([{
      enrollment,
      name,
      mobile,
      password: hashedPassword,
      user_status: 'active',
      security_question,
      security_answer: hashedAnswer,
    }]);

    if (insertError) throw insertError;

    // Create token and send cookie
    const token = createToken({ enrollment });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.status(201).json({ Token: token, message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Login controller
export async function login(req, res) {
    const { error, value } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map(e => e.message) });
  }

  const { enrollment, password } = value;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('enrollment', enrollment)
      .single();

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token & send cookie
    const token = createToken({ enrollment: user.enrollment });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.json({Token: token, message: 'Logged in successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Logout controller
export function logout(req, res) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
}

// get current user
export async function me(req, res) {
  
  try {
    const enrollment = req.user.enrollment;   
    const { data: user, error } = await supabase
      .from('users')
      .select('enrollment, name, mobile, user_status, security_question')
      .eq('enrollment', enrollment)
      .single();

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });

  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

