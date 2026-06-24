const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Genero = sequelize.define('Genero', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'generos',
  timestamps: false,
});

module.exports = Genero;
