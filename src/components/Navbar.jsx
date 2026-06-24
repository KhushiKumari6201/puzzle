import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar glass-panel">
      <div className="nav-brand">
        <Link to="/" className="brand">Arcane Grid</Link>
      </div>
      <div className="nav-links">
        <Link to="/">Games</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <a href="/admin.html" className="admin-link">Admin Panel</a>
        <ThemeToggle />
        <Link to="/login" className="login-btn">Login / Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
