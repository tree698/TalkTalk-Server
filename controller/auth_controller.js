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
  setToken(res, token);

  const userInfo = {
    id: user.dataValues.id,
    username: user.dataValues.username,
    photo: user.dataValues.photo,
  };
  res.status(200).json({ token, userInfo });
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
  res.cookie('token', token, options);
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

  const userInfo = {
    id: user.dataValues.id,
    username: user.dataValues.username,
    photo: user.dataValues.photo,
  };
  res.status(200).json({ token: req.token, userInfo });
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  const user = await userRepository.findById(id);
  if (!user) {
    return res.status(404).json({ message: `Usesr not found: ${id}` });
  }
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
