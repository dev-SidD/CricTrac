// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Domestic from './components/Domestic';
import International from './components/International';
import LeagueMatches from './components/LeagueMatches';
import WomensMatches from './components/WomensMatches';
import Livescore from './LiveScore';
import 'animate.css';
import './style.css';


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/search" element={<SearchBar />} />
          <Route path="/" element={<International />} />
          <Route path="/domestic" element={<Domestic />} />
          <Route path="/league" element={<LeagueMatches />} />
          <Route path="/women" element={<WomensMatches />} />
          <Route path="/livescore/:matchId" element={<Livescore />} />
 

        </Routes>
      </div>
    </Router>
  );
}



export default App;
