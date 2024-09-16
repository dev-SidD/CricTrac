import React, { useState, useEffect } from 'react';

import '../style.css';

const CricketerStats = (props) => {

  const [selectedFormat, setSelectedFormat] = useState('odi');
  const [cricketerData, setCricketerData] = useState(null);
 const searchedPlayer = props.playerID
  useEffect(() => {
    const fetchCricketerData = async () => {
      try {
        const response = await fetch(`https://api.cricapi.com/v1/players_info?apikey=f7037817-03f0-47e2-a151-d617171d4222&id=${searchedPlayer}`);
        const data = await response.json();

        const formattedData = {
          name: data.data.name,
          image: data.data.playerImg,
          formats: {
            t20i: {
              matches: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === 'm')?.value || 0,
              runs: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === 'runs')?.value || 0,
              highestScore: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === 'hs')?.value || 0,
              average: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === 'avg')?.value || 0,
              strikeRate: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === 'sr')?.value || 0,
              centuries: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === '100s')?.value || 0,
              halfCenturies: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'batting' && stat.stat === '50s')?.value || 0,
              wickets: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'bowling' && stat.stat === 'wkts')?.value || 0,
              bestBowling: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'bowling' && stat.stat === 'bbi')?.value || 'N/A',
              bowlingAverage: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'bowling' && stat.stat === 'avg')?.value || 'N/A',
              economyRate: data.data.stats.find(stat => stat.matchtype === 't20i' && stat.fn === 'bowling' && stat.stat === 'econ')?.value || 'N/A',
            },
            odi: {
              matches: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === 'm')?.value || 0,
              runs: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === 'runs')?.value || 0,
              highestScore: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === 'hs')?.value || 0,
              average: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === 'avg')?.value || 0,
              strikeRate: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === 'sr')?.value || 0,
              centuries: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === '100s')?.value || 0,
              halfCenturies: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'batting' && stat.stat === '50s')?.value || 0,
              wickets: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'bowling' && stat.stat === 'wkts')?.value || 0,
              bestBowling: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'bowling' && stat.stat === 'bbi')?.value || 'N/A',
              bowlingAverage: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'bowling' && stat.stat === 'avg')?.value || 'N/A',
              economyRate: data.data.stats.find(stat => stat.matchtype === 'odi' && stat.fn === 'bowling' && stat.stat === 'econ')?.value || 'N/A',
            },
            test: {
              matches: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === 'm')?.value || 0,
              runs: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === 'runs')?.value || 0,
              highestScore: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === 'hs')?.value || 0,
              average: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === 'avg')?.value || 0,
              strikeRate: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === 'sr')?.value || 0,
              centuries: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === '100s')?.value || 0,
              halfCenturies: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'batting' && stat.stat === '50s')?.value || 0,
              wickets: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'bowling' && stat.stat === 'wkts')?.value || 0,
              bestBowling: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'bowling' && stat.stat === 'bbi')?.value || 'N/A',
              bowlingAverage: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'bowling' && stat.stat === 'avg')?.value || 'N/A',
              economyRate: data.data.stats.find(stat => stat.matchtype === 'test' && stat.fn === 'bowling' && stat.stat === 'econ')?.value || 'N/A',
            }
          }
        };

        setCricketerData(formattedData);
      } catch (error) {
        console.error('Error fetching cricketer data:', error);
      }
    };

    fetchCricketerData();
  }, [searchedPlayer]);

  if (!cricketerData) {
    return <h1 className='default'>Search for players..</h1>;
  }

  const formatData = cricketerData.formats[selectedFormat];

  return (
    
    <>
     <div className='format-select'>
        <div className={`format ${selectedFormat === 'test' ? 'active' : ''}`} onClick={() => setSelectedFormat('test')}>Test</div>
        <div className={`format ${selectedFormat === 'odi' ? 'active' : ''}`} onClick={() => setSelectedFormat('odi')}>ODI</div>
        <div className={`format ${selectedFormat === 't20i' ? 'active' : ''}`} onClick={() => setSelectedFormat('t20i')}>T20I</div>
      </div>
      <div className="cricketer-stats">
        <div className='img-container'>
          <img src={cricketerData.image} alt={`${cricketerData.name}`} className="cricketer-image" />
          <h1 className='cricketerName'>{cricketerData.name}</h1>
          
        </div>
        <div className='stat-container'>
          <div className="stat-item">
            <span className="stat-label">Matches:</span>
            <span className="stat-value">{formatData.matches}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Runs:</span>
            <span className="stat-value">{formatData.runs}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Highest Score:</span>
            <span className="stat-value">{formatData.highestScore}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Average:</span>
            <span className="stat-value">{formatData.average}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Strike Rate:</span>
            <span className="stat-value">{formatData.strikeRate}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Centuries:</span>
            <span className="stat-value">{formatData.centuries}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Half Centuries:</span>
            <span className="stat-value">{formatData.halfCenturies}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Wickets:</span>
            <span className="stat-value">{formatData.wickets}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Best Bowling:</span>
            <span className="stat-value">{formatData.bestBowling}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Bowling Average:</span>
            <span className="stat-value">{formatData.bowlingAverage}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Economy Rate:</span>
            <span className="stat-value">{formatData.economyRate}</span>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default CricketerStats;
