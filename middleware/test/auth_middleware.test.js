import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { isAuth } from '../auth_middleware';
import * as userRepository from '../../data/auth_data.js';

jest.mock('jsonwebtoken');
jest.mock('../../data/auth_data.js');

describe('Auth Middleware', () => {
  it('returns 401 for the request without authorization header', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/tweet',
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await isAuth(req, res, next);

    assertion(res, next);
  });

  it('returns 401 for the request with unsupported authorization header', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/tweet',
      headers: { authorization: 'sef' },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await isAuth(req, res, next);

    assertion(res, next);
  });

  it('returns 401 for the request with invalid token', async () => {
    const fakeToken = faker.random.alpha(128);
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/tweet',
      headers: { authorization: `Bearer ${fakeToken}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(new Error('bad request'), undefined);
    });

    await isAuth(req, res, next);

    assertion(res, next);
  });

  it('returns 401 when cannot find a user by id from JWT', async () => {
    const fakeToken = faker.random.alpha(128);
    const fakeUser = faker.word.noun(1);
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/tweet',
      headers: { authorization: `Bearer ${fakeToken}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(undefined, { id: fakeUser });
    });
    userRepository.findById = jest.fn((testId) => Promise.resolve(undefined));

    await isAuth(req, res, next);

    assertion(res, next);
  });

  it('passes the request with valid authorizaton and token', async () => {
    const fakeToken = faker.random.alpha(128);
    const fakeId = faker.random.alpha(12);
    const req = httpMocks.createRequest({
      method: 'GET',
      url: '/tweet',
      headers: { authorization: `Bearer ${fakeToken}` },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(undefined, { id: fakeId });
    });
    userRepository.findById = jest.fn((testId) =>
      Promise.resolve({ id: testId })
    );

    await isAuth(req, res, next);

    expect(req).toMatchObject({ userId: fakeId });
    expect(next).toHaveBeenCalledTimes(1);
  });
});

function assertion(response, next) {
  expect(response.statusCode).toBe(401);
  expect(response._getJSONData().message).toBe('Authentication Error');
  expect(next).not.toBeCalled();
}
