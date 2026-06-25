import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getGeneros, getDirectores, getActores } from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [actores, setActores] = useState([]);
  const [notification, setNotification] = useState(null);

  const loadGeneros = useCallback(async () => {
    try {
      const data = await getGeneros();
      setGeneros(data);
    } catch {}
  }, []);

  const loadDirectores = useCallback(async () => {
    try {
      const data = await getDirectores();
      setDirectores(data);
    } catch {}
  }, []);

  const loadActores = useCallback(async () => {
    try {
      const data = await getActores();
      setActores(data);
    } catch {}
  }, []);

  const loadAll = useCallback(() => {
    loadGeneros();
    loadDirectores();
    loadActores();
  }, [loadGeneros, loadDirectores, loadActores]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const notify = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  return (
    <AppContext.Provider value={{
      generos, setGeneros, loadGeneros,
      directores, setDirectores, loadDirectores,
      actores, setActores, loadActores,
      loadAll,
      notification, notify,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
