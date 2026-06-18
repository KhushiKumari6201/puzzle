import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="title">Select a Puzzle</h1>
      <div className="games-grid">
        <Link to="/game/arcane" className="game-card glass-panel">
          <div className="card-content">
            <div className="icon">✧</div>
            <h2>Arcane Grid</h2>
            <p>Test your memory as the Master Spellcaster.</p>
          </div>
          <div className="card-glow"></div>
        </Link>
        <Link to="/game/match" className="game-card glass-panel">
          <div className="card-content">
            <div className="icon">⚝</div>
            <h2>Memory Match</h2>
            <p>Find the matching runes before time runs out.</p>
          </div>
          <div className="card-glow"></div>
        </Link>
      </div>
    </div>
  );
}

export default Home;
