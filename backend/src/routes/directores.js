const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { Director, Pelicula, Genero } = require('../models');

// GET /api/directores
router.get('/', async (req, res) => {
  try {
    const directores = await Director.findAll({ order: [['apellido', 'ASC']] });
    res.json(directores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/directores/:id
router.get('/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const director = await Director.findByPk(req.params.id, {
      include: [{ model: Pelicula, as: 'peliculas', include: [{ model: Genero, as: 'genero' }] }],
    });
    if (!director) return res.status(404).json({ error: 'Director no encontrado' });
    res.json(director);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/directores
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('apellido').notEmpty().withMessage('El apellido es obligatorio'),
  body('nacionalidad').optional().isString(),
  validate,
], async (req, res) => {
  try {
    const director = await Director.create(req.body);
    res.status(201).json(director);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/directores/:id
router.put('/:id', [
  param('id').isInt(),
  body('nombre').optional().notEmpty(),
  body('apellido').optional().notEmpty(),
  validate,
], async (req, res) => {
  try {
    const director = await Director.findByPk(req.params.id);
    if (!director) return res.status(404).json({ error: 'Director no encontrado' });
    await director.update(req.body);
    res.json(director);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/directores/:id
router.delete('/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const director = await Director.findByPk(req.params.id);
    if (!director) return res.status(404).json({ error: 'Director no encontrado' });
    await director.destroy();
    res.json({ message: 'Director eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
