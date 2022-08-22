import express from 'express';
import {} from 'express-async-errors';
import * as authController from '../controller/auth_controller.js';
import { isAuth } from '../middleware/auth_middleware.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', isAuth, authController.me);

export default router;
