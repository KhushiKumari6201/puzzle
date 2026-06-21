import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ArcaneGrid from './pages/games/ArcaneGrid';
import ShadowsEnd from './pages/games/ShadowsEnd';
import MemoryMatch from './pages/games/MemoryMatch';
import Login from './pages/Login';
import Register from './pages/Register';
import Leaderboard from './pages/Leaderboard';
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
            <Route path="/game/shadow" element={<ShadowsEnd />} />
            <Route path="/game/match" element={<MemoryMatch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
