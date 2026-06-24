import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPelicula, createPelicula, updatePelicula,
  createActuacion, deleteActuacion,
} from '../api';
import { useApp } from '../context/AppContext';
import '.index.css';

const EMPTY_FORM = {
  titulo: '', sinopsis: '', anio: new Date().getFullYear(),
  duracion: '', portada_url: '', destacada: false,
  calificacion: '', generoId: '', directorId: '',
};

export default function FormularioPelicula() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { generos, actores, notify } = useApp();

  const [form, setForm] = useState(EMPTY_FORM);
  const [actuaciones, setActuaciones] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Elenco form
  const [elencoForm, setElencoForm] = useState({ actorId: '', personaje: '' });

  useEffect(() => {
    if (!isEdit) return;
    getPelicula(id).then(data => {
      setForm({
        titulo: data.titulo || '',
        sinopsis: data.sinopsis || '',
        anio: data.anio || '',
        duracion: data.duracion || '',
        portada_url: data.portada_url || '',
        destacada: data.destacada || false,
        calificacion: data.calificacion || '',
        generoId: data.generoId || '',
        directorId: data.directorId || '',
      });
      setActuaciones(data.actuaciones || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = 'El título es obligatorio';
    if (!form.anio || form.anio < 1888) e.anio = 'Año inválido';
    if (!form.duracion || form.duracion < 1) e.duracion = 'Duración inválida';
    if (!form.generoId) e.generoId = 'Seleccioná un género';
    if (!form.directorId) e.directorId = 'Seleccioná un director';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);
    try {
      const payload = {
        ...form,
        anio: parseInt(form.anio),
        duracion: parseInt(form.duracion),
        calificacion: form.calificacion ? parseFloat(form.calificacion) : null,
        generoId: parseInt(form.generoId),
        directorId: parseInt(form.directorId),
      };
      if (isEdit) {
        await updatePelicula(id, payload);
        notify('Película actualizada correctamente');
        navigate(`/peliculas/${id}`);
      } else {
        const nueva = await createPelicula(payload);
        // Save actuaciones for new movie
        for (const act of actuaciones) {
          await createActuacion(nueva.id, { actorId: act.actorId, personaje: act.personaje });
        }
        notify('Película creada correctamente');
        navigate(`/peliculas/${nueva.id}`);
      }
    } catch (err) {
      notify(err.message, 'error');
    }
    setSaving(false);
  };

  const handleAddActor = () => {
    if (!elencoForm.actorId || !elencoForm.personaje.trim()) return;
    const actor = actores.find(a => String(a.id) === String(elencoForm.actorId));
    if (!actor) return;
    if (isEdit) {
      createActuacion(id, { actorId: elencoForm.actorId, personaje: elencoForm.personaje })
        .then(act => {
          setActuaciones(prev => [...prev, { ...act }]);
          notify('Actor agregado');
        })
        .catch(e => notify(e.message, 'error'));
    } else {
      setActuaciones(prev => [...prev, {
        tempId: Date.now(),
        actorId: elencoForm.actorId,
        personaje: elencoForm.personaje,
        actor,
      }]);
    }
    setElencoForm({ actorId: '', personaje: '' });
  };

  const handleRemoveActor = async (act) => {
    if (isEdit && act.id) {
      try {
        await deleteActuacion(act.id);
        setActuaciones(prev => prev.filter(a => a.id !== act.id));
        notify('Actor removido');
      } catch (e) { notify(e.message, 'error'); }
    } else {
      setActuaciones(prev => prev.filter(a => a.tempId !== act.tempId));
    }
  };

  const { directores } = useApp();

  if (loading) return <div className="loading-page container"><div className="spinner" /></div>;

  return (
    <div className="form-page container">
      <div className="form-layout">
        {/* Poster preview */}
        <div className="form-poster-col">
          <div className="poster-preview">
            {form.portada_url ? (
              <img src={form.portada_url} alt="Vista previa" />
            ) : (
              <div className="poster-placeholder">
                <span className="poster-icon">▣</span>
                <span>Vista previa del poster</span>
              </div>
            )}
          </div>
          <div className="form-group" style={{ marginTop: 16 }}>
            <label className="form-label">URL del Poster</label>
            <input
              className="form-control"
              placeholder="https://..."
              value={form.portada_url}
              onChange={e => setForm(f => ({ ...f, portada_url: e.target.value }))}
            />
          </div>
          <label className="destacada-check">
            <input
              type="checkbox"
              checked={form.destacada}
              onChange={e => setForm(f => ({ ...f, destacada: e.target.checked }))}
            />
            <span>Película destacada</span>
          </label>
        </div>

        {/* Form */}
        <form className="form-main" onSubmit={handleSubmit}>
          <h1 className="form-title">{isEdit ? 'Editar Película' : 'Nueva Película'}</h1>

          <div className="form-group">
            <label className="form-label">Título <span>*</span></label>
            <input
              className={`form-control ${errors.titulo ? 'form-error' : ''}`}
              placeholder="Título de la película"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
            />
            {errors.titulo && <span className="field-error">{errors.titulo}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Año <span>*</span></label>
              <input
                className={`form-control ${errors.anio ? 'form-error' : ''}`}
                type="number"
                placeholder="2024"
                value={form.anio}
                onChange={e => setForm(f => ({ ...f, anio: e.target.value }))}
              />
              {errors.anio && <span className="field-error">{errors.anio}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Duración (min) <span>*</span></label>
              <input
                className={`form-control ${errors.duracion ? 'form-error' : ''}`}
                type="number"
                placeholder="120"
                value={form.duracion}
                onChange={e => setForm(f => ({ ...f, duracion: e.target.value }))}
              />
              {errors.duracion && <span className="field-error">{errors.duracion}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Calificación</label>
              <input
                className="form-control"
                type="number"
                min="1" max="10" step="0.1"
                placeholder="8.5"
                value={form.calificacion}
                onChange={e => setForm(f => ({ ...f, calificacion: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Director <span>*</span></label>
            <select
              className={`form-control ${errors.directorId ? 'form-error' : ''}`}
              value={form.directorId}
              onChange={e => setForm(f => ({ ...f, directorId: e.target.value }))}
            >
              <option value="">Seleccionar director...</option>
              {directores.map(d => (
                <option key={d.id} value={d.id}>{d.nombre} {d.apellido}</option>
              ))}
            </select>
            {errors.directorId && <span className="field-error">{errors.directorId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Género principal <span>*</span></label>
            <div className="genero-radios">
              {generos.map(g => (
                <label key={g.id} className={`genero-radio ${String(form.generoId) === String(g.id) ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="genero"
                    value={g.id}
                    checked={String(form.generoId) === String(g.id)}
                    onChange={e => setForm(f => ({ ...f, generoId: e.target.value }))}
                  />
                  {g.nombre}
                </label>
              ))}
            </div>
            {errors.generoId && <span className="field-error">{errors.generoId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Sinopsis</label>
            <textarea
              className="form-control"
              placeholder="Describe la trama de la película..."
              value={form.sinopsis}
              onChange={e => setForm(f => ({ ...f, sinopsis: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Elenco */}
          <div className="form-group">
            <label className="form-label">Elenco</label>
            <div className="elenco-add">
              <select
                className="form-control"
                value={elencoForm.actorId}
                onChange={e => setElencoForm(f => ({ ...f, actorId: e.target.value }))}
              >
                <option value="">Actor...</option>
                {actores.map(a => (
                  <option key={a.id} value={a.id}>{a.nombre}</option>
                ))}
              </select>
              <span className="elenco-como">como</span>
              <input
                className="form-control"
                placeholder="Nombre del personaje"
                value={elencoForm.personaje}
                onChange={e => setElencoForm(f => ({ ...f, personaje: e.target.value }))}
              />
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleAddActor}>
                + Agregar
              </button>
            </div>
            {actuaciones.length > 0 && (
              <div className="elenco-preview">
                {actuaciones.map(act => (
                  <div key={act.id || act.tempId} className="elenco-tag">
                    <span>{act.actor?.nombre} — {act.personaje}</span>
                    <button type="button" onClick={() => handleRemoveActor(act)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-footer">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : (isEdit ? '✏ Actualizar película' : '▣ Crear película')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
