import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCricketScorecard from './FullCricketScoreboard';
import '../style.css';

const LiveScore = () => {
  const [watchScorecard, setWatchScorecard] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);  // To track which match's scorecard to show

  // Function to show full scorecard
  function watchSore(match) {
     setSelectedMatch(match);  // Set the match details
     setWatchScorecard(true);  // Toggle the state to show the full scorecard
  }

  // Function to hide the full scorecard and go back to live score
  function hideScore() {
    setWatchScorecard(false);
    setSelectedMatch(null);  // Clear selected match when going back to live score
  }

  const [matches, setMatches] = useState([]);
  const apiKey = 'c909a736-2dfc-405f-af54-9af008b0075c';
  const url = `https://api.cricapi.com/v1/currentMatches?apikey=${apiKey}&offset=0`;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axios.get(url);
        const matchesData = response.data.data ? response.data.data : [];
        
        matchesData.forEach((match) => {
          // If match status is "No Result", set matchEnded to true
          if (match.status === "No Result - due to rain" || match.status === "No result - due to rain") {
            match.matchEnded = true;
          }
          if (match.matchStarted === true && match.status === "Match not started")
            match.matchEnded = true;
        });

        matchesData.sort((a, b) => {
          // Sorting logic prioritizes live matches
          if (a.matchStarted && !a.matchEnded && !(b.matchStarted && !b.matchEnded)) {
            return -1;
          }
          if (!(a.matchStarted && !a.matchEnded) && b.matchStarted && !b.matchEnded) {
            return 1;
          }
          return 0;
        });

        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching live cricket score', error);
      }
    };

    fetchMatches();
  }, [url]);

  if (!Array.isArray(matches) || matches.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {watchScorecard && selectedMatch ? (
        <>
          {/* Full Scorecard */}
          <button className='close-btn' onClick={hideScore}>X</button>
          <FullCricketScorecard match={selectedMatch} />
        </>
      ) : (
        <div className="live-score">
          {/* Live Scores */}
          {matches.map((match) => (
            <div onClick={() => watchSore(match.id)} key={match.id} className="match">
              <h3>{match.name} {match.matchStarted && !match.matchEnded && (
                <span className='live'>Live</span>
              )}</h3>
              <p>Status: {match.matchStarted ? match.status : 'Not Started'}</p>
              <p>Venue: {match.venue}</p>
              <p>Date: {new Date(match.dateTimeGMT).toLocaleString()}</p>

              {match.teamInfo && (
                <div className="teams">
                  {match.teamInfo.map((team, index) => (
                    <div key={index} className="team">
                      <img src={team.img} alt={team.name} className="team-logo" />
                      <h4>{team.name}</h4>
                      {match.score && match.score.map((inning, index) => (
                        inning.inning.includes(team.name) && (
                          <p key={index}>
                            {inning.inning}: {inning.r}/{inning.w} in {inning.o} overs
                          </p>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LiveScore;
