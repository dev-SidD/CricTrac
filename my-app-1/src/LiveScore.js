import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Livescore.css';

const Livescore = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`,
          headers: {
            'x-rapidapi-key': '41b9c77e66msh6ca543119d2459ap137ef6jsne7f855b357c6',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        setMatchData(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.status === 429 
          ? 'API rate limit exceeded. Please try again later.'
          : 'Failed to fetch match details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  if (loading) {
    return <div className="loading">Loading match details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!matchData) {
    return <div className="error">No match data available</div>;
  }

  return (
    <div className="scorecard">
         {/* ✅ Back Button */}
      <button className="back-button" onClick={() => navigate('/')}>
        ⬅ Back to Home
      </button>
      {/* Match Header */}
      <div className="match-header">
        <h1>{matchData.matchHeader.seriesName}</h1>
        <h2>{matchData.matchHeader.matchDescription}</h2>
        <div className="teams">
          <span className="team">
            {matchData.matchHeader.team1.name}
          </span>
          <span className="vs">vs</span>
          <span className="team">
            {matchData.matchHeader.team2.name}
          </span>
        </div>
        <div className="match-status">
          
          <p>{matchData.matchHeader.result.resultType === 'win' && 
            `${matchData.matchHeader.result.winningTeam} won by 
            ${matchData.matchHeader.result.winningMargin} 
            ${matchData.matchHeader.result.winByRuns ? 'runs' : 'wickets'}`}
          </p>
        </div>
         {/* Man of the Match */}
         {matchData.matchHeader.playersOfTheMatch?.length > 0 && (
          <div className="mom-section">
            <h3>Player of the Match</h3>
            <div className="mom-player">
              {matchData.matchHeader.playersOfTheMatch[0].fullName} (
              {matchData.matchHeader.playersOfTheMatch[0].teamName})
            </div>
          </div>
        )}
      </div>
      
      {/* Scorecards for Each Innings */}
      {matchData.scoreCard.map((innings, index) => (
        <div key={index} className="innings-card">
          <h3 className="innings-title">
            {innings.batTeamDetails.batTeamName} Innings
            <span className="score">
              {innings.scoreDetails.runs}/{innings.scoreDetails.wickets}
              <span className="overs">({innings.scoreDetails.overs} overs)</span>
            </span>
          </h3>

          {/* Batting Table */}
          <div className="batting-table">
            <h4>Batting</h4>
            <table>
              <thead>
                <tr>
                  <th>Batter</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                  <th>Dismissal</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(innings.batTeamDetails.batsmenData).map((batsman, i) => (
                  <tr key={i} className={batsman.outDesc ? '' : 'not-out'}>
                    <td>
                      {batsman.batName}
                      {batsman.isCaptain && <span className="caption"> (c)</span>}
                      {batsman.isKeeper && <span className="caption"> †</span>}
                    </td>
                    <td>{batsman.runs}</td>
                    <td>{batsman.balls}</td>
                    <td>{batsman.fours}</td>
                    <td>{batsman.sixes}</td>
                    <td>{batsman.strikeRate.toFixed(1)}</td>
                    <td>{batsman.outDesc || 'not out'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bowling Table */}
          <div className="bowling-table">
            <h4>Bowling</h4>
            <table>
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>ECO</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(innings.bowlTeamDetails.bowlersData).map((bowler, i) => (
                  <tr key={i}>
                    <td>{bowler.bowlName}</td>
                    <td>{bowler.overs}</td>
                    <td>{bowler.maidens}</td>
                    <td>{bowler.runs}</td>
                    <td>{bowler.wickets}</td>
                    <td>{bowler.economy.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extras and Fall of Wickets */}
          <div className="match-details">
            <div className="extras">
              <h4>Extras</h4>
              <p>
                {innings.extrasData.total} (b {innings.extrasData.byes}, 
                lb {innings.extrasData.legByes}, 
                w {innings.extrasData.wides}, 
                nb {innings.extrasData.noBalls})
              </p>
            </div>
                {/* Fall of Wickets */}
          <div className="wickets-section">
            <h4>Fall of Wickets</h4>
            <div className="wickets-list">
              {Object.values(innings.wicketsData)
                .sort((a, b) => a.wktNbr - b.wktNbr)
                .map((wicket, i) => (
                  <div key={i} className="wicket-item">
                    <span className="wicket-player">{wicket.batName}</span>
                    <span className="wicket-score">
                      {wicket.wktRuns}-{wicket.wktNbr}
                    </span>
                    <span className="wicket-over">({wicket.wktOver} ov)</span>
                  </div>
                ))}
            </div>
          </div>
          <div className="partnerships">
              <h4>Key Partnerships</h4>
              {Object.values(innings.partnershipsData).map((partner, i) => (
                <div key={i} className="partnership">
                  {partner.bat1Name} - {partner.bat2Name}: {partner.totalRuns} runs
                  <span className="partnership-details">
                    ({partner.totalBalls} balls)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Livescore;