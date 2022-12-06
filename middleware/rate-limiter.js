import { rateLimit } from 'express-rate-limit';
import { config } from '../config.js';

// export default function rateLimiter() {
//     return rateLimit({
//         windowMs: config.rateLimiter.windowMs,
//         max: config.rateLimiter.maxRequest,
//     })
// }

export default rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequest,
});
