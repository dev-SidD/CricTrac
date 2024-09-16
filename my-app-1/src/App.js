// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LiveScore from './components/LiveScore';
import 'animate.css';
import './style.css';


function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/search" element={<SearchBar />} />
          <Route path="/" element={<LiveScore />} />


        </Routes>
      </div>
    </Router>
  );
}



export default App;
