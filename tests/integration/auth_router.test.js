import axios from 'axios';
import { startServer, stopServer } from '../../app.js';
import { sequelize } from '../../db/database.js';
import { faker } from '@faker-js/faker';

describe('Auth APIs', () => {
  let server, request;
  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: 'http://localhost:8080',
      validateStatus: null,
    });
  });

  afterAll(async () => {
    await sequelize.drop();
    await stopServer(server);
  });

  describe('POST to /auth/signup', () => {
    let csrfToken;
    beforeEach(async () => {
      const response = await request.get('/auth/csrf-token');
      csrfToken = response.data.csrfToken;
    });

    it('returns 201 with username if user details are valid', async () => {
      const user = makeValidUserDetails();

      const res = await request.post('/auth/signup', user, {
        headers: {
          'talktalk-csrf-token': csrfToken,
        },
      });

      expect(res.status).toBe(201);
    });

    it('returns 409 when username has already been taken', async () => {
      const user = makeValidUserDetails();
      const firstSignup = await request.post('/auth/signup', user, {
        headers: {
          'talktalk-csrf-token': csrfToken,
        },
      });
      const secondSignup = await request.post('/auth/signup', user, {
        headers: {
          'talktalk-csrf-token': csrfToken,
        },
      });

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
          const res = await request.post('/auth/signup', user, {
            headers: {
              'talktalk-csrf-token': csrfToken,
            },
          });

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

      const res = await request.post('/auth/signup', user, {
        headers: {
          'talktalk-csrf-token': csrfToken,
        },
      });

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('password should be at least 5 characters');
    });
  });
});

function makeValidUserDetails() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    photo: faker.internet.avatar(),
  };
}
