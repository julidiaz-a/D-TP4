const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const validate = require('../middleware/validate');
const { Genero, Pelicula } = require('../models');

// GET /api/generos
router.get('/', async (req, res) => {
  try {
    const generos = await Genero.findAll({ order: [['nombre', 'ASC']] });
    res.json(generos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/generos
router.post('/', [
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  validate,
], async (req, res) => {
  try {
    const genero = await Genero.create({ nombre: req.body.nombre });
    res.status(201).json(genero);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Ya existe un género con ese nombre' });
    }
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/generos/:id
router.put('/:id', [
  param('id').isInt(),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
  validate,
], async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);
    if (!genero) return res.status(404).json({ error: 'Género no encontrado' });
    await genero.update({ nombre: req.body.nombre });
    res.json(genero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/generos/:id
router.delete('/:id', [param('id').isInt(), validate], async (req, res) => {
  try {
    const genero = await Genero.findByPk(req.params.id);
    if (!genero) return res.status(404).json({ error: 'Género no encontrado' });
    const count = await Pelicula.count({ where: { generoId: genero.id } });
    if (count > 0) {
      return res.status(400).json({ error: 'No se puede eliminar un género con películas asociadas' });
    }
    await genero.destroy();
    res.json({ message: 'Género eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
