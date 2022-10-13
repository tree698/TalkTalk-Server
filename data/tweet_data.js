import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth_data.js';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Tweet = sequelize.define('tweet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  workId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
Tweet.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'workId',
    'createdAt',
    'userId',
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.photo'), 'photo'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export async function getAll(workId) {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC, where: { workId } });
}

export async function getAllByUsername(username, workId) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    where: { workId },
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(text, userId, workId) {
  return Tweet.create({ text, userId, workId }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function remove(id) {
  return Tweet.findByPk(id) //
    .then((tweet) => tweet.destroy());
}
