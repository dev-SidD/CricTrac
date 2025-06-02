import React, { useEffect, useState } from 'react';
import axios from 'axios';

import '../style.css';
import { Link, useNavigate } from 'react-router-dom'
const International = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTeamLogo = (imageId) => {
    return `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg`;
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/matches/v1/${selectedFilter}`,
          headers: {
            'x-rapidapi-key': '781952eb6fmshdc067305c66003dp170907jsn612eebfd4411',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const allMatches = response.data.typeMatches
          .filter(typeMatch => typeMatch.matchType === 'International')
          .flatMap(typeMatch => 
            typeMatch.seriesMatches.flatMap(series => 
              series.seriesAdWrapper?.matches || []
            )
          ).filter(match => match.matchInfo);
        
        const processedMatches = allMatches.map(match => ({
          ...match,
          matchStarted: match.matchInfo.state === 'In Progress',
          matchEnded: match.matchInfo.state === 'Complete'
        }));

        if (selectedFilter === 'upcoming') {
          processedMatches.sort((a, b) => 
            new Date(a.matchInfo.startDate) - new Date(b.matchInfo.startDate)
          );
        } else {
          processedMatches.sort((a, b) => {
            if (a.matchStarted && !a.matchEnded && !(b.matchStarted && !b.matchEnded)) return -1;
            if (!(a.matchStarted && !a.matchEnded) && b.matchStarted && !b.matchEnded) return 1;
            return new Date(b.matchInfo.startDate) - new Date(a.matchInfo.startDate);
          });
        }

        setMatches(processedMatches);
      } catch (error) {
        if (error.response && error.response.status === 429) {
          setError('You have reached your hits limit for today. Please try again after 24 hours.');
        } else {
          setError('Failed to fetch matches. Please try again later.');
        }
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedFilter]);

  const getTeamScore = (match, teamId) => {
    if (!match.matchScore) return null;
    const teamKey = teamId === match.matchInfo.team1.teamId ? 'team1Score' : 'team2Score';
    const innings = match.matchScore[teamKey];
    return innings ? Object.values(innings)[0] : null;
  };

  if (error) {
    return (
      <div className="error-container">
        <h3>⚠️ {error}</h3>
      </div>
    );
  }

  if (matches.length === 0) {
      return <div className='live-score'> <div className="match-navigation">
      <Link to="/">🌍 International</Link>
      <Link to="/domestic">🏏 Domestic</Link>
      <Link to="/league">⚡ League</Link>
      <Link to="/women">👩 Women's</Link>
    </div>
  
    {/* Added filter buttons */}
    <div className="filter-buttons">
      <button 
        className={selectedFilter === 'live' ? 'active' : ''}
        onClick={() => setSelectedFilter('live')}
      >
        Live
      </button>
      <button 
        className={selectedFilter === 'recent' ? 'active' : ''}
        onClick={() => setSelectedFilter('recent')}
      >
        Recent 
      </button>
      <button 
        className={selectedFilter === 'upcoming' ? 'active' : ''}
        onClick={() => setSelectedFilter('upcoming')}
      >
        Upcoming
      </button>
    </div>
    <div className='loading'>No Matches</div></div>;
    }
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading matches...</p>
        </div>
      );
    }

  return (
    <div className="live-score">
      <div className="match-navigation">
        <Link to="/">🌍 International</Link>
        <Link to="/domestic">🏏 Domestic</Link>
        <Link to="/league">⚡ League</Link>
        <Link to="/women">👩 Women's</Link>
      </div>

      <div className="filter-buttons">
        <button 
          className={selectedFilter === 'live' ? 'active' : ''}
          onClick={() => setSelectedFilter('live')}
        >
          Live
        </button>
        <button 
          className={selectedFilter === 'recent' ? 'active' : ''}
          onClick={() => setSelectedFilter('recent')}
        >
          Recent
        </button>
        <button 
          className={selectedFilter === 'upcoming' ? 'active' : ''}
          onClick={() => setSelectedFilter('upcoming')}
        >
          Upcoming
        </button>
      </div>
       
      {matches.length === 0 ? (
        <div className="no-matches">No matches found</div>
      ) : (
        matches.map((match) => {
          const { matchInfo } = match;
          return (
            <div key={matchInfo.matchId} className="match" 
            onClick={() => navigate(`/livescore/${matchInfo.matchId}`)} // Add click handler
            style={{ cursor: 'pointer' }}>
              <h3>
                {matchInfo.seriesName}
                {match.matchStarted && !match.matchEnded && (
                  <span className="live">● Live</span>
                )}
              </h3>
              <p className="match-description">{matchInfo.matchDesc}</p>
              <p className="status">{matchInfo.status}</p>
              <div className="teams-container">
                <div className="team">
                  <div className="team-info">
                    <img 
                      src={getTeamLogo(matchInfo.team1.imageId)} 
                      alt={matchInfo.team1.teamName}
                      className="team-logo"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'placeholder-logo.png';
                      }}
                    />
                    <h4>{matchInfo.team1.teamName}</h4>
                    {getTeamScore(match, matchInfo.team1.teamId) && (
                      <p>
                        {getTeamScore(match, matchInfo.team1.teamId).runs}/
                        {getTeamScore(match, matchInfo.team1.teamId).wickets} (
                        {getTeamScore(match, matchInfo.team1.teamId).overs})
                      </p>
                    )}
                  </div>
                </div>
                <div className="team">
                  <div className="team-info">
                    <img 
                      src={getTeamLogo(matchInfo.team2.imageId)} 
                      alt={matchInfo.team2.teamName}
                      className="team-logo"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'placeholder-logo.png';
                      }}
                    />
                    <h4>{matchInfo.team2.teamName}</h4>
                    {getTeamScore(match, matchInfo.team2.teamId) && (
                      <p>
                        {getTeamScore(match, matchInfo.team2.teamId).runs}/
                        {getTeamScore(match, matchInfo.team2.teamId).wickets} (
                        {getTeamScore(match, matchInfo.team2.teamId).overs})
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="match-details">
                <p>Venue: {matchInfo.venueInfo?.ground || 'Unknown venue'}</p>
                <p>Date: {new Date(parseInt(matchInfo.startDate)).toLocaleString()}</p>
                <p>Format: {matchInfo.matchFormat}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default International;