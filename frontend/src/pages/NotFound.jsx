import { Link } from 'react-router-dom';
import '../index.css';

export default function NotFound() {
  return (
    <div className="notfound-page container">
      <div className="notfound-content">
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">Película no encontrada</h1>
        <p className="notfound-desc">
          La página que buscás no existe o fue eliminada del catálogo.
        </p>
        <div className="notfound-actions">
          <Link to="/" className="btn btn-primary btn-lg">Ir al inicio</Link>
          <Link to="/catalogo" className="btn btn-secondary btn-lg">Ver catálogo</Link>
        </div>
      </div>
    </div>
  );
}
