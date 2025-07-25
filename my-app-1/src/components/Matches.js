import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Matches = () => {
  const { matchType } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');

  const matchTypeMap = {
    international: 'International',
    domestic: 'Domestic',
    league: 'League',
    women: 'Women'
  };

  const getTeamLogo = (team) => {
    if (team.imageId) {
      return `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${team.imageId}/i.jpg`;
    }
    const initials = team.teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&radius=50&size=100`;
  };

  const getTeamScore = (match, teamId) => {
    if (!match.matchScore) return null;
    const teamKey = teamId === match.matchInfo.team1.teamId ? 'team1Score' : 'team2Score';
    const innings = match.matchScore[teamKey];
    return innings ? Object.values(innings)[0] : null;
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
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
          .filter(typeMatch => typeMatch.matchType === matchTypeMap[matchType])
          .flatMap(typeMatch =>
            typeMatch.seriesMatches.flatMap(series =>
              series.seriesAdWrapper?.matches || []
            )
          ).filter(match => match.matchInfo);

        const processedMatches = allMatches.map(match => ({
          ...match,
          matchStarted: match.matchInfo.state === 'In Progress',
          matchEnded: match.matchInfo.state === 'Complete',
          team1: match.matchInfo.team1,
          team2: match.matchInfo.team2
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
  }, [selectedFilter, matchType]);

  return (
    <div className="p-4 max-w-6xl mx-auto text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 font-poppins">
      {/* Navigation */}
      <div className="flex gap-4 mb-6 text-base font-medium border-b border-gray-200 dark:border-gray-700 pb-2">
        {Object.keys(matchTypeMap).map(type => (
          <Link
            key={type}
            to={`/matches/${type}`}
            className={`transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400 ${
              matchType === type
                ? 'font-bold text-blue-800 dark:text-blue-400 border-b-2 border-blue-600'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {type === 'international' && '🌍 International'}
            {type === 'domestic' && '🏏 Domestic'}
            {type === 'league' && '⚡ League'}
            {type === 'women' && '👩 Women'}
          </Link>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-8">
        {['live', 'recent', 'upcoming'].map(filter => (
          <button
            key={filter}
            className={`px-5 py-2 rounded-full text-sm font-semibold shadow-sm transition-all duration-300 ${
              selectedFilter === filter
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-20 col-span-full">
            No matches available
          </p>
        ) : (
          matches.map((match) => {
            const { matchInfo, team1, team2 } = match;
            return (
              <div
                key={matchInfo.matchId}
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/livescore/${matchInfo.matchId}`)}
              >
                <h3 className="text-lg font-bold mb-1 text-blue-800 dark:text-blue-400">
                  {matchInfo.seriesName}
                  {match.matchStarted && !match.matchEnded && (
                    <span className="text-red-500 text-sm ml-2 animate-pulse">● Live</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{matchInfo.matchDesc}</p>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">{matchInfo.status}</p>

                <div className="flex justify-between items-center mt-4">
                  {[team1, team2].map((team) => {
                    const score = getTeamScore(match, team.teamId);
                    return (
                      <div key={team.teamId} className="flex items-center gap-3 w-1/2">
                        <img
                          src={getTeamLogo(team)}
                          alt={team.teamName}
                          className="w-10 h-10 rounded-full object-cover border"
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
                        />
                        <div>
                          <h4 className="text-sm font-semibold">{team.teamName}</h4>
                          {score && (
                            <p className="text-xs">
                              {score.runs}/{score.wickets} ({score.overs})
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-sm mt-4 space-y-1 text-gray-600 dark:text-gray-300">
                  <p><span className="font-semibold">🏟️ Venue:</span> {matchInfo.venueInfo?.ground || 'Unknown venue'}</p>
                  <p><span className="font-semibold">📅 Date:</span> {new Date(parseInt(matchInfo.startDate)).toLocaleString()}</p>
                  <p><span className="font-semibold">📝 Format:</span> {matchInfo.matchFormat}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Matches;
