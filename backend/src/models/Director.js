const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Director = sequelize.define('Director', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nacionalidad: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'directores',
  timestamps: false,
});

module.exports = Director;
