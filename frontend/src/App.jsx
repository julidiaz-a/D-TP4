import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import DetallePelicula from './pages/DetallePelicula';
import FormularioPelicula from './pages/FormularioPelicula';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Navbar />
        <Notification />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/peliculas/nueva" element={<FormularioPelicula />} />
          <Route path="/peliculas/:id" element={<DetallePelicula />} />
          <Route path="/peliculas/:id/editar" element={<FormularioPelicula />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
