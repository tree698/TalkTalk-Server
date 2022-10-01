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
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  brush: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING(256),
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
    'originalName',
    'fileName',
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

export async function getAll(limitInt, offsetInt) {
  return Work.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    limit: limitInt,
    offset: offsetInt,
  });
}

export async function getAllByUsername(username, limitInt, offsetInt) {
  return Work.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    limit: limitInt,
    offset: offsetInt,
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

export async function create(
  title,
  description,
  brush,
  originalName,
  fileName,
  userId
) {
  return Work.create({
    title,
    description,
    brush,
    originalName,
    fileName,
    userId,
  }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function remove(id) {
  return Work.findByPk(id) //
    .then((data) => data.destroy());
}
