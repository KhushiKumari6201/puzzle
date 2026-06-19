import { useState, useEffect, useCallback } from 'react';
import './ShadowsEnd.css';

const LEVELS = [
  { size: 3, clicks: 3, starlimits: [3, 6] },
  { size: 3, clicks: 6, starlimits: [6, 12] },
  { size: 4, clicks: 8, starlimits: [8, 15] },
  { size: 4, clicks: 12, starlimits: [12, 20] },
  { size: 5, clicks: 15, starlimits: [15, 25] },
];

// Symbols to show on the tiles. They don't affect gameplay, just aesthetics.
const RUNE_SYMBOLS = ['✧', '⚝', '✥', '✦', '✶', '✺'];

function toggleTile(grid, r, c, size) {
  const newGrid = [...grid];
  const toggle = (row, col) => {
    if (row >= 0 && row < size && col >= 0 && col < size) {
      const idx = row * size + col;
      newGrid[idx] = !newGrid[idx];
    }
  };
  
  toggle(r, c);
  toggle(r - 1, c);
  toggle(r + 1, c);
  toggle(r, c - 1);
  toggle(r, c + 1);
  
  return newGrid;
}

export default function ShadowsEnd() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [grid, setGrid] = useState([]);
  const [runes, setRunes] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, won
  const [stars, setStars] = useState(3);

  const initLevel = useCallback((lvlIdx = levelIndex) => {
    const lv = LEVELS[lvlIdx];
    const n = lv.size * lv.size;
    
    // Start with all lights ON
    let currentGrid = Array(n).fill(true);
    
    // Randomly assign a rune symbol to each tile
    const currentRunes = Array.from({ length: n }, () => RUNE_SYMBOLS[Math.floor(Math.random() * RUNE_SYMBOLS.length)]);

    // Simulate random valid clicks to scramble the board
    // This guarantees the puzzle is solvable
    for (let i = 0; i < lv.clicks; i++) {
      const randomRow = Math.floor(Math.random() * lv.size);
      const randomCol = Math.floor(Math.random() * lv.size);
      currentGrid = toggleTile(currentGrid, randomRow, randomCol, lv.size);
    }
    
    // If by pure chance it scrambled back to fully solved, toggle one more to be sure
    if (currentGrid.every(v => v)) {
      currentGrid = toggleTile(currentGrid, 0, 0, lv.size);
    }

    setGrid(currentGrid);
    setRunes(currentRunes);
    setMoves(0);
    setGameState('playing');
    setStars(3);
  }, [levelIndex]);

  useEffect(() => {
    // Check win condition (all lights ON)
    if (gameState === 'playing' && grid.length > 0) {
      if (grid.every(val => val === true)) {
        setGameState('won');
        const lv = LEVELS[levelIndex];
        const earnedStars = moves <= lv.starlimits[0] ? 3 : moves <= lv.starlimits[1] ? 2 : 1;
        setStars(earnedStars);
      }
    }
  }, [grid, gameState, moves, levelIndex]);

  const handleTileClick = (idx) => {
    if (gameState !== 'playing') return;
    const sz = LEVELS[levelIndex].size;
    const r = Math.floor(idx / sz);
    const c = idx % sz;
    
    setGrid(prev => toggleTile(prev, r, c, sz));
    setMoves(m => m + 1);
    
    const lv = LEVELS[levelIndex];
    const currentStars = (moves + 1) <= lv.starlimits[0] ? 3 : (moves + 1) <= lv.starlimits[1] ? 2 : 1;
    setStars(currentStars);
  };

  const lv = LEVELS[levelIndex];
  const gridStyle = { gridTemplateColumns: `repeat(${lv?.size || 3}, 1fr)` };

  return (
    <div className="shadows-end-page">
      <h1 className="title glow-text">Shadow's End</h1>
      <div className="subtitle">Illuminate the Dormant Runes</div>

      <div className="level-dots">
        {LEVELS.map((_, i) => (
          <div key={i} className={`dot ${i < levelIndex ? 'done' : i === levelIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="hud">
        <div className="hud-item glass-panel">
          <span className="hud-label">Moves</span>
          <span className="hud-val">{moves}</span>
        </div>
        <div className="hud-item glass-panel">
          <span className="hud-label">Level</span>
          <span className="hud-val">{levelIndex + 1}/{LEVELS.length}</span>
        </div>
        <div className="hud-item glass-panel">
          <span className="hud-label">Stars</span>
          <span className="hud-val">{'✦'.repeat(stars) + '✧'.repeat(3 - stars)}</span>
        </div>
      </div>

      <div className="msg">Clicking a rune alters its light—and the light of those around it. Restore the glow.</div>

      <div className="game-main">
        <div className="play-container">
          <div className="shadows-grid" style={gridStyle}>
            {grid.map((isOn, i) => (
              <div 
                key={`tile-${i}`} 
                onClick={() => handleTileClick(i)}
                className={`shadow-tile ${isOn ? 'lit' : 'dormant'}`}
              >
                <div className="rune-symbol">{runes[i]}</div>
                <div className="tile-glow"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls">
        <button className="btn restart-btn" onClick={() => initLevel()}>↻ Restart Ritual</button>
      </div>

      {/* Overlays */}
      <div className={`overlay ${gameState === 'won' ? 'active' : ''}`}>
        <div className="modal glass-panel-modal">
          <h2>✦ Light Restored! ✦</h2>
          <p>The shadows recede as the runes awaken.</p>
          <div className="stars-container">{'✦'.repeat(stars) + '✧'.repeat(3 - stars)}</div>
          <button className="btn btn-primary" onClick={() => {
            const next = levelIndex < LEVELS.length - 1 ? levelIndex + 1 : 0;
            setLevelIndex(next);
            initLevel(next);
          }}>
            {levelIndex < LEVELS.length - 1 ? "Next Trial ➜" : "Mastered! Replay?"}
          </button>
        </div>
      </div>

      <div className={`overlay ${gameState === 'start' ? 'active' : ''}`}>
        <div className="modal glass-panel-modal">
          <h2>Shadow's End</h2>
          <p>The ancient runes have gone dark. Click a rune to toggle its light and the light of its neighbors. Illuminate them all to break the curse.</p>
          <button className="btn btn-primary" onClick={() => initLevel()}>Begin the Ritual</button>
        </div>
      </div>
    </div>
  );
}
