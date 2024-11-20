import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

// Joi schema for validation
const registerSchema = Joi.object({
  username: Joi.string().min(5).required(),
  password: Joi.string().min(5).required(),
});

// Register endpoint
export const register = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, password } = req.body;

  // Validate inputs
  const { error } = registerSchema.validate({ username, password });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Hash the password before saving it, using 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    const errorMessage = error?.errors?.[0]?.message || 'Failed to register user';
    return res.status(500).json({ message: errorMessage, details: error });
  }
};

// Login endpoint
export const login = async (req: Request, res: Response): Promise<Response | void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });

    // Check if user exists and the provided password matches the hashed password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT for the authenticated user
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to login', error });
  }
};
