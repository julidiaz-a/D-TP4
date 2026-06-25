import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPeliculas } from '../api';
import { useApp } from '../context/AppContext';
import MovieCard from '../components/MovieCard';
import './Catalogo.css';

const SORT_OPTIONS = [
  { value: 'calificacion', label: 'Calificación' },
  { value: 'anio_desc', label: 'Más recientes' },
  { value: 'anio_asc', label: 'Más antiguas' },
  { value: 'titulo', label: 'Título A-Z' },
];

export default function Catalogo() {
  const { generos, directores } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [peliculas, setPeliculas] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters from URL
  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const generoId = searchParams.get('generoId') || '';
  const directorId = searchParams.get('directorId') || '';
  const anio = searchParams.get('anio') || '';
  const sort = searchParams.get('sort') || 'calificacion';

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set(key, val);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (generoId) params.generoId = generoId;
      if (directorId) params.directorId = directorId;
      if (anio) params.anio = anio;

      const res = await getPeliculas(params);
      let data = res.data || [];

      // Client-side sort
      if (sort === 'calificacion') data = [...data].sort((a, b) => (b.calificacion || 0) - (a.calificacion || 0));
      else if (sort === 'anio_desc') data = [...data].sort((a, b) => b.anio - a.anio);
      else if (sort === 'anio_asc') data = [...data].sort((a, b) => a.anio - b.anio);
      else if (sort === 'titulo') data = [...data].sort((a, b) => a.titulo.localeCompare(b.titulo));

      setPeliculas(data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch {}
    setLoading(false);
  }, [page, search, generoId, directorId, anio, sort]);

  useEffect(() => { load(); }, [load]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const hasFilters = search || generoId || directorId || anio;

  return (
    <div className="catalogo-page container">
      <div className="catalogo-layout">
        {/* Sidebar filters */}
        <aside className="catalogo-sidebar">
          <div className="filter-section">
            <h3 className="filter-heading">FILTROS</h3>

            <div className="filter-group">
              <label className="filter-label">Género</label>
              <div className="filter-list">
                <button
                  className={`filter-item ${!generoId ? 'active' : ''}`}
                  onClick={() => updateParam('generoId', '')}
                >Todos</button>
                {generos.map(g => (
                  <button
                    key={g.id}
                    className={`filter-item ${generoId === String(g.id) ? 'active' : ''}`}
                    onClick={() => updateParam('generoId', g.id)}
                  >{g.nombre}</button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Director</label>
              <select
                className="form-control"
                value={directorId}
                onChange={e => updateParam('directorId', e.target.value)}
              >
                <option value="">Todos</option>
                {directores.map(d => (
                  <option key={d.id} value={d.id}>{d.nombre} {d.apellido}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Año</label>
              <select
                className="form-control"
                value={anio}
                onChange={e => updateParam('anio', e.target.value)}
              >
                <option value="">Todos</option>
                {Array.from({ length: 35 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Ordenar por</label>
              <select
                className="form-control"
                value={sort}
                onChange={e => updateParam('sort', e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {hasFilters && (
              <button className="btn btn-ghost btn-sm" onClick={clearFilters} style={{ marginTop: 4 }}>
                ✕ Limpiar filtros
              </button>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="catalogo-main">
          <div className="catalogo-header">
            <h2 className="catalogo-title">
              {search ? `Resultados para "${search}"` : 'Catálogo'}
            </h2>
            <span className="catalogo-count">{total} película{total !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : peliculas.length > 0 ? (
            <>
              <div className="catalogo-grid">
                {peliculas.map(p => <MovieCard key={p.id} pelicula={p} />)}
              </div>
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn"
                    disabled={page <= 1}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('page', page - 1);
                      setSearchParams(next);
                    }}
                  >‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p2 => (
                    <button
                      key={p2}
                      className={`page-btn ${p2 === page ? 'active' : ''}`}
                      onClick={() => {
                        const next = new URLSearchParams(searchParams);
                        next.set('page', p2);
                        setSearchParams(next);
                      }}
                    >{p2}</button>
                  ))}
                  <button
                    className="page-btn"
                    disabled={page >= totalPages}
                    onClick={() => {
                      const next = new URLSearchParams(searchParams);
                      next.set('page', page + 1);
                      setSearchParams(next);
                    }}
                  >›</button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <p>No se encontraron películas con esos criterios.</p>
              <button className="btn btn-secondary btn-sm" onClick={clearFilters}>Limpiar filtros</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
