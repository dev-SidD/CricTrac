import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';

const FullCricketScorecard = (props) => {
  const [matchData, setMatchData] = useState(null);
  const url = `https://api.cricapi.com/v1/match_scorecard?apikey=d8f5f19a-4a26-47ad-9a3e-94e8308c449a&id=${props.match}`;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(url);
        console.log(response.data); // Log the response to verify the structure
        const matchesData = response.data.data;
        setMatchData(matchesData);
      } catch (error) {
        console.error('Error fetching live cricket score', error);
      }
    };

    fetchMatches();
  }, [url]);

  if (!matchData || !matchData.score || !matchData.scorecard) {
    return <div>Loading...</div>;
  }

  return (
    <div className="full-scorecard">
      <h2>{matchData.name}</h2>
      <p>Status: {matchData.status}</p>
      <p>Venue: {matchData.venue}</p>

      {/* Team 1 Scorecard */}
      <h3 className='innings'>{matchData.score[0]?.inning}</h3>
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Batsman</th>
            <th>R</th>
            <th>B</th>
            <th>4s</th>
            <th>6s</th>
            <th>SR</th>
            <th>Dismissal</th>
          </tr>
        </thead>
        <tbody>
          {matchData.scorecard[0]?.batting?.map((player, index) => (
            <tr key={index}>
              <td>{player.batsman.name}</td>
              <td>{player.r}</td>
              <td>{player.b}</td>
              <td>{player['4s']}</td>
              <td>{player['6s']}</td>
              <td>{player.sr}</td>
              <td>{player['dismissal-text']}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Score: {matchData.score[0]?.r}/{matchData.score[0]?.w} in {matchData.score[0]?.o} overs</h4>

      {/* Bowling Team 1 */}
      <h3>Bowling Performance ({matchData.teams[1]})</h3>
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Bowler</th>
            <th>O</th>
            <th>M</th>
            <th>R</th>
            <th>W</th>
            <th>ER</th>
          </tr>
        </thead>
        <tbody>
          {matchData.scorecard[0]?.bowling?.map((bowler, index) => (
            <tr key={index}>
              <td>{bowler.bowler.name}</td>
              <td>{bowler.o}</td>
              <td>{bowler.m}</td>
              <td>{bowler.r}</td>
              <td>{bowler.w}</td>
              <td>{bowler.eco}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Team 2 Scorecard (if available) */}
      {matchData.score[1] && (
        <>
          <h3 className='innings'>{matchData.score[1]?.inning}</h3>
          <table className="scorecard-table">
            <thead>
              <tr>
                <th>Batsman</th>
                <th>R</th>
                <th>B</th>
                <th>4s</th>
                <th>6s</th>
                <th>SR</th>
                <th>Dismissal</th>
              </tr>
            </thead>
            <tbody>
              {matchData.scorecard[1]?.batting?.map((player, index) => (
                <tr key={index}>
                  <td>{player.batsman.name}</td>
                  <td>{player.r}</td>
                  <td>{player.b}</td>
                  <td>{player['4s']}</td>
                  <td>{player['6s']}</td>
                  <td>{player.sr}</td>
                  <td>{player['dismissal-text']}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Score: {matchData.score[1]?.r}/{matchData.score[1]?.w} in {matchData.score[1]?.o} overs</h4>

          {/* Bowling Team 2 */}
          <h3>Bowling Performance ({matchData.teams[0]})</h3>
          <table className="scorecard-table">
            <thead>
              <tr>
                <th>Bowler</th>
                <th>O</th>
                <th>M</th>
                <th>R</th>
                <th>W</th>
                <th>ER</th>
              </tr>
            </thead>
            <tbody>
              {matchData.scorecard[1]?.bowling?.map((bowler, index) => (
                <tr key={index}>
                  <td>{bowler.bowler.name}</td>
                  <td>{bowler.o}</td>
                  <td>{bowler.m}</td>
                  <td>{bowler.r}</td>
                  <td>{bowler.w}</td>
                  <td>{bowler.eco}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FullCricketScorecard;
