import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPelicula, deletePelicula, createResena, deleteResena, deleteActuacion } from '../api';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/ConfirmModal';
import '../index.css';

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-picker">
      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          type="button"
          className={`star-btn ${n <= (hover || value) ? 'filled' : ''}`}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
        >★</button>
      ))}
      <span className="star-value">{value}/10</span>
    </div>
  );
}

export default function DetallePelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify } = useApp();

  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Reseña form
  const [resenaForm, setResenaForm] = useState({ puntuacion: 8, comentario: '', autor: '' });
  const [submittingResena, setSubmittingResena] = useState(false);
  const [showResenaForm, setShowResenaForm] = useState(false);

  const load = async () => {
    try {
      const data = await getPelicula(id);
      setPelicula(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePelicula(id);
      notify('Película eliminada correctamente');
      navigate('/catalogo');
    } catch (e) {
      notify(e.message, 'error');
    }
    setDeleting(false);
  };

  const handleResenaSubmit = async (e) => {
    e.preventDefault();
    if (!resenaForm.comentario.trim()) {
      notify('El comentario es obligatorio', 'error');
      return;
    }
    setSubmittingResena(true);
    try {
      await createResena(id, { ...resenaForm, fecha: new Date().toISOString().slice(0, 10) });
      notify('Reseña agregada');
      setResenaForm({ puntuacion: 8, comentario: '', autor: '' });
      setShowResenaForm(false);
      load();
    } catch (e) {
      notify(e.message, 'error');
    }
    setSubmittingResena(false);
  };

  const handleDeleteResena = async (resenaId) => {
    try {
      await deleteResena(resenaId);
      notify('Reseña eliminada');
      load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  const handleDeleteActuacion = async (actId) => {
    try {
      await deleteActuacion(actId);
      notify('Actor removido del elenco');
      load();
    } catch (e) {
      notify(e.message, 'error');
    }
  };

  if (loading) return <div className="loading-page container"><div className="spinner" /></div>;
  if (error) return <div className="container" style={{ padding: '40px 0' }}><div className="error-box">{error}</div></div>;
  if (!pelicula) return null;

  const avgRating = pelicula.resenas?.length
    ? (pelicula.resenas.reduce((s, r) => s + r.puntuacion, 0) / pelicula.resenas.length).toFixed(1)
    : null;

  return (
    <div className="detalle-page">
      {/* Header */}
      <div className="detalle-header">
        <div className="container detalle-header-inner">
          <div className="detalle-poster">
            {pelicula.portada_url ? (
              <img src={pelicula.portada_url} alt={pelicula.titulo} />
            ) : (
              <div className="detalle-no-poster">🎬</div>
            )}
          </div>
          <div className="detalle-info">
            <div className="detalle-badges">
              {pelicula.genero && <span className="badge badge-accent">{pelicula.genero.nombre}</span>}
              {pelicula.destacada && <span className="badge" style={{ color: 'var(--yellow)', borderColor: 'rgba(255,214,10,0.3)', background: 'rgba(255,214,10,0.1)' }}>Destacada</span>}
            </div>
            <h1 className="detalle-titulo">{pelicula.titulo}</h1>
            <div className="detalle-meta">
              <span>{pelicula.anio}</span>
              <span className="meta-dot">·</span>
              <span>⏱ {pelicula.duracion} min</span>
              {pelicula.calificacion && (
                <>
                  <span className="meta-dot">·</span>
                  <span className="detalle-rating">★ {pelicula.calificacion} / 10</span>
                </>
              )}
              {pelicula.director && (
                <>
                  <span className="meta-dot">·</span>
                  <span>Dir. {pelicula.director.nombre} {pelicula.director.apellido}</span>
                </>
              )}
            </div>
            {pelicula.sinopsis && (
              <p className="detalle-sinopsis">{pelicula.sinopsis}</p>
            )}
            <div className="detalle-actions">
              <Link to={`/peliculas/${id}/editar`} className="btn btn-secondary">
                ✏ Editar
              </Link>
              <button className="btn btn-danger" onClick={() => setShowDelete(true)}>
                🗑 Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container detalle-body">
        <div className="detalle-cols">
          {/* Elenco */}
          <section className="detalle-section">
            <h2 className="detalle-section-title">Elenco</h2>
            {pelicula.actuaciones?.length > 0 ? (
              <div className="elenco-list">
                {pelicula.actuaciones.map(act => (
                  <div key={act.id} className="elenco-item">
                    <div className="elenco-avatar">
                      {act.actor?.nombre?.charAt(0) || '?'}
                    </div>
                    <div className="elenco-info">
                      <span className="elenco-nombre">{act.actor?.nombre}</span>
                      <span className="elenco-personaje">{act.personaje}</span>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm elenco-del"
                      onClick={() => handleDeleteActuacion(act.id)}
                      title="Quitar del elenco"
                    >✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="detalle-empty">Sin elenco registrado.</p>
            )}
          </section>

          {/* Reseñas */}
          <section className="detalle-section">
            <div className="resenas-header">
              <h2 className="detalle-section-title">
                Reseñas
                {avgRating && <span className="resenas-avg">★ {avgRating}</span>}
              </h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowResenaForm(v => !v)}
              >
                {showResenaForm ? '✕ Cancelar' : '+ Agregar reseña'}
              </button>
            </div>

            {showResenaForm && (
              <form className="resena-form" onSubmit={handleResenaSubmit}>
                <div className="form-group">
                  <label className="form-label">Puntuación</label>
                  <StarRating
                    value={resenaForm.puntuacion}
                    onChange={v => setResenaForm(f => ({ ...f, puntuacion: v }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tu nombre (opcional)</label>
                  <input
                    className="form-control"
                    placeholder="Anónimo"
                    value={resenaForm.autor}
                    onChange={e => setResenaForm(f => ({ ...f, autor: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Comentario <span>*</span></label>
                  <textarea
                    className="form-control"
                    placeholder="Tu opinión sobre la película..."
                    value={resenaForm.comentario}
                    onChange={e => setResenaForm(f => ({ ...f, comentario: e.target.value }))}
                    rows={3}
                  />
                </div>
                <button className="btn btn-primary" type="submit" disabled={submittingResena}>
                  {submittingResena ? 'Publicando...' : 'Publicar reseña'}
                </button>
              </form>
            )}

            {pelicula.resenas?.length > 0 ? (
              <div className="resenas-list">
                {pelicula.resenas.map(r => (
                  <div key={r.id} className="resena-item">
                    <div className="resena-top">
                      <span className="resena-autor">{r.autor || 'Anónimo'}</span>
                      <span className="resena-score">★ {r.puntuacion}</span>
                      <button
                        className="btn btn-ghost btn-sm resena-del"
                        onClick={() => handleDeleteResena(r.id)}
                      >✕</button>
                    </div>
                    {r.comentario && <p className="resena-comment">{r.comentario}</p>}
                    <span className="resena-fecha">{r.fecha}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="detalle-empty">Sin reseñas aún. ¡Sé el primero!</p>
            )}
          </section>
        </div>
      </div>

      {showDelete && (
        <ConfirmModal
          title="¿Eliminar esta película?"
          description={`"${pelicula.titulo}" y todas sus reseñas serán eliminadas permanentemente.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
          loading={deleting}
        />
      )}
    </div>
  );
}
