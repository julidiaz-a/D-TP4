import { Link } from 'react-router-dom';
import '.index.css';

export default function MovieCard({ pelicula }) {
  const { id, titulo, anio, portada_url, calificacion, genero, director } = pelicula;

  return (
    <Link to={`/peliculas/${id}`} className="movie-card">
      <div className="movie-card-poster">
        {portada_url ? (
          <img src={portada_url} alt={titulo} loading="lazy" />
        ) : (
          <div className="movie-card-no-poster">
            <span>🎬</span>
          </div>
        )}
        <div className="movie-card-overlay">
          {anio && <span className="movie-card-year">{anio}</span>}
          {calificacion && (
            <div className="movie-card-rating">
              <span className="star">★</span> {calificacion}
            </div>
          )}
          <div className="movie-card-duration">
            {pelicula.duracion && <span>⏱ {pelicula.duracion} min</span>}
          </div>
        </div>
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{titulo}</h3>
        {director && (
          <p className="movie-card-director">{director.nombre} {director.apellido}</p>
        )}
        <div className="movie-card-tags">
          {genero && <span className="badge">{genero.nombre}</span>}
        </div>
      </div>
    </Link>
  );
}
