import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import {
  registerValidation,
  loginValidation,
  validate,
} from '../middlewares/validation.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.get('/me', requireAuth, me);

export default router;
