import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Matches = () => {
  const { matchType } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setLoading(true);
      setError(null);
      try {
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/matches/v1/${selectedFilter}`,
          headers: {
            'x-rapidapi-key': '03bf74d969msh9ec9586f18b25c7p1105e7jsnbf3da790dc00',
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
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to fetch matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedFilter, matchType]);

  return (
    <div className="p-4  text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300 font-poppins shadow-lg ">
      {/* Navigation */}
      <div className="flex gap-4 mb-6 text-[12px] font-semibold border-b border-gray-200 dark:border-gray-700 pb-3 justify-center md:justify-start overflow-x-auto">
        {Object.keys(matchTypeMap).map(type => (
          <Link
            key={type}
            to={`/matches/${type}`}
            className={`
              relative pb-2 group transition-all duration-300 whitespace-nowrap
              ${matchType === type
                ? 'font-bold text-blue-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300'
              }
            `}
          >
            {type === 'international' && '🌍 International'}
            {type === 'domestic' && '🏏 Domestic'}
            {type === 'league' && '⚡ League'}
            {type === 'women' && '👩 Women'}
            <span className={`
              absolute bottom-0 left-0 w-full h-0.5 rounded-full transition-transform duration-300
              ${matchType === type
                ? 'bg-blue-600 dark:bg-blue-400 scale-x-100'
                : 'bg-blue-400 dark:bg-blue-600 scale-x-0 group-hover:scale-x-100'
              }
            `}></span>
          </Link>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {['live', 'recent', 'upcoming'].map(filter => (
          <button
            key={filter}
            className={`
              px-6 py-2 rounded-full text-sm font-semibold shadow-md
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${selectedFilter === filter
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white dark:from-blue-500 dark:to-blue-600'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
              }
            `}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading, Error, and Match Cards */}
      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-xl font-medium text-gray-600 dark:text-gray-400">Loading matches...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-600 dark:text-red-400 text-xl font-semibold mt-20">{error}</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 text-xl font-medium mt-20 col-span-full">
          No matches available for this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const { matchInfo, team1, team2 } = match;
            return (
              <div
                key={matchInfo.matchId}
                className="
                  border border-gray-200 dark:border-gray-700 rounded-xl p-5
                  bg-white dark:bg-gray-800 shadow-md hover:shadow-xl
                  transform hover:-translate-y-1 transition-all duration-300
                  cursor-pointer relative overflow-hidden
                "
                onClick={() => navigate(`/livescore/${matchInfo.matchId}`)}
              >
                {match.matchStarted && !match.matchEnded && (
                  <span className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    LIVE
                  </span>
                )}
                <h3 className="text-lg font-extrabold mb-1 text-blue-800 dark:text-blue-400">
                  {matchInfo.seriesName}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{matchInfo.matchDesc}</p>
                <p className="text-green-600 dark:text-green-400 text-sm font-semibold mb-4">{matchInfo.status}</p>

                <div className="flex  gap-4">
                  {[team1, team2].map((team) => {
                    const score = getTeamScore(match, team.teamId);
                    return (
                      <div key={team.teamId} className="flex items-center gap-4">
                        <img
                          src={getTeamLogo(team)}
                          alt={team.teamName}
                          className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600 shadow-sm flex-shrink-0"
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
                        <div className="flex-1">
                          <h4 className="text-md font-bold text-gray-900 dark:text-gray-100">{team.teamName}</h4>
                          {score && (
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">{score.runs}/{score.wickets}</span> ({score.overs})
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                  <p className="flex items-center"><span className="font-semibold mr-2">🏟️ Venue:</span> {matchInfo.venueInfo?.ground || 'Unknown venue'}</p>
                  <p className="flex items-center"><span className="font-semibold mr-2">📅 Date:</span> {new Date(parseInt(matchInfo.startDate)).toLocaleString()}</p>
                  <p className="flex items-center"><span className="font-semibold mr-2">📝 Format:</span> {matchInfo.matchFormat}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;