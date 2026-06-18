import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArcaneGrid from './pages/games/ArcaneGrid';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/arcane" element={<ArcaneGrid />} />
            {/* We will add Leaderboard route later */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
