import { Link } from 'react-router-dom';
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
        <Link to="/login" className="login-btn">Login / Register</Link>
      </div>
    </nav>
  );
}

export default Navbar;
