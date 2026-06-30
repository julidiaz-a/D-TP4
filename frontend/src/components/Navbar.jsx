import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../index.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalogo?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">▣</span>
          <span className="brand-name">CineVault</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">▣</span> Home
          </NavLink>
          <NavLink to="/catalogo" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">⊞</span> Catálogo
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">○</span> Admin
          </NavLink>
        </div>

        <Link to="/peliculas/nueva" className="btn btn-primary btn-sm navbar-cta">
          + Nueva Película
        </Link>
      </div>
    </nav>
  );
}
