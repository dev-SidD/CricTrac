import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const International = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getTeamLogo = (imageId) =>
    `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg`;

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
      <div className="p-4 text-center text-red-600 font-semibold">
        ⚠️ {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600 text-lg">Loading matches...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Navigation */}
      <div className="flex gap-4 mb-6 text-sm font-medium text-blue-600">
        <Link to="/" className="hover:underline">🌍 International</Link>
        <Link to="/domestic" className="hover:underline">🏏 Domestic</Link>
        <Link to="/league" className="hover:underline">⚡ League</Link>
        <Link to="/women" className="hover:underline">👩 Women's</Link>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-4 mb-6">
        {['live', 'recent', 'upcoming'].map(filter => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${
              selectedFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Match Cards */}
      {matches.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No matches found</div>
      ) : (
        <div className="grid gap-6">
          {matches.map(match => {
            const { matchInfo } = match;
            return (
              <div
                key={matchInfo.matchId}
                className="border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/livescore/${matchInfo.matchId}`)}
              >
                <h3 className="text-lg font-semibold mb-1">
                  {matchInfo.seriesName}
                  {match.matchStarted && !match.matchEnded && (
                    <span className="text-red-500 text-sm ml-2">● Live</span>
                  )}
                </h3>
                <p className="text-gray-500 text-sm mb-2">{matchInfo.matchDesc}</p>
                <p className="text-green-600 text-sm font-medium">{matchInfo.status}</p>

                {/* Teams */}
                <div className="flex justify-between items-center mt-4">
                  {[matchInfo.team1, matchInfo.team2].map(team => {
                    const score = getTeamScore(match, team.teamId);
                    return (
                      <div key={team.teamId} className="flex items-center gap-3 w-1/2">
                        <img
                          src={getTeamLogo(team.imageId)}
                          alt={team.teamName}
                          className="w-10 h-10 rounded-full object-cover border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'placeholder-logo.png';
                          }}
                        />
                        <div>
                          <h4 className="text-sm font-semibold">{team.teamName}</h4>
                          {score && (
                            <p className="text-xs text-gray-700">
                              {score.runs}/{score.wickets} ({score.overs})
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Match Info */}
                <div className="text-sm text-gray-600 mt-4 space-y-1">
                  <p><span className="font-medium">Venue:</span> {matchInfo.venueInfo?.ground || 'Unknown'}</p>
                  <p><span className="font-medium">Date:</span> {new Date(parseInt(matchInfo.startDate)).toLocaleString()}</p>
                  <p><span className="font-medium">Format:</span> {matchInfo.matchFormat}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default International;
