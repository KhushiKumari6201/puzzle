import React, { useState, useEffect } from 'react';
import './DifficultySelector.css';

const difficulties = [
  {
    id: 'easy',
    name: 'Easy',
    color: '#10B981',
    description: 'No timer, 3 hints',
    icon: '🌱'
  },
  {
    id: 'medium',
    name: 'Medium',
    color: '#F59E0B',
    description: 'Optional timer, 2 hints',
    icon: '⚖️'
  },
  {
    id: 'hard',
    name: 'Hard',
    color: '#F97316',
    description: 'Timer + penalty, 1 hint',
    icon: '🔥'
  },
  {
    id: 'expert',
    name: 'Expert',
    color: '#EF4444',
    description: 'Strict timer, no hints, leaderboard only',
    icon: '☠️'
  }
];

const DifficultySelector = () => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [progress, setProgress] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
    expert: 0
  });

  // Load progress and selected level on mount
  useEffect(() => {
    const savedLevel = localStorage.getItem('puzzle_difficulty');
    if (savedLevel) {
      setSelectedLevel(savedLevel);
    }

    const savedProgress = localStorage.getItem('puzzle_progress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    } else {
      // Initialize with 0 progress if none exists
      localStorage.setItem('puzzle_progress', JSON.stringify({
        easy: 0,
        medium: 0,
        hard: 0,
        expert: 0
      }));
    }
  }, []);

  const handleSelect = (id) => {
    setSelectedLevel(id);
    localStorage.setItem('puzzle_difficulty', id);
  };

  const simulateProgress = (id) => {
    const newProgress = { ...progress };
    newProgress[id] = Math.min(100, newProgress[id] + 10);
    setProgress(newProgress);
    localStorage.setItem('puzzle_progress', JSON.stringify(newProgress));
  };

  return (
    <div className="difficulty-container">
      <div className="difficulty-header">
        <h1>Select Difficulty</h1>
        <p>Choose your challenge level to begin</p>
      </div>
      
      <div className="difficulty-grid">
        {difficulties.map((level) => {
          const isSelected = selectedLevel === level.id;
          const levelProgress = progress[level.id] || 0;
          
          return (
            <div 
              key={level.id}
              className={`difficulty-card ${isSelected ? 'selected' : ''}`}
              style={{ '--level-color': level.color }}
              onClick={() => handleSelect(level.id)}
            >
              <div className="card-bg-glow" />
              <div className="card-content">
                <div className="card-icon">{level.icon}</div>
                <h2>{level.name}</h2>
                <p>{level.description}</p>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <span>Progress</span>
                    <span>{levelProgress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>

                <div className="card-actions">
                  <button 
                    className="select-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(level.id);
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                  <button 
                    className="simulate-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      simulateProgress(level.id);
                    }}
                    title="Simulate Progress"
                  >
                    +10%
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultySelector;
