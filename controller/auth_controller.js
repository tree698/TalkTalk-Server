import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth_data.js';
import { config } from '../config.js';

export async function signup(req, res) {
  const { username, password, email, photo } = req.body;
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res
      .status(409)
      .json({ message: `${username} already exists. Try again!` });
  }
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    email,
    photo,
  });
  // signup 후 자동 로그인 방지
  // const token = createJwtToken(userId);
  // res.status(201).json({ token, username });
  res.status(201).json({ username });
}

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res
      .status(401)
      .json({ message: 'Invalid username or password. Try again!' });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res
      .status(401)
      .json({ message: 'Invalid username or password. Try again!' });
  }
  const token = createJwtToken(user.id);

  // 브라우저에서만 읽히도록 하기 위해 http-only로 하여 cookie header에 token 전달
  setToken(res, token);
  // 브라우저 이외 다른 client도 사용하도록 body에도 token 전달
  res.status(200).json({ token, username });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

function setToken(res, token) {
  const options = {
    maxAge: config.jwt.expiresInSec * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  };
  res.cookie('token', token, options); // HTTP-ONLY 🍪
}

export async function logout(req, res, next) {
  res.cookie('token', '');
  res.status(200).json({ message: 'User has been logged out' });
}

export async function me(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await userRepository.findById(id);
  if (!user) {
    return res.status(404).json({ message: `Usesr not found: ${id}` });
  }
  // if (user.userId !== req.userId) {
  //   return res.sendStatus(403);
  // }
  await userRepository.remove(id);
  res.sendStatus(204);
}

export async function csrfToken(req, res, next) {
  const csrfToken = await generateCSRFToken();
  res.status(200).json({ csrfToken });
}

async function generateCSRFToken() {
  return bcrypt.hash(config.csrf.plainToken, 1);
}
