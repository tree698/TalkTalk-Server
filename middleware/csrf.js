import bcrypt from 'bcrypt';
import { config } from '../config.js';

export const csrfCheck = (req, res, next) => {
  if (
    req.method === 'GET' ||
    req.method === 'OPTIONS' ||
    req.method === 'HEAD'
  ) {
    return next();
  }

  const csrfHeader = req.get('talktalk-csrf-token');

  if (!csrfHeader) {
    console.warn('Missing required "_csrf-token" header', req.header.origin);
    return res.status(403).json({ message: 'Failed CSRF check' });
  }

  validateCSRFToken(csrfHeader) //
    .then((valid) => {
      if (!valid) {
        console.warn(
          'Value provided in "_csrf-token" header does not validate',
          req.header.origin,
          csrfHeader
        );
        return res.status(403).json({ message: 'Failed CSRF check' });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: 'Something went wrong' });
    });
};

async function validateCSRFToken(csrfHeader) {
  return bcrypt.compare(config.csrf.plainToken, csrfHeader);
}
