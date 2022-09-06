import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth_data.js';

const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

const Work = sequelize.define('work', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  brush: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
Work.belongsTo(User);

const INCLUDE_USER = {
  attributes: [
    'id',
    'title',
    'description',
    'brush',
    'image',
    'createdAt',
    'userId',
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.url'), 'url'],
  ],
  include: {
    model: User,
    attributes: [],
  },
};

const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
};

export async function getAll() {
  return Work.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
  return Work.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username },
    },
  });
}

export async function getById(id) {
  return Work.findOne({
    where: { id },
    ...INCLUDE_USER,
  });
}

export async function create(title, description, brush, image, userId) {
  return Work.create({ title, description, brush, image, userId }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function remove(id) {
  return Work.findByPk(id) //
    .then((data) => data.destroy());
}
