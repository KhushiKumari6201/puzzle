import { useState } from 'react';
import './Leaderboard.css';

const MOCK_PLAYERS = [
  {
    id: 1,
    name: 'ShadowCaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ShadowCaster&backgroundColor=161028',
    country: 'US',
    level: 42,
    badge: '🔮',
    score: 9500,
    stats: { matchesWon: 120, winRate: '68%', favoriteGame: 'Arcane Grid' }
  },
  {
    id: 2,
    name: 'ArcaneMaster',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ArcaneMaster&backgroundColor=0b0714',
    country: 'GB',
    level: 38,
    badge: '⚡',
    score: 8900,
    stats: { matchesWon: 95, winRate: '62%', favoriteGame: 'Memory Match' }
  },
  {
    id: 3,
    name: 'RuneWalker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RuneWalker&backgroundColor=2e1b4e',
    country: 'FR',
    level: 35,
    badge: '🛡️',
    score: 8200,
    stats: { matchesWon: 80, winRate: '55%', favoriteGame: 'Shadow\'s End' }
  },
  {
    id: 4,
    name: 'MysticSight',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MysticSight&backgroundColor=4a2c7a',
    country: 'DE',
    level: 31,
    badge: '👁️',
    score: 7500,
    stats: { matchesWon: 65, winRate: '50%', favoriteGame: 'Arcane Grid' }
  },
  {
    id: 5,
    name: 'VoidWalker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VoidWalker&backgroundColor=1c152e',
    country: 'JP',
    level: 28,
    badge: '🌌',
    score: 6800,
    stats: { matchesWon: 50, winRate: '48%', favoriteGame: 'Memory Match' }
  }
];

const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char =>  127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

function Leaderboard() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
  };

  const closeProfile = () => {
    setSelectedPlayer(null);
  };

  return (
    <div className="leaderboard-container">
      <h1 className="title">Hall of Legends</h1>
      
      <div className="leaderboard-list glass-panel">
        <div className="leaderboard-header">
          <span className="rank-col">Rank</span>
          <span className="player-col">Player</span>
          <span className="score-col">Score</span>
        </div>
        
        {MOCK_PLAYERS.map((player, index) => (
          <div 
            key={player.id} 
            className="leaderboard-row"
            onClick={() => handlePlayerClick(player)}
          >
            <div className="rank-col">
              <span className={`rank-badge rank-${index + 1}`}>{index + 1}</span>
            </div>
            <div className="player-col">
              <div className="player-avatar-wrapper">
                <img src={player.avatar} alt={player.name} className="player-avatar" />
                <span className="player-level">{player.level}</span>
              </div>
              <div className="player-info">
                <span className="player-name">{player.name} <span className="player-badge">{player.badge}</span></span>
                <span className="player-country" title={player.country}>{getFlagEmoji(player.country)} {player.country}</span>
              </div>
            </div>
            <div className="score-col">
              <span className="player-score">{player.score.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedPlayer && (
        <div className="profile-modal-overlay" onClick={closeProfile}>
          <div className="profile-modal glass-panel" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={closeProfile}>×</button>
            <div className="profile-header">
              <img src={selectedPlayer.avatar} alt={selectedPlayer.name} className="profile-avatar-large" />
              <h2>{selectedPlayer.name} <span className="profile-badge">{selectedPlayer.badge}</span></h2>
              <div className="profile-tags">
                <span className="tag-level">Lvl {selectedPlayer.level}</span>
                <span className="tag-country">{getFlagEmoji(selectedPlayer.country)} {selectedPlayer.country}</span>
              </div>
            </div>
            
            <div className="profile-stats">
              <div className="stat-box">
                <span className="stat-label">Total Score</span>
                <span className="stat-value highlight">{selectedPlayer.score.toLocaleString()}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Matches Won</span>
                <span className="stat-value">{selectedPlayer.stats.matchesWon}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Win Rate</span>
                <span className="stat-value">{selectedPlayer.stats.winRate}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Favorite Game</span>
                <span className="stat-value">{selectedPlayer.stats.favoriteGame}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
