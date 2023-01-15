import axios from 'axios';
import { startServer, stopServer } from '../../app';
import {
  createCSRFToken,
  createHeadersWithTokens,
  createNewUserAccount,
  postWork,
} from './auth_utils';
import FormData from 'form-data';
import { faker } from '@faker-js/faker';

describe('Work APIs', () => {
  let server;
  let request;
  let csrfToken;
  let formData;
  beforeAll(async () => {
    server = await startServer();
    formData = new FormData();
    formData.append('file', 'abc.png');
    request = axios.create({
      baseURL: `http://localhost:${server.address().port}`,
      validateStatus: null,
    });
    csrfToken = await createCSRFToken(request);
  });

  afterAll(async () => {
    await stopServer(server);
  });

  describe('POST to /work', () => {
    it('returns 201 and work details when provided work details are valid', async () => {
      const title = faker.word.noun(2);
      const description = faker.word.noun(5);
      const brush = faker.word.noun(2);
      const originalName = faker.word.noun(1);
      const fileName = faker.word.noun(1);
      const createdUser = await createNewUserAccount(request, csrfToken);
      const loggedInUser = await request.post(
        '/auth/login',
        createdUser,
        createHeadersWithTokens(csrfToken)
      );

      const res = await request.post(
        '/work',
        { title, description, brush, originalName, fileName },
        createHeadersWithTokens(csrfToken, loggedInUser.data.token)
      );

      expect(res.status).toBe(201);
      expect(res.data).toMatchObject({
        title,
        description,
        brush,
        originalName,
        fileName,
      });
    });
  });

  describe('GET to /work/carousel', () => {
    it('returns 200 and works under the given condition with the query of both limit and offset', async () => {
      const createdUser = await createNewUserAccount(request, csrfToken);
      const loggedInUser = await request.post(
        '/auth/login',
        createdUser,
        createHeadersWithTokens(csrfToken)
      );
      await postWork(faker, request, csrfToken, loggedInUser);
      await postWork(faker, request, csrfToken, loggedInUser);
      await postWork(faker, request, csrfToken, loggedInUser);

      const res = await request.get(
        '/work/carousel?limit=1&offset=1',
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(200);
      expect(res.data.length).toBe(1);
    });
  });

  describe('GET to /work/search', () => {
    it('returns 200 and search results when limit, offset and search term are provided', async () => {
      const searchTerm = faker.word.noun(1);
      const createdUser = await createNewUserAccount(request, csrfToken);
      const loggedInUser = await request.post(
        '/auth/login',
        createdUser,
        createHeadersWithTokens(csrfToken)
      );
      await postWork(faker, request, csrfToken, loggedInUser);
      await postWork(faker, request, csrfToken, loggedInUser);
      await postWork(faker, request, csrfToken, loggedInUser);
      await request.post(
        '/work',
        {
          title: searchTerm,
          description: faker.word.noun(4),
          brush: faker.word.noun(3),
          originalName: faker.word.noun(2),
          fileName: faker.word.noun(1),
        },
        createHeadersWithTokens(csrfToken, loggedInUser.data.token)
      );

      const res = await request.get(
        `/work/search?limit=40&offset=0&searchTerm=${searchTerm}`,
        createHeadersWithTokens(csrfToken)
      );

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThan(0);
    });
  });

  describe('DELETE to /work/:id', () => {
    it('returns 404 when work id does not exist', async () => {
      const user = await createNewUserAccount(request, csrfToken);
      const loggedUser = await request.post(
        '/auth/login',
        user,
        createHeadersWithTokens(csrfToken)
      );

      const res = await request.delete(
        '/work/nonexistentId',
        createHeadersWithTokens(csrfToken, loggedUser.data.token)
      );

      expect(res.status).toBe(404);
      expect(res.data.message).toBe('Image not found: nonexistentId');
    });

    it('returns 403 and the work should still be there when work id exists but the work does not belong to the user', async () => {
      const workAuthor = await createNewUserAccount(request, csrfToken);
      const anotherUser = await createNewUserAccount(request, csrfToken);
      const loggedWorkAuther = await request.post(
        '/auth/login',
        workAuthor,
        createHeadersWithTokens(csrfToken)
      );
      const loggedAnotherUser = await request.post(
        '/auth/login',
        anotherUser,
        createHeadersWithTokens(csrfToken)
      );
      const postedWork = await postWork(
        faker,
        request,
        csrfToken,
        loggedWorkAuther
      );

      const deleteWork = await request.delete(
        `/work/${postedWork.data.id}`,
        createHeadersWithTokens(csrfToken, loggedAnotherUser.data.token)
      );

      const checkWorkResult = await request.get(
        `/work?limit=100&offset=0`,
        createHeadersWithTokens(csrfToken, loggedWorkAuther.data.token)
      );

      expect(deleteWork.status).toBe(403);
      expect(checkWorkResult.status).toBe(200);
      expect(checkWorkResult.data.length).toBeGreaterThan(0);
    });

    it('returns 204 and the work should be deleted when work id exists and the work belongs to the user', async () => {
      const workAuthor = await createNewUserAccount(request, csrfToken);
      const loggedWorkAuther = await request.post(
        '/auth/login',
        workAuthor,
        createHeadersWithTokens(csrfToken)
      );
      const postedWork = await postWork(
        faker,
        request,
        csrfToken,
        loggedWorkAuther
      );

      const deleteWork = await request.delete(
        `/work/${postedWork.data.id}`,
        createHeadersWithTokens(csrfToken, loggedWorkAuther.data.token)
      );

      expect(deleteWork.status).toBe(204);
    });
  });

  describe('GET to /tweets', () => {
    it('returns 200 and all tweets when username is not specified in the query', async () => {
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
      await postWork(faker, request, csrfToken, loggedUser1);
      await postWork(faker, request, csrfToken, loggedUser2);

      const res = await request.get(
        `/work?limit=100&offset=0`,
        createHeadersWithTokens(csrfToken, loggedUser1.data.token)
      );

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThanOrEqual(2);
    });

    it('returns 200 and only works of given user when username is specified in the query', async () => {
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
      await postWork(faker, request, csrfToken, loggedUser1);
      await postWork(faker, request, csrfToken, loggedUser2);

      const res = await request.get(
        `/work?username=${user1.username}&limit=100&offset=0`,
        createHeadersWithTokens(csrfToken, loggedUser1.data.token)
      );

      expect(res.status).toBe(200);
      expect(res.data.length).toEqual(1);
    });
  });
});
