import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPeliculas } from '../api';
import MovieCard from '../components/MovieCard';
import '../index.css';

export default function Home() {
  const [destacadas, setDestacadas] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [destRes, recRes] = await Promise.all([
          getPeliculas({ destacada: true, limit: 5 }),
          getPeliculas({ limit: 8 }),
        ]);
        setDestacadas(destRes.data || []);
        setRecientes(recRes.data || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content container">
          <p className="hero-eyebrow">Las mejores peliculas</p>
          <h1 className="hero-title">
            Cine que<br />
            <span className="hero-title-accent">permanece.</span>
          </h1>
          <p className="hero-subtitle">
            Una colección de peliculas.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <div className="hero-search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar por título, director o género..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="hero-search-input"
              />
            </div>
          </form>
        </div>
        <div className="hero-bg" aria-hidden="true">
          {destacadas.slice(0, 3).map(p => (
            <div key={p.id} className="hero-bg-img" style={{ backgroundImage: `url(${p.portada_url})` }} />
          ))}
        </div>
      </section>
     
      {/* Destacadas */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Películas Destacadas</h2>
          <a href="/catalogo" className="section-link">Ver catálogo completo →</a>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : destacadas.length > 0 ? (
          <div className="movies-grid">
            {destacadas.map(p => <MovieCard key={p.id} pelicula={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p>No hay películas destacadas aún.</p>
          </div>
        )}
      </section>

      {/* Recientes */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Últimas incorporadas</h2>
          <a href="/catalogo" className="section-link">Ver todas →</a>
        </div>
        {loading ? null : recientes.length > 0 ? (
          <div className="movies-grid movies-grid-8">
            {recientes.map(p => <MovieCard key={p.id} pelicula={p} />)}
          </div>
        ) : (
          <div className="empty-state">
            <p>Aún no hay películas. <a href="/peliculas/nueva" style={{ color: 'var(--accent)' }}>Agregar la primera →</a></p>
          </div>
        )}
      </section>
    </div> 
  );
}
