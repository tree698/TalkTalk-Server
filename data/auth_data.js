import SQ from 'sequelize';
import { sequelize } from '../db/database.js';

const DataTypes = SQ.DataTypes;
export const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING(128),
    },
  },
  { timestamps: false }
);

export async function findByUsername(username) {
  return User.findOne({ where: { username } });
}

export async function findById(id) {
  return User.findByPk(id);
}

export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.id);
}

export async function remove(id) {
  return User.findByPk(id) //
    .then((user) => user.destroy());
}
