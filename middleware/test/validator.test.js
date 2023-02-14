import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import { validate } from '../validator.js';
import * as validator from 'express-validator';

jest.mock('express-validator');

describe('Validator Middleware', () => {
  let req;
  let res;
  let next;
  beforeEach(() => {
    req = httpMocks.createMocks();
    res = httpMocks.createResponse();
    next = jest.fn();
  });

  it('calls next if there are no validation errors', async () => {
    validator.validationResult = jest.fn((req) => ({ isEmpty: () => true }));

    await validate(req, res, next);

    expect(next).toBeCalled();
  });

  it('returns 400 if there are validation errors', async () => {
    const errorMsg = faker.word.noun(1);
    validator.validationResult = jest.fn((req) => ({
      isEmpty: () => false,
      array: () => [{ msg: `${errorMsg}` }],
    }));

    await validate(req, res, next);

    expect(next).not.toBeCalled();
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData().message).toBe(`${errorMsg}`);
  });
});
