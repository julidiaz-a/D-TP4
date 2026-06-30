const sequelize = require('../database');
const { Pelicula, Genero, Director, Actor, Resena, Actuacion } = require('../models');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('🗑️  Base de datos limpiada');

  // Géneros
  const generos = await Genero.bulkCreate([
    { nombre: 'Drama' },
    { nombre: 'Thriller' },
    { nombre: 'Science Fiction' },
    { nombre: 'Crime' },
    { nombre: 'Romance' },
    { nombre: 'Horror' },
    { nombre: 'Action' },
    { nombre: 'Historical' },
    { nombre: 'Comedy' },
    { nombre: 'Animation' },
  ]);

  // Directores
  const directores = await Director.bulkCreate([
    { nombre: 'Christopher', apellido: 'Nolan', nacionalidad: 'Reino Unido' },
    { nombre: 'Céline', apellido: 'Sciamma', nacionalidad: 'Francia' },
    { nombre: 'Park', apellido: 'Chan-wook', nacionalidad: 'Corea del Sur' },
    { nombre: 'Denis', apellido: 'Villeneuve', nacionalidad: 'Canadá' },
    { nombre: 'Celine', apellido: 'Song', nacionalidad: 'Corea del Sur' },
    { nombre: 'Charlotte', apellido: 'Wells', nacionalidad: 'Reino Unido' },
    { nombre: 'Ari', apellido: 'Aster', nacionalidad: 'Estados Unidos' },
    { nombre: 'Alfonso', apellido: 'Cuarón', nacionalidad: 'México' },
  ]);

  // Actores
  const actores = await Actor.bulkCreate([
    { nombre: 'Cillian Murphy', nacionalidad: 'Irlanda' },
    { nombre: 'Emily Blunt', nacionalidad: 'Reino Unido' },
    { nombre: 'Adèle Haenel', nacionalidad: 'Francia' },
    { nombre: 'Noémie Merlant', nacionalidad: 'Francia' },
    { nombre: 'Choi Min-sik', nacionalidad: 'Corea del Sur' },
    { nombre: 'Timothée Chalamet', nacionalidad: 'Estados Unidos' },
    { nombre: 'Zendaya', nacionalidad: 'Estados Unidos' },
    { nombre: 'Teo Yoo', nacionalidad: 'Corea del Sur' },
    { nombre: 'Paul Mescal', nacionalidad: 'Irlanda' },
    { nombre: 'Toni Collette', nacionalidad: 'Australia' },
  ]);

  const [drama, thriller, sciFi, crime, romance, horror, action, historical, comedy, animation] = generos;
  const [nolan, sciamma, chanwook, villeneuve, song, wells, aster, cuaron] = directores;
  const [cillian, emily, adele, noemie, choi, timothee, zendaya, teo, paul, toni] = actores;

  // Películas
  const peliculas = await Pelicula.bulkCreate([
    {
      titulo: 'Oppenheimer',
      sinopsis: 'La historia del científico americano J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial. Narrada a través de una serie de viñetas no lineales, la película explora el peso moral de la creación y la destrucción.',
      anio: 2023,
      duracion: 180,
      portada_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
      destacada: true,
      calificacion: 9.2,
      generoId: drama.id,
      directorId: nolan.id,
    },
    {
      titulo: 'Portrait of a Lady on Fire',
      sinopsis: 'En la Bretaña del siglo XVIII, una pintora es encargada de hacer el retrato de boda de una joven noble. Entre las dos mujeres nace una historia de amor apasionada y fugaz.',
      anio: 2019,
      duracion: 120,
      portada_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
      destacada: true,
      calificacion: 9.0,
      generoId: romance.id,
      directorId: sciamma.id,
    },
    {
      titulo: 'Oldboy',
      sinopsis: 'Un hombre es misteriosamente secuestrado y encerrado en una habitación durante 15 años. Al ser liberado sin explicación, decide encontrar a su captor y descubrir la razón de su encarcelamiento.',
      anio: 2003,
      duracion: 120,
      portada_url: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
      destacada: true,
      calificacion: 8.9,
      generoId: thriller.id,
      directorId: chanwook.id,
    },
    {
      titulo: 'Dune: Part Two',
      sinopsis: 'Paul Atreides se une a los Fremen y comienza un viaje espiritual y marcial mientras intenta vengar la destrucción de su familia. Enfrenta una elección entre el amor de su vida y el destino del universo conocido.',
      anio: 2024,
      duracion: 166,
      portada_url: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=400&h=600&fit=crop',
      destacada: true,
      calificacion: 8.8,
      generoId: sciFi.id,
      directorId: villeneuve.id,
    },
    {
      titulo: 'Past Lives',
      sinopsis: 'Una historia de amor que abarca décadas y continentes, sobre dos amigos de infancia coreanos que se reencuentran en Nueva York y se preguntan qué podría haber sido su relación.',
      anio: 2023,
      duracion: 106,
      portada_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
      destacada: false,
      calificacion: 8.8,
      generoId: romance.id,
      directorId: song.id,
    },
    {
      titulo: 'Aftersun',
      sinopsis: 'Una hija adulta reflexiona sobre unas vacaciones compartidas con su padre cuando tenía 11 años. A través de recuerdos fragmentados e imágenes de video, surge un retrato íntimo de un hombre joven.',
      anio: 2022,
      duracion: 102,
      portada_url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=600&fit=crop',
      destacada: false,
      calificacion: 8.7,
      generoId: drama.id,
      directorId: wells.id,
    },
    {
      titulo: 'Hereditary',
      sinopsis: 'Tras la muerte de su misteriosa madre, una artista y su familia son acechados por presencias aterradoras que desencadenan eventos cada vez más perturbadores.',
      anio: 2018,
      duracion: 127,
      portada_url: 'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?w=400&h=600&fit=crop',
      destacada: false,
      calificacion: 8.7,
      generoId: horror.id,
      directorId: aster.id,
    },
    {
      titulo: 'Roma',
      sinopsis: 'Una trabajadora doméstica de la Ciudad de México enfrenta desafíos personales y sociales mientras trabaja para una familia de clase media en el barrio de Roma a comienzos de los años 70.',
      anio: 2018,
      duracion: 135,
      portada_url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=600&fit=crop',
      destacada: false,
      calificacion: 8.6,
      generoId: historical.id,
      directorId: cuaron.id,
    },
  ]);

  // Reseñas
  await Resena.bulkCreate([
    { peliculaId: peliculas[0].id, puntuacion: 10, comentario: 'Un logro deslumbrante. El trabajo más maduro y devastador de Nolan. Murphy es simplemente de otro mundo.', autor: 'Elena Vasquez', fecha: '2025-05-12' },
    { peliculaId: peliculas[0].id, puntuacion: 9, comentario: 'Cinematografía impresionante y actuaciones que te dejan sin palabras. Una obra maestra del cine contemporáneo.', autor: 'Carlos Mendez', fecha: '2025-04-03' },
    { peliculaId: peliculas[1].id, puntuacion: 10, comentario: 'Pura poesía visual. Sciamma crea algo verdaderamente único con esta historia de amor.', autor: 'María Torres', fecha: '2024-12-15' },
    { peliculaId: peliculas[2].id, puntuacion: 9, comentario: 'Una película que te persigue mucho después de verla. Chan-wook en su mejor momento.', autor: 'Diego Ruiz', fecha: '2025-01-20' },
    { peliculaId: peliculas[3].id, puntuacion: 8, comentario: 'Visualmente espectacular. La segunda parte supera a la primera en todos los sentidos.', autor: 'Ana González', fecha: '2025-03-08' },
  ]);

  // Actuaciones
  await Actuacion.bulkCreate([
    { peliculaId: peliculas[0].id, actorId: cillian.id, personaje: 'J. Robert Oppenheimer' },
    { peliculaId: peliculas[0].id, actorId: emily.id, personaje: 'Katherine Oppenheimer' },
    { peliculaId: peliculas[1].id, actorId: adele.id, personaje: 'Héloïse' },
    { peliculaId: peliculas[1].id, actorId: noemie.id, personaje: 'Marianne' },
    { peliculaId: peliculas[2].id, actorId: choi.id, personaje: 'Oh Dae-su' },
    { peliculaId: peliculas[3].id, actorId: timothee.id, personaje: 'Paul Atreides' },
    { peliculaId: peliculas[3].id, actorId: zendaya.id, personaje: 'Chani' },
    { peliculaId: peliculas[4].id, actorId: teo.id, personaje: 'Hae Sung' },
    { peliculaId: peliculas[6].id, actorId: toni.id, personaje: 'Annie Graham' },
    { peliculaId: peliculas[5].id, actorId: paul.id, personaje: 'Calum' },
  ]);

  console.log('🌱 Seed completado con éxito');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
