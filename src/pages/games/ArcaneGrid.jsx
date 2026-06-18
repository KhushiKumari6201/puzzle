import { useState, useEffect, useCallback } from 'react';
import './ArcaneGrid.css';

const RUNES = ['🔥','💧','⚡','🌿','❄️','🌙','☀️','💎','🌀','⚗️','🔮','💫','🏺','📿','⚔️','🛡️'];
const LEVELS = [
  {size: 3, runes: ['🔥','💧','⚡','🌿','❄️','🌙','☀️','💎'], shuffles: 15, starlimits: [10, 18]},
  {size: 3, runes: ['🔮','💫','🌀','⚗️','🏺','📿','⚔️','🛡️'], shuffles: 25, starlimits: [15, 25]},
  {size: 4, runes: RUNES.slice(0, 15), shuffles: 40, starlimits: [35, 60]},
  {size: 4, runes: RUNES.slice(0, 15), shuffles: 60, starlimits: [45, 80]},
  {size: 5, runes: RUNES.concat(['📜','🧿','🗝️','🧭','🕯️','🔔','🎭','🏹']), shuffles: 80, starlimits: [100, 180]}
];

function getNeighbors(idx, sz) {
  const r = Math.floor(idx / sz), c = idx % sz, nb = [];
  if (r > 0) nb.push(idx - sz);
  if (r < sz - 1) nb.push(idx + sz);
  if (c > 0) nb.push(idx - 1);
  if (c < sz - 1) nb.push(idx + 1);
  return nb;
}

export default function ArcaneGrid() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [target, setTarget] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, won
  const [stars, setStars] = useState(3);
  const [emptyIdx, setEmptyIdx] = useState(-1);

  const initLevel = useCallback((lvlIdx = levelIndex) => {
    const lv = LEVELS[lvlIdx];
    const n = lv.size * lv.size - 1;
    const pool = [...lv.runes].sort(() => Math.random() - 0.5);
    const newTarget = [];
    for (let i = 0; i < n; i++) newTarget.push(pool[i % pool.length]);
    newTarget.push(null);
    
    let currentTiles = [...newTarget];
    let currEmpty = currentTiles.indexOf(null);

    // Shuffle
    const sz = lv.size;
    for (let i = 0; i < lv.shuffles * 4; i++) {
        const neighbors = getNeighbors(currEmpty, sz);
        const nextMove = neighbors[Math.floor(Math.random() * neighbors.length)];
        currentTiles[currEmpty] = currentTiles[nextMove];
        currentTiles[nextMove] = null;
        currEmpty = nextMove;
    }

    setTarget(newTarget);
    setTiles(currentTiles);
    setEmptyIdx(currEmpty);
    setMoves(0);
    setGameState('playing');
    setStars(3);
  }, [levelIndex]);

  useEffect(() => {
    // Check win condition
    if (gameState === 'playing' && tiles.length > 0) {
      let win = true;
      for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== target[i]) {
          win = false;
          break;
        }
      }
      if (win) {
        setGameState('won');
        const lv = LEVELS[levelIndex];
        const earnedStars = moves <= lv.starlimits[0] ? 3 : moves <= lv.starlimits[1] ? 2 : 1;
        setStars(earnedStars);
      }
    }
  }, [tiles, target, gameState, moves, levelIndex]);

  const handleTileClick = (idx) => {
    if (gameState !== 'playing') return;
    const sz = LEVELS[levelIndex].size;
    const neighbors = getNeighbors(emptyIdx, sz);
    if (neighbors.includes(idx)) {
      const newTiles = [...tiles];
      newTiles[emptyIdx] = newTiles[idx];
      newTiles[idx] = null;
      setTiles(newTiles);
      setEmptyIdx(idx);
      setMoves(m => m + 1);
      
      const lv = LEVELS[levelIndex];
      const currentStars = (moves + 1) <= lv.starlimits[0] ? 3 : (moves + 1) <= lv.starlimits[1] ? 2 : 1;
      setStars(currentStars);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'playing') return;
    const sz = LEVELS[levelIndex].size;
    const r = Math.floor(emptyIdx / sz);
    const c = emptyIdx % sz;
    let targetIdx = -1;
    
    if (e.key === 'ArrowUp' && r < sz - 1) targetIdx = emptyIdx + sz;
    if (e.key === 'ArrowDown' && r > 0) targetIdx = emptyIdx - sz;
    if (e.key === 'ArrowLeft' && c < sz - 1) targetIdx = emptyIdx + 1;
    if (e.key === 'ArrowRight' && c > 0) targetIdx = emptyIdx - 1;
    
    if (targetIdx !== -1) {
      e.preventDefault();
      handleTileClick(targetIdx);
    }
  }, [gameState, emptyIdx, levelIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const lv = LEVELS[levelIndex];
  const gridStyle = { gridTemplateColumns: `repeat(${lv?.size || 3}, 1fr)` };

  return (
    <div className="arcane-grid-page">
      <h1 className="title">Arcane Grid</h1>
      <div className="subtitle">Assemble the Ancient Sigils</div>

      <div className="level-dots">
        {LEVELS.map((_, i) => (
          <div key={i} className={`dot ${i < levelIndex ? 'done' : i === levelIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">Moves</span>
          <span className="hud-val">{moves}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Level</span>
          <span className="hud-val">{levelIndex + 1}/{LEVELS.length}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Stars</span>
          <span className="hud-val">{'✦'.repeat(stars) + '✧'.repeat(3 - stars)}</span>
        </div>
      </div>

      <div className="msg">Solve the pattern to unlock the next spell...</div>

      <div className="game-main">
        <div className="target-container">
          <h3>✦ Required Sigil ✦</h3>
          <div className="target-grid" style={gridStyle}>
            {target.map((t, i) => (
              <div key={`target-${i}`} className={`tile target-tile ${t === null ? 'empty' : ''}`}>
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="play-container">
          <div className="play-grid" style={gridStyle}>
            {tiles.map((t, i) => (
              <div 
                key={`tile-${i}`} 
                onClick={() => handleTileClick(i)}
                className={`tile ${t === null ? 'empty' : ''} ${t !== null && t === target[i] ? 'correct' : ''}`}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="btn" onClick={() => initLevel()}>🔀 Reshuffle</button>
      </div>

      {/* Overlays */}
      <div className={`overlay ${gameState === 'won' ? 'active' : ''}`}>
        <div className="modal">
          <h2>✦ Spell Mastered! ✦</h2>
          <p>The arcane energy resonates with your will.</p>
          <div className="stars-container">{'✦'.repeat(stars) + '✧'.repeat(3 - stars)}</div>
          <button className="btn btn-primary" onClick={() => {
            const next = levelIndex < LEVELS.length - 1 ? levelIndex + 1 : 0;
            setLevelIndex(next);
            initLevel(next);
          }}>
            {levelIndex < LEVELS.length - 1 ? "Continue ➜" : "Mastered! Replay?"}
          </button>
        </div>
      </div>

      <div className={`overlay ${gameState === 'start' ? 'active' : ''}`}>
        <div className="modal">
          <h2>Arcane Grid</h2>
          <p>Welcome, Initiate. Slide the mystical stones to match the pattern of the Master's spell. Use arrow keys or click to move.</p>
          <button className="btn btn-primary" onClick={() => initLevel()}>Begin Trial</button>
        </div>
      </div>
    </div>
  );
}
