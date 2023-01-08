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
      tweetRepository.getAll = (workId) => allTweets;

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
    it('returns 201 and created tweet when text is provided', async () => {
      const text = faker.word.noun(2);
      const req = httpMocks.createRequest({
        body: { text },
      });
      const res = httpMocks.createResponse();
      const createdTweet = [{ text: faker.word.noun(1) }];
      tweetRepository.create = () => createdTweet;

      await tweetController.createTweet(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(createdTweet);
      expect(mockedSocket.emit).toBeCalledTimes(1);
      //   expect(mockedSocket.emit).toEqual(createdTweet);
    });
  });

  describe('deleteTweet', () => {
    it('returns 404 when id does not exists', async () => {
      const id = faker.random.alphaNumeric(12);
      const req = httpMocks.createRequest({
        params: { id },
      });
      const res = httpMocks.createResponse();
      tweetRepository.getById = () => undefined;

      await tweetController.deleteTweet(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData().message).toBe(`Tweet not found: ${id}`);
    });
  });

  it("returns 403 when a user try to delete other's tweet", async () => {
    const id = faker.random.alphaNumeric(12);
    const userId = faker.random.alphaNumeric(10);
    const tweet = [{ userId }];
    const req = httpMocks.createRequest({
      params: { id },
      userId: faker.random.alpha(3),
    });
    const res = httpMocks.createResponse();
    tweetRepository.getById = () => tweet;

    await tweetController.deleteTweet(req, res);

    expect(res.statusCode).toBe(403);
  });

  it("returns 204 when a user try to delete the user's tweet", async () => {
    const id = faker.random.alphaNumeric(12);
    const tweet = { text: 'welcome' };
    const req = httpMocks.createRequest({
      params: { id },
    });
    const res = httpMocks.createResponse();
    tweetRepository.getById = () => tweet;
    tweetRepository.remove = jest.fn(() => {});

    await tweetController.deleteTweet(req, res);

    expect(res.statusCode).toBe(204);
    expect(tweetRepository.remove).toBeCalledTimes(1);
  });
});
