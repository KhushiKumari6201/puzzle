import { useState, useEffect, useCallback } from 'react';
import './MemoryMatch.css';

const RUNES = ['🔥','💧','⚡','🌿','❄️','🌙','☀️','💎','🌀','⚗️','🔮','💫','🏺','📿','⚔️','🛡️'];

const LEVELS = [
  { pairs: 6, cols: 4, time: 45 },
  { pairs: 8, cols: 4, time: 60 },
  { pairs: 10, cols: 5, time: 75 }
];

export default function MemoryMatch() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [mismatches, setMismatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost

  const initLevel = useCallback((lvlIdx = levelIndex) => {
    const lv = LEVELS[lvlIdx];
    const levelRunes = RUNES.slice(0, lv.pairs);
    const deck = [...levelRunes, ...levelRunes]
      .sort(() => Math.random() - 0.5)
      .map((rune, i) => ({ id: i, rune, isFlipped: false, isMatched: false }));
    
    setCards(deck);
    setFlippedIds([]);
    setMismatches(0);
    setTimeLeft(lv.time);
    setGameState('playing');
  }, [levelIndex]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('lost');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  useEffect(() => {
    if (gameState === 'playing' && cards.length > 0) {
      if (cards.every(c => c.isMatched)) {
        setGameState('won');
      }
    }
  }, [cards, gameState]);

  const handleCardClick = (id) => {
    if (gameState !== 'playing' || flippedIds.length >= 2) return;
    
    const card = cards.find(c => c.id === id);
    if (card.isFlipped || card.isMatched) return;

    const newFlippedIds = [...flippedIds, id];
    setFlippedIds(newFlippedIds);
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlippedIds.length === 2) {
      const card1 = cards.find(c => c.id === newFlippedIds[0]);
      const card2 = cards.find(c => c.id === newFlippedIds[1]);

      if (card1.rune === card2.rune) {
        // Match!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === card1.id || c.id === card2.id ? { ...c, isMatched: true } : c
          ));
          setFlippedIds([]);
          setTimeLeft(t => Math.min(t + 3, LEVELS[levelIndex].time)); // Bonus time
        }, 600);
      } else {
        // Mismatch!
        const newMismatches = mismatches + 1;
        setMismatches(newMismatches);

        setTimeout(() => {
          if (newMismatches >= 3) {
            shuffleUnmatchedCards();
          } else {
            setCards(prev => prev.map(c => 
              c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
            ));
            setFlippedIds([]);
          }
        }, 1000);
      }
    }
  };

  const shuffleUnmatchedCards = () => {
    setMismatches(0);
    setFlippedIds([]);
    
    setCards(prev => {
      // Unflip everyone first visually
      const unflipped = prev.map(c => ({ ...c, isFlipped: false }));
      
      // Extract unmatched
      const unmatchedIndices = [];
      const unmatchedRunes = [];
      
      unflipped.forEach((c, idx) => {
        if (!c.isMatched) {
          unmatchedIndices.push(idx);
          unmatchedRunes.push(c.rune);
        }
      });
      
      // Shuffle runes
      unmatchedRunes.sort(() => Math.random() - 0.5);
      
      // Reassign
      const newCards = [...unflipped];
      unmatchedIndices.forEach((idx, i) => {
        newCards[idx] = { ...newCards[idx], rune: unmatchedRunes[i], shuffleAnim: true };
      });
      
      return newCards;
    });

    // Remove animation class after a short delay
    setTimeout(() => {
      setCards(prev => prev.map(c => ({ ...c, shuffleAnim: false })));
    }, 600);
  };

  const lv = LEVELS[levelIndex];
  const gridStyle = { gridTemplateColumns: `repeat(${lv?.cols || 4}, 1fr)` };
  const progressPercent = lv ? (timeLeft / lv.time) * 100 : 100;

  return (
    <div className="memory-match-page">
      <h1 className="title match-glow-text">Chrono Match</h1>
      <div className="subtitle">Find the pairs. Beware the temporal shuffle.</div>

      <div className="level-dots">
        {LEVELS.map((_, i) => (
          <div key={i} className={`dot ${i < levelIndex ? 'done' : i === levelIndex ? 'active' : ''}`} />
        ))}
      </div>

      <div className="hud">
        <div className="hud-item glass-panel">
          <span className="hud-label">Time</span>
          <span className={`hud-val ${timeLeft <= 10 ? 'danger' : ''}`}>{timeLeft}s</span>
        </div>
        <div className="hud-item glass-panel">
          <span className="hud-label">Instability</span>
          <div className="instability-dots">
            {[0, 1, 2].map(i => (
              <div key={i} className={`idot ${i < mismatches ? 'filled' : ''}`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="timer-bar-container">
        <div 
          className={`timer-bar ${timeLeft <= 10 ? 'danger-bg' : ''}`} 
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="game-main">
        <div className="match-play-container">
          <div className="match-grid" style={gridStyle}>
            {cards.map(card => (
              <div 
                key={card.id} 
                className={`match-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''} ${card.shuffleAnim ? 'shuffling' : ''}`}
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-inner">
                  <div className="card-front"></div>
                  <div className="card-back">
                    <span className="card-rune">{card.rune}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlays */}
      <div className={`overlay ${gameState === 'won' ? 'active' : ''}`}>
        <div className="modal glass-panel-modal">
          <h2>✦ Timeline Secured ✦</h2>
          <p>You have mastered the memories before time ran out.</p>
          <button className="btn btn-primary" onClick={() => {
            const next = levelIndex < LEVELS.length - 1 ? levelIndex + 1 : 0;
            setLevelIndex(next);
            initLevel(next);
          }}>
            {levelIndex < LEVELS.length - 1 ? "Next Timeline ➜" : "Mastered! Replay?"}
          </button>
        </div>
      </div>

      <div className={`overlay ${gameState === 'lost' ? 'active' : ''}`}>
        <div className="modal glass-panel-modal lost">
          <h2>Time Collapsed</h2>
          <p>The memories faded into the void.</p>
          <button className="btn btn-primary" onClick={() => initLevel()}>Try Again</button>
        </div>
      </div>

      <div className={`overlay ${gameState === 'start' ? 'active' : ''}`}>
        <div className="modal glass-panel-modal">
          <h2>Chrono Match</h2>
          <p>Match the magical runes. Be warned: every 3 mistakes causes the unmatched runes to shuffle and swap places! Hurry, the timeline is collapsing.</p>
          <button className="btn btn-primary" onClick={() => initLevel()}>Start Challenge</button>
        </div>
      </div>
    </div>
  );
}
