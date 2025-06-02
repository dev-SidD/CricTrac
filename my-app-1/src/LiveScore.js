import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Livescore.css';

// Icons
import { FaCrown, FaPlane } from 'react-icons/fa';  // Captain, Overseas (plane)
import { GiGloves } from 'react-icons/gi';         // Wicket Keeper


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
            'x-rapidapi-key': '781952eb6fmshdc067305c66003dp170907jsn612eebfd4411',
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

  if (loading) return <div className="loading">Loading match details...</div>;
  if (!matchData || !matchData.appIndex) return <div className="error">No match data available</div>;

  const header = matchData.appIndex;
  const scoreCards = matchData.scorecard || [];

  return (
    <div className="scorecard">
      <button className="back-button" onClick={() => navigate('/')}>⬅ Back to Home</button>

      <div className="match-header">
        <h1>{header.seoTitle}</h1>
        <div className="teams">
          <span className="team">{matchData.cb11.team1Sname}</span>
          <span className="vs">vs</span>
          <span className="team">{matchData.cb11.team2Sname}</span>
        </div>
        <div className="match-status">
          <p>{header.status}</p>
        </div>

        {header.playersOfTheMatch?.length > 0 && (
          <div className="mom-section">
            <h3>Player of the Match</h3>
            <div className="mom-player">
              {header.playersOfTheMatch[0].fullName} ({header.playersOfTheMatch[0].teamName})
            </div>
          </div>
        )}
      </div>

      {scoreCards.map((innings, index) => (
        <div key={index} className="innings-card">
          <h3 className="innings-title">
            {innings.batTeamName} Innings
            <span className="score">
              {innings.score}/{innings.wickets}
              <span className="overs"> ({innings.overs} overs)</span>
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
                {(innings.batsman || []).map((batsman, i) => (
                  <tr key={i} className={batsman.outDec ? '' : 'not-out'}>
                    <td>
                      {batsman.name}
                      {batsman.isCaptain && <FaCrown title="Captain" className="player-icon" />}
                      {batsman.isKeeper && <GiGloves title="Wicket Keeper" className="player-icon" />}
                      {batsman.isOverseas && <FaPlane title="Overseas Player" className="player-icon" />}
                    </td>
                    <td>{batsman.runs}</td>
                    <td>{batsman.balls}</td>
                    <td>{batsman.fours}</td>
                    <td>{batsman.sixes}</td>
                    <td>{parseFloat(batsman.strkRate).toFixed(1)}</td>
                    <td>{batsman.outDec || 'not out'}</td>
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
                {(innings.bowler || []).map((bowler, i) => (
                  <tr key={i}>
                    <td>{bowler.name}</td>
                    <td>{bowler.overs}</td>
                    <td>{bowler.maidens}</td>
                    <td>{bowler.runs}</td>
                    <td>{bowler.wickets}</td>
                    <td>{parseFloat(bowler.economy).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Extras, FOW, Partnerships */}
          <div className="match-details">
            <div className="extras">
              <h4>Extras</h4>
              <p>
                {innings.extras.total} (b {innings.extras.byes}, lb {innings.extras.legByes}, w {innings.extras.wides}, nb {innings.extras.noBalls})
              </p>
            </div>

            <div className="wickets-section">
              <h4>Fall of Wickets</h4>
              <div className="wickets-list">
                {(innings.fow.fow || []).map((wicket, i) => (
                  <div key={i} className="wicket-item">
                    <span className="wicket-player">{wicket.batsmanName}</span>
                    <span className="wicket-score">{wicket.runs}/{i + 1}</span>
                    <span className="wicket-over">({wicket.overNbr} ov)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="partnerships">
              <h4>Key Partnerships</h4>
              {(innings.partnership?.partnership || []).map((partner, i) => (
                <div key={i} className="partnership">
                  <strong>{partner.bat1Name}{partner.bat1Runs !== undefined ? ` (${partner.bat1Runs})` : ''}</strong> &nbsp;–&nbsp;
                  <strong>{partner.bat2Name}{partner.bat2Runs !== undefined ? ` (${partner.bat2Runs})` : ''}</strong>: &nbsp;
                  <span>{partner.totalRuns || 0} runs</span>
                  <span className="partnership-details"> ({partner.totalBalls || 0} balls)</span>
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
