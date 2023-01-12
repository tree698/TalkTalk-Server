export default class TweetController {
  constructor(tweetRepository, socketIo) {
    this.tweetRepository = tweetRepository;
    this.socketIo = socketIo;
  }

  getTweets = async (req, res) => {
    const { username, workId } = req.query;
    const data = await (username
      ? this.tweetRepository.getAllByUsername(username, workId)
      : this.tweetRepository.getAll(workId));
    res.status(200).json(data);
  };

  createTweet = async (req, res) => {
    const { text } = req.body;
    const workId = req.query.workId;
    const tweet = await this.tweetRepository.create(text, req.userId, workId);
    res.status(201).json(tweet);
    this.socketIo().emit('tweets', tweet);
  };

  // 사용 안함
  deleteTweet = async (req, res) => {
    const { id } = req.params;
    const tweet = await this.tweetRepository.getById(id);
    if (!tweet) {
      return res.status(404).json({ message: `Tweet not found: ${id}` });
    }
    if (tweet.userId !== req.userId) {
      return res.sendStatus(403);
    }
    await this.tweetRepository.remove(id);
    res.sendStatus(204);
  };
}
