import axios from 'axios';
import { startServer, stopServer } from '../../app.js';
import { faker } from '@faker-js/faker';
import {
  makeValidUserDetails,
  createCSRFToken,
  createNewUserAccount,
  createHeadersWithTokens,
} from './auth_utils.js';

describe('Auth APIs', () => {
  let server, request, csrfToken;
  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: `http://localhost:${server.address().port}`,
      validateStatus: null,
    });
    csrfToken = await createCSRFToken(request);
  });

  afterAll(async () => {
    await stopServer(server);
  });

  describe('POST to /auth/signup', () => {
    it('returns 201 with username if user details are valid', async () => {
      const user = makeValidUserDetails();

      const res = await request.post(
        '/auth/signup',
        user,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(201);
    });

    it('returns 409 when username has already been taken', async () => {
      const user = makeValidUserDetails();
      const firstSignup = await request.post(
        '/auth/signup',
        user,
        createHeadersWithTokens(csrfToken)
      );
      const secondSignup = await request.post(
        '/auth/signup',
        user,
        createHeadersWithTokens(csrfToken)
      );

      expect(secondSignup.status).toBe(409);
      expect(secondSignup.data.message).toBe(
        `${user.username} already exists. Try again!`
      );
    });

    describe.each([
      {
        missingFieldName: 'username',
        expectedMessage: 'username should be at least 2 characters',
      },
      {
        missingFieldName: 'password',
        expectedMessage: 'password should be at least 5 characters',
      },
      {
        missingFieldName: 'email',
        expectedMessage: 'invalid email',
      },
    ])(
      'if $missingFieldName is missing',
      ({ missingFieldName, expectedMessage }) => {
        it(`returns ${expectedMessage}`, async () => {
          const user = makeValidUserDetails();
          delete user[missingFieldName];
          const res = await request.post(
            '/auth/signup',
            user,
            createHeadersWithTokens(csrfToken)
          );

          expect(res.status).toBe(400);
          expect(res.data.message).toBe(expectedMessage);
        });
      }
    );

    it('returns 400 if the length of password is less than 5', async () => {
      const user = {
        ...makeValidUserDetails(),
        password: '123',
      };

      const res = await request.post(
        '/auth/signup',
        user,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('password should be at least 5 characters');
    });
  });

  describe('POST to /auth/login', () => {
    it('returns 200 when logging in with valid username and password ', async () => {
      const user = await createNewUserAccount(request, csrfToken);

      const res = await request.post(
        '/auth/login',
        user,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(200);
      expect(res.data.username).toBe(user.username);
      expect(res.data.token.length).toBeGreaterThan(1);
    });

    it('returns 401 if the username does not exist when logging in ', async () => {
      const user = await createNewUserAccount(request, csrfToken);
      const userWithWrongUsername = {
        ...user,
        username: faker.internet.userName(),
      };

      const res = await request.post(
        '/auth/login',
        userWithWrongUsername,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(401);
      expect(res.data.message).toBe('Invalid username or password. Try again!');
    });

    it('returns 401 when logging in with invalid password ', async () => {
      const user = await createNewUserAccount(request, csrfToken);
      const userWithWrongPassword = {
        ...user,
        password: faker.internet.password(),
      };

      const res = await request.post(
        '/auth/login',
        userWithWrongPassword,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(401);
      expect(res.data.message).toBe('Invalid username or password. Try again!');
    });
  });

  describe('GET to /auth/me', () => {
    it('returns user details when valid token is present in Authorization header', async () => {
      const user = await createNewUserAccount(request, csrfToken);
      const login = await request.post(
        '/auth/login',
        user,
        createHeadersWithTokens(csrfToken)
      );

      const res = await request.get('/auth/me', {
        headers: { Authorization: `Bearer ${login.data.token}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.username).toBe(login.data.username);
      // expect(res.data).toMatchObject({
      //   username: login.data.username,
      //   token: login.data.token,
      // });
    });
  });

  describe('POST to /auth/logout', () => {
    it('returns 200 when logging out', async () => {
      const user = await createNewUserAccount(request, csrfToken);

      const res = await request.post(
        '/auth/logout',
        user,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(200);
    });
  });
});
