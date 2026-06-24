const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Actor = sequelize.define('Actor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nacionalidad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'actores',
  timestamps: false,
});

module.exports = Actor;
