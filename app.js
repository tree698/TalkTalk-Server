import express from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './router/auth_router.js';
import tweetsRouter from './router/tweet_router.js';
import workRouter from './router/work_router.js';
import { config } from './config.js';
import { sequelize } from './db/database.js';
import { initSocket } from './connection/socket.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors());
app.use(morgan('tiny'));

app.use(express.static('public'));
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

sequelize.sync().then(() => {
  const server = app.listen(config.host.port);
  initSocket(server);
});
