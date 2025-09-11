import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Flame, Calendar, CheckCircle, Globe, Shield, Trophy, Users, Loader2, ServerCrash, CalendarX, MapPin, Tv } from 'lucide-react';

const Matches = () => {
  const { matchType = 'international' } = useParams(); // Default to international
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('live');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const matchTypeMap = {
    international: { label: 'International', icon: Globe },
    league: { label: 'League', icon: Trophy },
    domestic: { label: 'Domestic', icon: Shield },
    women: { label: 'Women', icon: Users },
  };

  const getTeamLogo = (team) => {
    if (team.imageId) {
      // Constructing a dynamic URL for the team logo from Cricbuzz's CDN
      return `https://www.cricbuzz.com/a/img/v1/100x100/i1/c${team.imageId}/.jpg`;
    }
    const initials = team.teamName
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&radius=50&size=128&backgroundColor=FFFFFF,039be5,f57c00,d32f2f,8e24aa&textColor=000000,ffffff`;
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
            'x-rapidapi-key': '41b9c77e66msh6ca543119d2459ap137ef6jsne7f855b357c6',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const allMatches = response.data.typeMatches
          .filter(typeMatch => typeMatch.matchType === matchTypeMap[matchType]?.label)
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
        setError('Failed to fetch matches. The API might be down or you have exceeded the request limit.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [selectedFilter, matchType]);
  
  const MatchCard = ({ match }) => {
    const { matchInfo, team1, team2 } = match;
    const team1Score = getTeamScore(match, team1.teamId);
    const team2Score = getTeamScore(match, team2.teamId);

    return (
      <div 
        className="relative group backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-lg hover:shadow-2xl border border-white/20 dark:border-gray-700/50 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
        // onClick={() => navigate(`/livescore/${matchInfo.matchId}`)} // Uncomment when route is ready
      >
        <div className="p-6">
          {match.matchStarted && !match.matchEnded && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
              <Flame size={12}/> LIVE
            </div>
          )}
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1 truncate">{matchInfo.seriesName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{matchInfo.matchDesc}</p>

          <div className="space-y-4 mb-4">
            {/* Team 1 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={getTeamLogo(team1)} alt={team1.teamName} className="w-10 h-10 rounded-full object-cover border-2 border-white/50 dark:border-gray-700 shadow-md"/>
                <span className="font-bold text-gray-800 dark:text-gray-100">{team1.teamName}</span>
              </div>
              {team1Score && (
                <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                  {team1Score.runs}/{team1Score.wickets} <span className="text-sm text-gray-500 dark:text-gray-400">({team1Score.overs})</span>
                </div>
              )}
            </div>
            {/* Team 2 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={getTeamLogo(team2)} alt={team2.teamName} className="w-10 h-10 rounded-full object-cover border-2 border-white/50 dark:border-gray-700 shadow-md"/>
                <span className="font-bold text-gray-800 dark:text-gray-100">{team2.teamName}</span>
              </div>
              {team2Score && (
                <div className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                  {team2Score.runs}/{team2Score.wickets} <span className="text-sm text-gray-500 dark:text-gray-400">({team2Score.overs})</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400 mt-4 leading-tight">{matchInfo.status}</p>
        </div>
        <div className="bg-black/5 dark:bg-black/20 p-4 border-t border-white/20 dark:border-gray-700/50 text-xs text-gray-600 dark:text-gray-400">
           <div className="flex items-center gap-2">
            <MapPin size={14} className="text-purple-500"/>
            <span className="font-medium truncate">{matchInfo.venueInfo?.ground || 'Venue not specified'}</span>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-700">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-600/20 blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 tracking-tight">
            Match Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Follow live scores, recent results, and upcoming fixtures from around the globe.
          </p>
        </div>

        {/* Match Type Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full shadow-md border border-gray-200 dark:border-gray-700">
            {Object.entries(matchTypeMap).map(([key, { label, icon: Icon }]) => (
              <Link
                key={key}
                to={`/matches/${key}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  matchType === key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700/80'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { key: 'live', label: 'Live', icon: Flame },
            { key: 'recent', label: 'Recent', icon: CheckCircle },
            { key: 'upcoming', label: 'Upcoming', icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                selectedFilter === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg focus:ring-purple-500'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-blue-500'
              }`}
              onClick={() => setSelectedFilter(key)}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            </div>
            <p className="mt-6 text-xl font-medium text-gray-600 dark:text-gray-400">Loading Matches...</p>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-800/50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ServerCrash className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-2">An Error Occurred</h3>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16">
             <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CalendarX className="text-gray-400 dark:text-gray-500" size={40} />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Matches Found</h3>
             <p className="text-gray-600 dark:text-gray-400">
               There are no {selectedFilter} {matchTypeMap[matchType].label} matches to display right now.
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.matchInfo.matchId} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;

