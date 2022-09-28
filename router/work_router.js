import express from 'express';
import 'express-async-errors';
import * as workController from '../controller/work_controller.js';
import { isAuth } from '../middleware/auth_middleware.js';

const router = express.Router();

// router.get('/', workController.showWorks);
router.get('/', isAuth, workController.getWorks);
router.post('/', isAuth, workController.createWork);
router.post('/image', workController.uploadImage);
router.delete('/:id', isAuth, workController.deleteWork);

export default router;
