const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Actuacion = sequelize.define('Actuacion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personaje: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'actuaciones',
  timestamps: false,
});

module.exports = Actuacion;
