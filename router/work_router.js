import express from 'express';
import 'express-async-errors';
import * as workController from '../controller/work_controller.js';
import { isAuth } from '../middleware/auth_middleware.js';
import { validate } from '../middleware/validator.js';
import { body } from 'express-validator';

const router = express.Router();

const validateCredential = [
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage('Title should be at least 2 characters'),
  body('brush')
    .trim()
    .notEmpty()
    .withMessage('Brush should be at least 2 characters'),
  body('description').trim(),
  validate,
];

router.get('/', isAuth, workController.getWorks);
router.get('/carousel', workController.showWorks);
router.get('/search', workController.searchWorks);
router.post('/', isAuth, validateCredential, workController.createWork);
router.post('/image', workController.uploadImage);
router.delete('/:id', isAuth, workController.deleteWork);

export default router;
