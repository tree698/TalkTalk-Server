import { faker } from '@faker-js/faker';
import httpMocks from 'node-mocks-http';
import TweetController from '../tweet_controller';

// 모듈 전체를 mocking 할 필요가 있는지 생각해 보자
// import * as tweetRepository from '../../data/tweet_data.js';
// import { getSocketIO } from '../../connection/socket';
// jest.mock('../../data/tweet_data.js'); => JS 특징 이용
// jest.mock('../../connection/socket') => emit 함수만 사용하고 있다

describe('TweetController', () => {
  let tweetRepository;
  let mockedSocket;
  let tweetController;
  beforeEach(() => {
    tweetRepository = {};
    mockedSocket = { emit: jest.fn() };
    tweetController = new TweetController(tweetRepository, () => mockedSocket);
  });

  describe('getTweets', () => {
    it('returns all tweets when username is not provided', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const allTweets = [
        { text: faker.word.noun(1) },
        { text: faker.word.noun(1) },
      ];
      tweetRepository.getAll = () => allTweets;

      await tweetController.getTweets(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(allTweets);
    });

    it("returns the username's tweets when username is provided", async () => {
      const username = faker.word.noun(1);
      const req = httpMocks.createRequest({
        query: {
          username,
        },
      });
      const res = httpMocks.createResponse();
      const userTweets = [{ text: faker.word.noun(1) }];
      tweetRepository.getAllByUsername = () => userTweets;

      await tweetController.getTweets(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(userTweets);
    });
  });

  describe('createTweet', () => {
    let text, userId, workId, req, res;
    beforeEach(() => {
      text = faker.word.noun(3);
      userId = faker.random.alphaNumeric(10);
      workId = faker.random.alphaNumeric(10);
      req = httpMocks.createRequest({
        body: { text },
        query: { workId },
        userId,
      });
      res = httpMocks.createResponse();
    });

    it('returns 201 and created tweet object including userId and workId', async () => {
      // mock 함수로 만들어야 호출 여부 등을 테스트할 수 있다
      tweetRepository.create = jest.fn((text, userId, workId) => ({
        text,
        userId,
        workId,
      }));

      await tweetController.createTweet(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({
        text,
        userId,
        workId,
      });
      expect(tweetRepository.create).toBeCalledTimes(1);
      expect(tweetRepository.create).toBeCalledWith(text, userId, workId);
    });

    it('should send an event to a web socket channel', async () => {
      tweetRepository.create = jest.fn((text, userId, workId) => ({
        text,
        userId,
        workId,
      }));

      await tweetController.createTweet(req, res);

      expect(mockedSocket.emit).toHaveBeenCalledWith('tweets', {
        text,
        userId,
        workId,
      });
    });
  });

  describe('deleteTweet', () => {
    let tweetId, authorId, req, res;
    beforeEach(() => {
      tweetId = faker.random.alphaNumeric(12);
      authorId = faker.random.alphaNumeric(12);
      req = httpMocks.createRequest({
        params: { id: tweetId },
        userId: authorId,
      });
      res = httpMocks.createResponse();
    });

    it('returns 404 and should not update the repository if id does not exists', async () => {
      tweetRepository.getById = () => undefined;
      tweetRepository.remove = jest.fn();

      await tweetController.deleteTweet(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe(`Tweet not found: ${tweetId}`);
      expect(tweetRepository.remove).not.toHaveBeenCalled();
    });

    it('returns 403 and should not update the repository if the tweet does not belong to the user', async () => {
      tweetRepository.getById = () => ({
        userId: faker.random.alphaNumeric(10),
      });
      tweetRepository.remove = jest.fn();

      await tweetController.deleteTweet(req, res);

      expect(res.statusCode).toBe(403);
      expect(tweetRepository.remove).toBeCalledTimes(0);
    });

    it('returns 204 and remove the tweet from the repository if the tweet exists', async () => {
      tweetRepository.getById = () => ({ userId: authorId });
      // tweetRepository.remove = jest.fn(() => {});
      tweetRepository.remove = jest.fn();

      await tweetController.deleteTweet(req, res);

      expect(res.statusCode).toBe(204);
      expect(tweetRepository.remove).toBeCalledTimes(1);
      expect(tweetRepository.remove).toBeCalledWith(tweetId);
    });
  });
});
