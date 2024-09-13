// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LiveScore from './components/LiveScore';
import FullCricketScorecard from './components/FullCricketScoreboard';
import './style.css';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/live" element={<LiveScore />} />
          {/* <Route path="/score" element={<FullCricketScorecard />} /> */}


        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className='home'>
    
      <h2>Welcome to the Live Cricket Score Application</h2>
      <p>Here you can watch live cricket scores, upcoming match schedules and player statistics</p>
    
  </div>
);

export default App;
