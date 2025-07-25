// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Matches from './components/Matches';
import Livescore from './LiveScore';
import PlayerStats from './components/PlayerStats';
import 'animate.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Header />
        <main className="pt-4 pb-10 px-4 max-w-7xl mx-auto">
          <Routes>
            <Route path="/search" element={<PlayerStats />} />
            <Route path="/" element={<Navigate to="/matches/international" replace />} />
            <Route path="/matches/:matchType" element={<Matches />} />
            <Route path="/livescore/:matchId" element={<Livescore />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
