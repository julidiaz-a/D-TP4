const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pelicula = sequelize.define('Pelicula', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sinopsis: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  anio: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duracion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duración en minutos',
  },
  portada_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  destacada: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  calificacion: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  tableName: 'peliculas',
  timestamps: false,
});

module.exports = Pelicula;
