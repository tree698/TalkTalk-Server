import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import * as authController from '../controller/auth_controller.js';
import { isAuth } from '../middleware/auth_middleware.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const validateCredential = [
  body('username')
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('username should be at least 2 characters'),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('password should be at least 5 characters'),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body('email').trim().isEmail().normalizeEmail().withMessage('invalid email'),
  body('url')
    .trim()
    .isURL()
    .withMessage('invalid URL')
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateCredential, authController.login);
router.get('/me', isAuth, authController.me);

export default router;
