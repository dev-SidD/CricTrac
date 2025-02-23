import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';
import { Link, useNavigate } from 'react-router-dom'
const Domestic = () => {
  const navigate = useNavigate(); // Initialize navigate
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');
  // Generate initials-based avatars using team name
  const getTeamLogo = (team) => {
    if (team.imageId) {
      return `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${team.imageId}/i.jpg`;
    }
    
    // Generate initials from team name
    const initials = team.teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&radius=50&size=100`;
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/matches/v1/${selectedFilter}`,
          headers: {
            'x-rapidapi-key': '41b9c77e66msh6ca543119d2459ap137ef6jsne7f855b357c6',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const allMatches = response.data.typeMatches
          .filter(typeMatch => typeMatch.matchType === 'Domestic')
          .flatMap(typeMatch => 
            typeMatch.seriesMatches.flatMap(series => 
              series.seriesAdWrapper?.matches || []
            )
          ).filter(match => match.matchInfo);
        
        const processedMatches = allMatches.map(match => ({
          ...match,
          matchStarted: match.matchInfo.state === 'In Progress',
          matchEnded: match.matchInfo.state === 'Complete',
          team1: {
            ...match.matchInfo.team1,
            imageId: match.matchInfo.team1.imageId || null
          },
          team2: {
            ...match.matchInfo.team2,
            imageId: match.matchInfo.team2.imageId || null
          }
        }));

        processedMatches.sort((a, b) => {
          if (a.matchStarted && !a.matchEnded && !(b.matchStarted && !b.matchEnded)) return -1;
          if (!(a.matchStarted && !a.matchEnded) && b.matchStarted && !b.matchEnded) return 1;
          return new Date(b.matchInfo.startDate) - new Date(a.matchInfo.startDate);
        });

        setMatches(processedMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
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

  return (
    <div className="live-score">
       
         <div className="match-navigation">
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
   

      {matches.map((match) => {
        const { matchInfo, team1, team2 } = match;
        return (
          <div key={matchInfo.matchId} className="match"
          onClick={() => navigate(`/livescore/${matchInfo.matchId}`)} // Add click handler
            style={{ cursor: 'pointer' }}>
            <h3>
              {matchInfo.seriesName}
              {match.matchStarted && !match.matchEnded && (
                <span className='live'>Live</span>
              )}
            </h3>
            <p className="match-description">{matchInfo.matchDesc}</p>
            <p className="status">{matchInfo.status}</p>
            <div className="teams-container">
              {[team1, team2].map((team, index) => (
                <div className="team" key={index}>
                  <div className="team-info">
                    <img 
                      src={getTeamLogo(team)}
                      alt={team.teamName}
                      className="team-logo"
                      onError={(e) => {
                        const initials = team.teamName
                          .split(' ')
                          .map(word => word[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase();
                        e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&radius=50&size=100`;
                        e.target.style.background = '#e0f2f1';
                      }}
                      data-name={team.teamName}
                    />
                    <h4>{team.teamName}</h4>
                    {getTeamScore(match, team.teamId) && (
                      <p>
                        {getTeamScore(match, team.teamId).runs}/
                        {getTeamScore(match, team.teamId).wickets} (
                        {getTeamScore(match, team.teamId).overs})
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="match-details">
              <p>Venue: {matchInfo.venueInfo?.ground || 'Unknown venue'}</p>
              <p>Date: {new Date(parseInt(matchInfo.startDate)).toLocaleString()}</p>
              <p>Format: {matchInfo.matchFormat}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Domestic;