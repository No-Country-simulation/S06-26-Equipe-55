import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-primary text-white px-4 py-3 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold cursor-pointer" onClick={closeMenu}>App Bit</Link>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4 items-center text-sm">
          {isAuthenticated ? (
            <>
              <span className="opacity-75">Olá, {user.nomeFantasia}</span>
              <Link to="/dashboard" className="hover:underline cursor-pointer">Dashboard</Link>
              <Link to="/jobs" className="hover:underline cursor-pointer">Vagas</Link>
              <Link to="/match" className="hover:underline cursor-pointer">Matching</Link>
              <Link to="/profile" className="hover:underline cursor-pointer">Configurações</Link>
              <button onClick={handleLogout} className="bg-white/20 px-3 py-1 rounded hover:bg-white/30 cursor-pointer">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline cursor-pointer">Login</Link>
              <Link to="/register" className="bg-white text-primary px-3 py-1 rounded font-medium hover:bg-gray-100 cursor-pointer">Cadastrar</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col gap-1.5">
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/20 flex flex-col gap-3 text-sm">
          {isAuthenticated ? (
            <>
              <span className="opacity-75">Olá, {user.nomeFantasia}</span>
              <Link to="/dashboard" className="hover:underline cursor-pointer" onClick={closeMenu}>Dashboard</Link>
              <Link to="/jobs" className="hover:underline cursor-pointer" onClick={closeMenu}>Vagas</Link>
              <Link to="/match" className="hover:underline cursor-pointer" onClick={closeMenu}>Matching</Link>
              <Link to="/profile" className="hover:underline cursor-pointer" onClick={closeMenu}>Configurações</Link>
              <button onClick={handleLogout} className="bg-white/20 px-3 py-2 rounded hover:bg-white/30 text-left cursor-pointer">Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline cursor-pointer" onClick={closeMenu}>Login</Link>
              <Link to="/register" className="bg-white text-primary px-3 py-2 rounded font-medium text-center cursor-pointer" onClick={closeMenu}>Cadastrar</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
