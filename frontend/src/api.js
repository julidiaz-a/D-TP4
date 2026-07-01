const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.errors?.[0]?.msg || 'Error en la petición');
  return data;
}

// Películas
export const getPeliculas = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/peliculas${qs ? `?${qs}` : ''}`);
};
export const getPelicula = (id) => request(`/peliculas/${id}`);
export const createPelicula = (data) => request('/peliculas', { method: 'POST', body: JSON.stringify(data) });
export const updatePelicula = (id, data) => request(`/peliculas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deletePelicula = (id) => request(`/peliculas/${id}`, { method: 'DELETE' });

// Géneros
export const getGeneros = () => request('/generos');
export const createGenero = (data) => request('/generos', { method: 'POST', body: JSON.stringify(data) });
export const updateGenero = (id, data) => request(`/generos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteGenero = (id) => request(`/generos/${id}`, { method: 'DELETE' });

// Directores
export const getDirectores = () => request('/directores');
export const getDirector = (id) => request(`/directores/${id}`);
export const createDirector = (data) => request('/directores', { method: 'POST', body: JSON.stringify(data) });
export const updateDirector = (id, data) => request(`/directores/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDirector = (id) => request(`/directores/${id}`, { method: 'DELETE' });

// Actores
export const getActores = () => request('/actores');
export const getActor = (id) => request(`/actores/${id}`);
export const createActor = (data) => request('/actores', { method: 'POST', body: JSON.stringify(data) });
export const updateActor = (id, data) => request(`/actores/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteActor = (id) => request(`/actores/${id}`, { method: 'DELETE' });

// Reseñas
export const getResenas = (peliculaId) => request(`/peliculas/${peliculaId}/resenas`);
export const createResena = (peliculaId, data) => request(`/peliculas/${peliculaId}/resenas`, { method: 'POST', body: JSON.stringify(data) });
export const updateResena = (id, data) => request(`/peliculas/resenas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteResena = (id) => request(`/peliculas/resenas/${id}`, { method: 'DELETE' });

// Actuaciones
export const getActuaciones = (peliculaId) => request(`/peliculas/${peliculaId}/actuaciones`);
export const createActuacion = (peliculaId, data) => request(`/peliculas/${peliculaId}/actuaciones`, { method: 'POST', body: JSON.stringify(data) });
export const deleteActuacion = (id) => request(`/peliculas/actuaciones/${id}`, { method: 'DELETE' });
