import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import './Header.css';
import logoIcon from '../../assets/Icon.png';

export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="container header__row">
        {/* Logo */}
        <Link to="/" className="logo" aria-label="Startseite">
          <img src={logoIcon} alt="" className="logo__icon" aria-hidden="true" />
          <span>Die Rezeptwelt</span>
        </Link>
        {/* Nav */}
        <nav className="nav">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/rezepte" className="nav-link">Rezepte</NavLink>
          <NavLink to="/ueber-uns" className="nav-link">Über uns</NavLink>
          <NavLink to="/rezept-hinzufuegen" className="nav-link">Neues Rezept</NavLink>
          {user && <NavLink to="/profil" className="nav-link">Profil</NavLink>}

          {!user ? (
            <button
              type="button"
              className="nav-btn nav-btn--login"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              className="nav-btn nav-btn--logout"
              onClick={signOut}
              aria-label="Logout"
              title="Logout"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
