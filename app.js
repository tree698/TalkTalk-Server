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
import { initSocket } from './connection/socket.js';
import { csrfCheck } from './middleware/csrf.js';
import rateLimit from './middleware/rate-limiter.js';

const app = express();

const corsOption = {
  // 특정 URL만 허용할 경우...
  origin: config.cors.allowedOrigin,
  optionsSuccessStatus: 200,
  // allow the Access-Control-Allow-Credentials
  credentials: true,
};

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
app.use('/tweets', tweetsRouter);
app.use('/work', workRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});

console.log(config.cors.allowedOrigin);
sequelize.sync().then(() => {
  console.log(`Server is started... ${new Date()}`);
  const server = app.listen(config.host.port);
  initSocket(server);
});
