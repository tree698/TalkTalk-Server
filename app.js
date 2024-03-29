import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './router/auth_router.js';
import tweetsRouter from './router/tweet_router.js';
import workRouter from './router/work_router.js';
import { config } from './config.js';
import { sequelize } from './db/database.js';
import { initSocket, getSocketIO } from './connection/socket.js';
import TweetController from './controller/tweet_controller.js';
import * as tweetRepository from './data/tweet_data.js';
import { csrfCheck } from './middleware/csrf.js';
import rateLimit from './middleware/rate-limiter.js';

const corsOption = {
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  credentials: true,
};

export async function startServer(port) {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );
  app.use(cors(corsOption));
  app.use(morgan('tiny'));
  app.use(express.static('public'));

  app.use(csrfCheck);
  app.use(rateLimit);
  app.use('/auth', authRouter);
  app.use(
    '/tweets',
    tweetsRouter(new TweetController(tweetRepository, getSocketIO))
  );
  app.use('/work', workRouter);

  app.use((req, res, next) => {
    res.sendStatus(404);
  });

  app.use((error, req, res, next) => {
    console.log(error);
    res.sendStatus(500);
  });

  console.log(config.cors.allowedOrigin);
  await sequelize.sync();
  console.log(`Server is started... ${new Date()}`);
  const server = app.listen(port);
  initSocket(server);
  return server;
}

export async function stopServer(server) {
  return new Promise((resolve, reject) => {
    server.close(async () => {
      try {
        await sequelize.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  });
}
