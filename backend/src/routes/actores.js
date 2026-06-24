const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { Actor, Actuacion, Pelicula, Genero, Director } = require('../models');

// GET /api/actores
router.get('/', async (req, res) => {
  try {
    const actores = await Actor.findAll({ order: [['nombre', 'ASC']] });
    res.json(actores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/actores/:id
router.get('/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id, {
      include: [{
        model: Actuacion,
        as: 'actuaciones',
        include: [{
          model: Pelicula,
          as: 'pelicula',
          include: [{ model: Genero, as: 'genero' }, { model: Director, as: 'director' }],
        }],
      }],
    });
    if (!actor) return res.status(404).json({ error: 'Actor no encontrado' });
    res.json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/actores
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  body('nacionalidad').optional().isString(),
  validate,
], async (req, res) => {
  try {
    const actor = await Actor.create(req.body);
    res.status(201).json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/actores/:id
router.put('/:id', [
  param('id').isInt(),
  body('nombre').optional().notEmpty(),
  validate,
], async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (!actor) return res.status(404).json({ error: 'Actor no encontrado' });
    await actor.update(req.body);
    res.json(actor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/actores/:id
router.delete('/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const actor = await Actor.findByPk(req.params.id);
    if (!actor) return res.status(404).json({ error: 'Actor no encontrado' });
    await actor.destroy();
    res.json({ message: 'Actor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
