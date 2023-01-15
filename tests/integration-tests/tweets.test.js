import axios from 'axios';
import { startServer, stopServer } from '../../app.js';
import { faker } from '@faker-js/faker';
import {
  createCSRFToken,
  createNewUserAccount,
  createHeadersWithTokens,
} from './auth_utils.js';

describe('Tweets APIs', () => {
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
      expect(res.data.message).toMatch('text should be at least 2 characters');
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
