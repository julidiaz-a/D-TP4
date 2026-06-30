# MovieDo — Frontend

Cliente React para la app MovieDo.

## Instalación

```bash
cd frontend
npm install
```

## Ejecutar

```bash
npm start
```

El cliente corre en `http://localhost:3000`

> Requiere que el backend esté corriendo en `http://localhost:3001`

## Vistas disponibles

| Ruta | Vista |
|------|-------|
| `/` | Home con héroe, películas destacadas y últimas incorporadas |
| `/catalogo` | Catálogo con filtros por género, director, año y ordenamiento |
| `/peliculas/:id` | Detalle de película con elenco y reseñas |
| `/peliculas/nueva` | Formulario para crear película |
| `/peliculas/:id/editar` | Formulario para editar película |
| `/admin` | Panel de administración (películas, actores, directores, géneros) |

## Power-ups implementados

- ✅ 5+ entidades: Película, Género, Director, Actor, Reseña + Actuación (asociativa)
- ✅ 5+ vistas funcionales
