import { faker } from '@faker-js/faker';

export function makeValidUserDetails() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    photo: faker.internet.avatar(),
  };
}

export async function createCSRFToken(request) {
  const response = await request.get('/auth/csrf-token');
  return response.data.csrfToken;
}

export async function createNewUserAccount(request, csrfToken) {
  const userDetails = makeValidUserDetails();
  await request.post(
    '/auth/signup',
    userDetails,
    createHeadersWithTokens(csrfToken)
  );
  return { username: userDetails.username, password: userDetails.password };
}

export function createHeadersWithTokens(csrfToken, token = '') {
  return {
    headers: {
      'talktalk-csrf-token': csrfToken,
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function postWork(faker, request, csrfToken, loggedInUser) {
  return await request.post(
    '/work',
    {
      title: faker.word.noun(2),
      description: faker.word.noun(5),
      brush: faker.word.noun(2),
      originalName: faker.word.noun(1),
      fileName: faker.word.noun(1),
    },
    createHeadersWithTokens(csrfToken, loggedInUser.data.token)
  );
}
