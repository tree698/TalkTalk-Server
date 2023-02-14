import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import { isAuth } from '../middleware/auth_middleware.js';
import { validate } from '../middleware/validator.js';

const router = express.Router();

const validateTweet = [
  body('text')
    .trim()
    .isLength({ min: 2 })
    .withMessage('text should be at least 2 characters'),
  validate,
];

export default function tweetRouter(tweetController) {
  router.get('/', isAuth, tweetController.getTweets);
  router.post('/', isAuth, validateTweet, tweetController.createTweet);
  router.delete('/:id', isAuth, tweetController.deleteTweet);
  return router;
}
