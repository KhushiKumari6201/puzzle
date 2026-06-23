import { Link } from 'react-router-dom';
import DifficultySelector from '../components/DifficultySelector/DifficultySelector';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="title">Select a Puzzle</h1>
      <div className="games-grid">
        <Link to="/game/arcane" className="game-card">
          <div className="card-border"></div>
          <div className="card-content">
            <div className="icon-container">
              <div className="icon">✧</div>
              <div className="icon-glow"></div>
            </div>
            <h2>Arcane Grid</h2>
            <p>Test your memory as the Master Spellcaster.</p>
          </div>
          <div className="card-background"></div>
        </Link>
        <Link to="/game/match" className="game-card">
          <div className="card-border"></div>
          <div className="card-content">
            <div className="icon-container">
              <div className="icon">⚝</div>
              <div className="icon-glow"></div>
            </div>
            <h2>Memory Match</h2>
            <p>Find the matching runes before time runs out.</p>
          </div>
          <div className="card-background"></div>
        </Link>
        <Link to="/game/shadow" className="game-card">
          <div className="card-border"></div>
          <div className="card-content">
            <div className="icon-container">
              <div className="icon">👁️</div>
              <div className="icon-glow"></div>
            </div>
            <h2>Shadow's End</h2>
            <p>Restore the light to the ancient dormant runes.</p>
          </div>
          <div className="card-background"></div>
        </Link>
      </div>
      
      {/* Added Difficulty Selector here */}
      <div style={{ marginTop: '4rem' }}>
        <DifficultySelector />
      </div>
    </div>
  );
}

export default Home;
