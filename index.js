import { startServer } from './app.js';
import { config } from './config.js';

startServer(config.host.port);
