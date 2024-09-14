// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LiveScore from './components/LiveScore';
import 'animate.css';
import './style.css';
import { TypeAnimation } from 'react-type-animation';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/live" element={<LiveScore />} />
        


        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <div className='home'>
    
      <h2 className='animate__animated animate__bounceInDown'>Criktrac</h2>
      <br/>
      <p className='animate__animated animate__bounceInDown'><TypeAnimation
        preRenderFirstString={true}
  sequence={[
    // Same substring at the start will only be typed once, initially
    'Welcome to Crictrac',
    1000,
    'Here you can watch live score',
    1000,
    'Here you can watch player stats',
    1000,
  ]}
  speed={50}
  style={{ fontSize: '25px' }}
  repeat={Infinity}
/></p>
    
  </div>
);

export default App;
