import { registerUser, loginUser } from '../services/authService.js';
import { AppError } from '../middlewares/errorHandler.js';

export async function register(req, res, next) {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'Email already registered') {
      return next(new AppError(error.message, 409));
    }
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUser(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return next(new AppError(error.message, 401));
    }
    next(error);
  }
}

export async function me(req, res) {
  res.json({ success: true, data: req.user });
}
