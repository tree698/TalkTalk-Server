import { getSocketIO } from '../connection/socket.js';
import * as tweetRepository from '../data/tweet_data.js';

export async function getTweets(req, res) {
  const { username, workId } = req.query;
  const data = await (username
    ? tweetRepository.getAllByUsername(username, workId)
    : tweetRepository.getAll(workId));
  res.status(200).json(data);
}

export async function createTweet(req, res) {
  const { text } = req.body;
  const workId = req.query.workId;
  const tweet = await tweetRepository.create(text, req.userId, workId);
  res.status(201).json(tweet);
  getSocketIO().emit('tweets', tweet);
}

export async function deleteTweet(req, res) {
  const { id } = req.params;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  res.sendStatus(204);
}
