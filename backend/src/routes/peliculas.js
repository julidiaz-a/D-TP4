const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const validate = require('../middleware/validate');
const { Pelicula, Genero, Director, Actor, Resena, Actuacion } = require('../models');
const { Op } = require('sequelize');

// GET /api/peliculas
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate,
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.generoId) where.generoId = req.query.generoId;
    if (req.query.directorId) where.directorId = req.query.directorId;
    if (req.query.anio) where.anio = req.query.anio;
    if (req.query.destacada) where.destacada = req.query.destacada === 'true';
    if (req.query.search) {
      where.titulo = { [Op.like]: `%${req.query.search}%` };
    }

    const { count, rows } = await Pelicula.findAndCountAll({
      where,
      include: [
        { model: Genero, as: 'genero' },
        { model: Director, as: 'director' },
      ],
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/peliculas/:id
router.get('/:id', [
  param('id').isInt(),
  validate,
], async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id, {
      include: [
        { model: Genero, as: 'genero' },
        { model: Director, as: 'director' },
        { model: Resena, as: 'resenas' },
        {
          model: Actuacion, as: 'actuaciones',
          include: [{ model: Actor, as: 'actor' }],
        },
      ],
    });
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    res.json(pelicula);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/peliculas
router.post('/', [
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('anio').isInt({ min: 1888, max: 2100 }).withMessage('Año inválido'),
  body('duracion').isInt({ min: 1 }).withMessage('La duración debe ser un número positivo'),
  body('generoId').isInt().withMessage('Género inválido'),
  body('directorId').isInt().withMessage('Director inválido'),
  validate,
], async (req, res) => {
  try {
    const pelicula = await Pelicula.create(req.body);
    const peliculaConRelaciones = await Pelicula.findByPk(pelicula.id, {
      include: [
        { model: Genero, as: 'genero' },
        { model: Director, as: 'director' },
      ],
    });
    res.status(201).json(peliculaConRelaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/peliculas/:id
router.put('/:id', [
  param('id').isInt(),
  body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
  body('anio').optional().isInt({ min: 1888, max: 2100 }),
  body('duracion').optional().isInt({ min: 1 }),
  validate,
], async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    await pelicula.update(req.body);
    const updated = await Pelicula.findByPk(pelicula.id, {
      include: [
        { model: Genero, as: 'genero' },
        { model: Director, as: 'director' },
      ],
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/peliculas/:id
router.delete('/:id', [
  param('id').isInt(),
  validate,
], async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    await pelicula.destroy();
    res.json({ message: 'Película eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/peliculas/:id/resenas
router.get('/:id/resenas', [param('id').isInt(), validate], async (req, res) => {
  try {
    const resenas = await Resena.findAll({ where: { peliculaId: req.params.id } });
    res.json(resenas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/peliculas/:id/resenas
router.post('/:id/resenas', [
  param('id').isInt(),
  body('puntuacion').isInt({ min: 1, max: 10 }).withMessage('Puntuación debe ser entre 1 y 10'),
  body('comentario').optional().isString(),
  body('autor').optional().isString(),
  validate,
], async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) return res.status(404).json({ error: 'Película no encontrada' });
    const resena = await Resena.create({ ...req.body, peliculaId: req.params.id, fecha: new Date() });
    res.status(201).json(resena);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/peliculas/resenas/:id
router.put('/resenas/:id', [
  param('id').isInt(),
  body('puntuacion').optional().isInt({ min: 1, max: 10 }).withMessage('Puntuación debe ser entre 1 y 10'),
  body('comentario').optional().isString(),
  body('autor').optional().isString(),
  validate,
], async (req, res) => {
  try {
    const resena = await Resena.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
    const { puntuacion, comentario, autor } = req.body;
    await resena.update({
      ...(puntuacion !== undefined && { puntuacion }),
      ...(comentario !== undefined && { comentario }),
      ...(autor !== undefined && { autor }),
    });
    res.json(resena);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/resenas/:id
router.delete('/resenas/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const resena = await Resena.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' });
    await resena.destroy();
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/peliculas/:id/actuaciones
router.get('/:id/actuaciones', [param('id').isInt(), validate], async (req, res) => {
  try {
    const actuaciones = await Actuacion.findAll({
      where: { peliculaId: req.params.id },
      include: [{ model: Actor, as: 'actor' }],
    });
    res.json(actuaciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/peliculas/:id/actuaciones
router.post('/:id/actuaciones', [
  param('id').isInt(),
  body('actorId').isInt().withMessage('Actor inválido'),
  body('personaje').notEmpty().withMessage('El personaje es obligatorio'),
  validate,
], async (req, res) => {
  try {
    const actuacion = await Actuacion.create({ ...req.body, peliculaId: req.params.id });
    const withActor = await Actuacion.findByPk(actuacion.id, {
      include: [{ model: Actor, as: 'actor' }],
    });
    res.status(201).json(withActor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/actuaciones/:id
router.delete('/actuaciones/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const actuacion = await Actuacion.findByPk(req.params.id);
    if (!actuacion) return res.status(404).json({ error: 'Actuación no encontrada' });
    await actuacion.destroy();
    res.json({ message: 'Actuación eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
