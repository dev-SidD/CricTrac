import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Domestic = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');

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
    return (
      <div className="p-4">
        <div className="flex gap-4 mb-6 text-sm font-medium text-blue-600">
          <Link to="/" className="hover:underline">🌍 International</Link>
          <Link to="/domestic" className="hover:underline font-bold text-blue-800">🏏 Domestic</Link>
          <Link to="/league" className="hover:underline">⚡ League</Link>
          <Link to="/women" className="hover:underline">👩 Women's</Link>
        </div>

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

        <div className="text-gray-500 text-center mt-10 text-lg">No Matches</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6 text-sm font-medium text-blue-600">
        <Link to="/" className="hover:underline">🌍 International</Link>
        <Link to="/domestic" className="hover:underline font-bold text-blue-800">🏏 Domestic</Link>
        <Link to="/league" className="hover:underline">⚡ League</Link>
        <Link to="/women" className="hover:underline">👩 Women's</Link>
      </div>

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

      <div className="grid gap-6">
        {matches.map((match) => {
          const { matchInfo, team1, team2 } = match;
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
                          <p className="text-xs text-gray-700">
                            {score.runs}/{score.wickets} ({score.overs})
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-sm text-gray-600 mt-4 space-y-1">
                <p><span className="font-medium">Venue:</span> {matchInfo.venueInfo?.ground || 'Unknown venue'}</p>
                <p><span className="font-medium">Date:</span> {new Date(parseInt(matchInfo.startDate)).toLocaleString()}</p>
                <p><span className="font-medium">Format:</span> {matchInfo.matchFormat}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Domestic;
