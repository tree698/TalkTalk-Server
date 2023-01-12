import axios from 'axios';
import { startServer, stopServer } from '../../app.js';
import { sequelize } from '../../db/database.js';
import { faker } from '@faker-js/faker';

describe('Auth APIs', () => {
  let server, request, csrfToken;
  beforeAll(async () => {
    server = await startServer();
    request = axios.create({
      baseURL: 'http://localhost:8080',
      validateStatus: null,
    });
    csrfToken = await createCSRFToken(request);
  });

  afterAll(async () => {
    await sequelize.drop();
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

  describe('Tweets APIs', () => {
    describe('POST to /tweets', () => {
      it('returns 201 with tweet when the length of tweet is more than 2 characters', async () => {
        const text = faker.word.noun(4);
        const workId = faker.random.numeric();
        const createdUser = await createNewUserAccount(request, csrfToken);
        const loggedInUser = await request.post(
          '/auth/login',
          createdUser,
          createHeadersWithTokens(csrfToken)
        );

        const res = await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedInUser.data.token)
        );

        expect(res.status).toBe(201);
        expect(res.data).toMatchObject({ text });
      });

      it('returns 400 when the length of tweet is less than 2 characters', async () => {
        const text = faker.random.alphaNumeric(1);
        const workId = faker.random.numeric();
        const createdUser = await createNewUserAccount(request, csrfToken);
        const loggedInUser = await request.post(
          '/auth/login',
          createdUser,
          createHeadersWithTokens(csrfToken)
        );

        const res = await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedInUser.data.token)
        );

        expect(res.status).toBe(400);
        expect(res.data.message).toMatch(
          'text should be at least 2 characters'
        );
      });
    });

    describe('GET to /tweets', () => {
      it('returns 200 and all tweets when username is not specified in the query', async () => {
        const text = faker.word.noun(3);
        const workId = faker.random.numeric();
        const user1 = await createNewUserAccount(request, csrfToken);
        const user2 = await createNewUserAccount(request, csrfToken);
        const loggedUser1 = await request.post(
          '/auth/login',
          user1,
          createHeadersWithTokens(csrfToken)
        );
        const loggedUser2 = await request.post(
          '/auth/login',
          user2,
          createHeadersWithTokens(csrfToken)
        );
        await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedUser1.data.token)
        );
        await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedUser2.data.token)
        );

        const res = await request.get(
          `/tweets?workId=${workId}`,
          createHeadersWithTokens(csrfToken, loggedUser1.data.token)
        );

        expect(res.status).toBe(200);
        expect(res.data.length).toBeGreaterThanOrEqual(2);
      });

      it('returns 200 and only tweets of given user when username is specified in the query', async () => {
        const text = faker.word.noun(3);
        const workId = faker.random.numeric();
        const user1 = await createNewUserAccount(request, csrfToken);
        const user2 = await createNewUserAccount(request, csrfToken);
        const loggedUser1 = await request.post(
          '/auth/login',
          user1,
          createHeadersWithTokens(csrfToken)
        );
        const loggedUser2 = await request.post(
          '/auth/login',
          user2,
          createHeadersWithTokens(csrfToken)
        );
        await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedUser1.data.token)
        );
        await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedUser2.data.token)
        );

        const res = await request.get(
          `/tweets?workId=${workId}&username=${user1.username}`,
          createHeadersWithTokens(csrfToken, loggedUser1.data.token)
        );

        expect(res.status).toBe(200);
        expect(res.data.length).toEqual(1);
      });
    });

    describe('DELETE to /tweets/:id', () => {
      it('returns 404 when tweet id does not exist', async () => {
        const user = await createNewUserAccount(request, csrfToken);
        const loggedUser = await request.post(
          '/auth/login',
          user,
          createHeadersWithTokens(csrfToken)
        );

        const res = await request.delete(
          '/tweets/nonexistentId',
          createHeadersWithTokens(csrfToken, loggedUser.data.token)
        );

        expect(res.status).toBe(404);
        expect(res.data.message).toBe('Tweet not found: nonexistentId');
      });

      it('returns 403 and the tweet should still be there when tweet id exists but the tweet does not belong to the user', async () => {
        const text = faker.word.noun(4);
        const workId = faker.random.numeric(3);
        const tweetAuthor = await createNewUserAccount(request, csrfToken);
        const anotherUser = await createNewUserAccount(request, csrfToken);
        const loggedTweetAuther = await request.post(
          '/auth/login',
          tweetAuthor,
          createHeadersWithTokens(csrfToken)
        );
        const loggedAnotherUser = await request.post(
          '/auth/login',
          anotherUser,
          createHeadersWithTokens(csrfToken)
        );
        const createdTweet = await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedTweetAuther.data.token)
        );

        const deleteTweet = await request.delete(
          `/tweets/${createdTweet.data.id}`,
          createHeadersWithTokens(csrfToken, loggedAnotherUser.data.token)
        );

        const checkTweetResult = await request.get(
          `/tweets?workId=${workId}`,
          createHeadersWithTokens(csrfToken, loggedTweetAuther.data.token)
        );

        expect(deleteTweet.status).toBe(403);
        expect(checkTweetResult.status).toBe(200);
        expect(checkTweetResult.data[0].text).toBe(text);
      });

      it('returns 204 and the tweet should be deleted when tweet id exists and the tweet belongs to the user', async () => {
        const text = faker.word.noun(4);
        const workId = faker.random.numeric(3);
        const tweetAuthor = await createNewUserAccount(request, csrfToken);
        const loggedTweetAuther = await request.post(
          '/auth/login',
          tweetAuthor,
          createHeadersWithTokens(csrfToken)
        );

        const createdTweet = await request.post(
          `/tweets?workId=${workId}`,
          { text },
          createHeadersWithTokens(csrfToken, loggedTweetAuther.data.token)
        );

        const deleteTweet = await request.delete(
          `/tweets/${createdTweet.data.id}`,
          createHeadersWithTokens(csrfToken, loggedTweetAuther.data.token)
        );

        expect(deleteTweet.status).toBe(204);
      });
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

async function createCSRFToken(request) {
  const response = await request.get('/auth/csrf-token');
  return response.data.csrfToken;
}

async function createNewUserAccount(request, csrfToken) {
  const userDetails = makeValidUserDetails();
  await request.post(
    '/auth/signup',
    userDetails,
    createHeadersWithTokens(csrfToken)
  );
  return { username: userDetails.username, password: userDetails.password };
}

function createHeadersWithTokens(csrfToken, token = '') {
  return {
    headers: {
      'talktalk-csrf-token': csrfToken,
      Authorization: `Bearer ${token}`,
    },
  };
}
