const express = require('express');
const cors = require('cors');
const sequelize = require('./database');
require('./models'); // Carga las asociaciones entre modelos

const app = express();

app.use(cors());
app.use(express.json());

// Rutas disponibles hasta el momento
app.use('/api/generos', require('./routes/generos'));
app.use('/api/directores', require('./routes/directores'));

// TODO: agregar rutas de peliculas y actores

app.get('/', (req, res) => {
  res.json({ message: 'MovieDo API - en construccion', status: 'OK' });
});

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`🎬 MovieDo API corriendo en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar la base de datos:', err);
  });

module.exports = app;
