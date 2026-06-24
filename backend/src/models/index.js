const Pelicula = require('./Pelicula');
const Genero = require('./Genero');
const Director = require('./Director');
const Actor = require('./Actor');
const Resena = require('./Resena');
const Actuacion = require('./Actuacion');

// Pelicula - Genero (N:1)
Pelicula.belongsTo(Genero, { foreignKey: 'generoId', as: 'genero' });
Genero.hasMany(Pelicula, { foreignKey: 'generoId', as: 'peliculas' });

// Pelicula - Director (N:1)
Pelicula.belongsTo(Director, { foreignKey: 'directorId', as: 'director' });
Director.hasMany(Pelicula, { foreignKey: 'directorId', as: 'peliculas' });

// Pelicula - Resena (1:N)
Pelicula.hasMany(Resena, { foreignKey: 'peliculaId', as: 'resenas', onDelete: 'CASCADE' });
Resena.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });

// Pelicula - Actor (M:N) via Actuacion
Pelicula.hasMany(Actuacion, { foreignKey: 'peliculaId', as: 'actuaciones', onDelete: 'CASCADE' });
Actuacion.belongsTo(Pelicula, { foreignKey: 'peliculaId', as: 'pelicula' });

Actor.hasMany(Actuacion, { foreignKey: 'actorId', as: 'actuaciones' });
Actuacion.belongsTo(Actor, { foreignKey: 'actorId', as: 'actor' });

module.exports = { Pelicula, Genero, Director, Actor, Resena, Actuacion };
