import { useState, useEffect } from 'react';
import { getPeliculas, deletePelicula } from '../api';
import { useApp } from '../context/AppContext';
import {
  createGenero, updateGenero, deleteGenero,
  createDirector, updateDirector, deleteDirector,
  createActor, updateActor, deleteActor,
} from '../api';
import ConfirmModal from '../components/ConfirmModal';
import { Link } from 'react-router-dom';
import './Admin.css';

function EntityModal({ title, fields, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {fields.map(f => (
            <div key={f.key} className="form-group">
              <label className="form-label">{f.label} {f.required && <span style={{ color: 'var(--red)' }}>*</span>}</label>
              <input
                className="form-control"
                placeholder={f.placeholder}
                value={form[f.key] || ''}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                required={f.required}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PeliculasTab({ notify }) {
  const [peliculas, setPeliculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await getPeliculas({ limit: 50 });
    setPeliculas(res.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = peliculas.filter(p =>
    p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePelicula(toDelete.id);
      notify('Película eliminada');
      setToDelete(null);
      load();
    } catch (e) { notify(e.message, 'error'); }
    setDeleting(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-toolbar">
        <input
          className="form-control tab-search"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Link to="/peliculas/nueva" className="btn btn-primary btn-sm">+ Agregar</Link>
      </div>
      {loading ? <div className="spinner" /> : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Película</th>
              <th>Director</th>
              <th>Año</th>
              <th>Género</th>
              <th>Rating</th>
              <th>Destacada</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="table-movie">
                    {p.portada_url && <img src={p.portada_url} alt="" className="table-thumb" />}
                    <span>{p.titulo}</span>
                  </div>
                </td>
                <td className="text-muted">{p.director ? `${p.director.nombre} ${p.director.apellido}` : '—'}</td>
                <td className="text-muted">{p.anio}</td>
                <td>{p.genero ? <span className="badge">{p.genero.nombre}</span> : '—'}</td>
                <td><span className="rating-cell">★ {p.calificacion || '—'}</span></td>
                <td>
                  <span className={`si-no ${p.destacada ? 'si' : ''}`}>
                    {p.destacada ? 'Sí' : 'No'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <Link to={`/peliculas/${p.id}/editar`} className="btn btn-ghost btn-sm">✏</Link>
                    <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(p)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {toDelete && (
        <ConfirmModal
          title={`¿Eliminar "${toDelete.titulo}"?`}
          description="Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

function SimpleEntityTab({ label, items, fields, onCreate, onUpdate, onDelete }) {
  const { notify } = useApp();
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // {mode: 'create'|'edit', item?: obj}
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = items.filter(it => {
    const name = it.nombre || `${it.nombre} ${it.apellido}` || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const handleSave = async (form) => {
    try {
      if (modal.mode === 'create') {
        await onCreate(form);
        notify(`${label} creado/a`);
      } else {
        await onUpdate(modal.item.id, form);
        notify(`${label} actualizado/a`);
      }
      setModal(null);
    } catch (e) { notify(e.message, 'error'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(toDelete.id);
      notify(`${label} eliminado/a`);
      setToDelete(null);
    } catch (e) { notify(e.message, 'error'); }
    setDeleting(false);
  };

  return (
    <div className="tab-content">
      <div className="tab-toolbar">
        <input
          className="form-control tab-search"
          placeholder="Buscar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary btn-sm" onClick={() => setModal({ mode: 'create' })}>
          + Nuevo {label}
        </button>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            {fields.map(f => <th key={f.key}>{f.label}</th>)}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id}>
              {fields.map(f => (
                <td key={f.key} className={f.key !== fields[0].key ? 'text-muted' : ''}>
                  {item[f.key] || '—'}
                </td>
              ))}
              <td>
                <div className="action-btns">
                  <button className="btn btn-ghost btn-sm" onClick={() => setModal({ mode: 'edit', item })}>✏</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(item)}>🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modal && (
        <EntityModal
          title={modal.mode === 'create' ? `Nuevo ${label}` : `Editar ${label}`}
          fields={fields}
          initial={modal.item || {}}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {toDelete && (
        <ConfirmModal
          title={`¿Eliminar este ${label}?`}
          description="Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}

const TABS = ['Películas', 'Actores', 'Directores', 'Géneros'];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Películas');
  const {
    generos, actores, directores,
    loadGeneros, loadActores, loadDirectores,
    notify,
  } = useApp();

  // Stats
  const [stats, setStats] = useState({ peliculas: 0 });
  useEffect(() => {
    getPeliculas({ limit: 1 }).then(r => setStats({ peliculas: r.total })).catch(() => {});
  }, []);

  return (
    <div className="admin-page container">
      <div className="admin-header">
        <p className="admin-eyebrow">ADMINISTRACIÓN</p>
        <h1 className="admin-title">Panel de Control</h1>
        <p className="admin-sub">Gestiona el contenido del catálogo</p>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-icon">▣</span>
          <div><span className="stat-num">{stats.peliculas}</span><span className="stat-label">Películas</span></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👤</span>
          <div><span className="stat-num">{actores.length}</span><span className="stat-label">Actores</span></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🎬</span>
          <div><span className="stat-num">{directores.length}</span><span className="stat-label">Directores</span></div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">◇</span>
          <div><span className="stat-num">{generos.length}</span><span className="stat-label">Géneros</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t}
            className={`admin-tab ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >{t}</button>
        ))}
      </div>

      <div className="admin-body">
        {activeTab === 'Películas' && <PeliculasTab notify={notify} />}
        {activeTab === 'Actores' && (
          <SimpleEntityTab
            label="Actor"
            items={actores}
            fields={[
              { key: 'nombre', label: 'Nombre', required: true, placeholder: 'Nombre completo' },
              { key: 'nacionalidad', label: 'Nacionalidad', placeholder: 'País de origen' },
            ]}
            onCreate={async (d) => { await createActor(d); loadActores(); }}
            onUpdate={async (id, d) => { await updateActor(id, d); loadActores(); }}
            onDelete={async (id) => { await deleteActor(id); loadActores(); }}
          />
        )}
        {activeTab === 'Directores' && (
          <SimpleEntityTab
            label="Director"
            items={directores}
            fields={[
              { key: 'nombre', label: 'Nombre', required: true, placeholder: 'Nombre' },
              { key: 'apellido', label: 'Apellido', required: true, placeholder: 'Apellido' },
              { key: 'nacionalidad', label: 'Nacionalidad', placeholder: 'País de origen' },
            ]}
            onCreate={async (d) => { await createDirector(d); loadDirectores(); }}
            onUpdate={async (id, d) => { await updateDirector(id, d); loadDirectores(); }}
            onDelete={async (id) => { await deleteDirector(id); loadDirectores(); }}
          />
        )}
        {activeTab === 'Géneros' && (
          <SimpleEntityTab
            label="Género"
            items={generos}
            fields={[
              { key: 'nombre', label: 'Nombre', required: true, placeholder: 'Ej: Drama, Thriller...' },
            ]}
            onCreate={async (d) => { await createGenero(d); loadGeneros(); }}
            onUpdate={async (id, d) => { await updateGenero(id, d); loadGeneros(); }}
            onDelete={async (id) => { await deleteGenero(id); loadGeneros(); }}
          />
        )}
      </div>
    </div>
  );
}
