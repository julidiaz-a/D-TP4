const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Resena = sequelize.define('Resena', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 10,
    },
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  autor: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Anónimo',
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'resenas',
  timestamps: false,
});

module.exports = Resena;
