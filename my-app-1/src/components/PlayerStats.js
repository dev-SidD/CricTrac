import React, { useState } from 'react';
import { Search, User, TrendingUp, Target, Award, Calendar, MapPin, Users, Activity, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

const RAPIDAPI_KEY = '41b9c77e66msh6ca543119d2459ap137ef6jsne7f855b357c6';

const PlayerStats = () => {
  const [playerImage, setPlayerImage] = useState('');
  const [query, setQuery] = useState('');
  const [playerList, setPlayerList] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [battingStats, setBattingStats] = useState(null);
  const [bowlingStats, setBowlingStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [detailsError, setDetailsError] = useState(null);

  const handleSearch = async () => {
    setBattingStats(null);
    setBowlingStats(null);
    setPlayerInfo(null);
    setSelectedPlayer(null);
    setPlayerList([]);
    setSearchError(null);
    setDetailsError(null);
    setLoading(true);

    try {
      const response = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search?plrN=${encodeURIComponent(query)}`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      const players = data.player || [];
      
      if (players.length === 0) {
        setSearchError('No players found with that name. Please try a different spelling or a more general name.');
      }
      setPlayerList(players);
    } catch (err) {
      console.error("Error searching players:", err);
      setSearchError('Failed to search for players. Please check your internet connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerDetails = async (player) => {
    setLoading(true);
    setBattingStats(null);
    setBowlingStats(null);
    setPlayerInfo(null);
    setSelectedPlayer(player);
    setPlayerList([]);
    setPlayerImage('');
    setShowFullBio(false);
    setSearchError(null);
    setDetailsError(null);

    try {
      // Fetch Player Info
      const infoResponse = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );
      
      if (!infoResponse.ok) throw new Error('Failed to fetch player info');
      
      const data = await infoResponse.json();
      setPlayerInfo(data);

      const faceImageId = data.faceImageId;
      const formattedName = player.name.toLowerCase().replace(/\s+/g, '-');
      const imageUrl = faceImageId
        ? `https://static.cricbuzz.com/a/img/v1/152x152/i1/c${faceImageId}/${formattedName}.jpg`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${player.name.split(' ').map(n => n[0]).join('')}&radius=50&size=152`;

      setPlayerImage(imageUrl);

      // Fetch Batting Stats
      const batResponse = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/batting`,
        { 
          headers: { 
            'x-rapidapi-key': RAPIDAPI_KEY, 
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com' 
          } 
        }
      );
      
      if (batResponse.ok) {
        const batData = await batResponse.json();
        setBattingStats(batData);
      }

      // Fetch Bowling Stats
      const bowlResponse = await fetch(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/bowling`,
        { 
          headers: { 
            'x-rapidapi-key': RAPIDAPI_KEY, 
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com' 
          } 
        }
      );
      
      if (bowlResponse.ok) {
        const bowlData = await bowlResponse.json();
        setBowlingStats(bowlData);
      }
    } catch (err) {
      console.error("Error fetching player details:", err);
      setDetailsError('Failed to fetch player details or stats. This might be due to API limits or data not available.');
      setPlayerInfo(null);
      setBattingStats(null);
      setBowlingStats(null);
      setPlayerImage('');
      setSelectedPlayer(null);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color = "blue" }) => (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-100 dark:border-gray-700">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"></div>
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-${color}-500 to-${color}-600 text-white mb-4 shadow-lg`}>
          <Icon size={24} />
        </div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">{label}</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 transition-all duration-700">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-400/20 to-cyan-600/20 blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-400/10 to-purple-600/10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Header */}
        <div className="text-center mb-12 relative">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6 shadow-2xl transform hover:scale-110 transition-transform duration-300">
            <Activity size={40} />
          </div>
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4 tracking-tight">
            CrikTrac
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover comprehensive statistics and insights for your favorite cricket players from around the world
          </p>
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for any cricket player..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-14 pr-4 py-6 text-lg bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !query.trim()}
                  className="m-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 group"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Search size={20} />
                      <span className="hidden sm:inline">Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading States */}
        {loading && !selectedPlayer && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">Searching for players...</p>
          </div>
        )}

        {/* Error Messages */}
        {searchError && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">{searchError}</p>
            </div>
          </div>
        )}

        {detailsError && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">{detailsError}</p>
            </div>
          </div>
        )}

        {/* Player Selection Grid */}
        {!loading && playerList.length > 0 && (
          <div className="mb-12">
            <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/20">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Users className="mr-3 text-blue-600" size={28} />
                Select a Player
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {playerList.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => fetchPlayerDetails(player)}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 text-left hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold mr-3">
                          {player.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {player.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{player.teamName}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Player Details */}
        {selectedPlayer && (
          loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
              </div>
              <p className="mt-6 text-xl font-medium text-gray-600 dark:text-gray-400">
                Loading {selectedPlayer.name}'s profile...
              </p>
            </div>
          ) : playerInfo && (
            <div className="space-y-8">
              {/* Player Profile Card */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5"></div>
                <div className="relative z-10 p-8">
                  <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start">
                    {/* Player Image */}
                    <div className="relative group">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                      <img
                        src={playerImage}
                        alt={playerInfo.name}
                        className="relative w-48 h-48 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-2xl"
                        onError={(e) => {
                          const initials = selectedPlayer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&radius=50&size=192`;
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="text-white" size={20} />
                      </div>
                    </div>

                    {/* Player Info */}
                    <div className="flex-1 text-center lg:text-left">
                      <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white mb-2">
                        {playerInfo.name}
                      </h1>
                      {playerInfo.nickName && (
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
                          "{playerInfo.nickName}"
                        </p>
                      )}
                      
                      {/* Key Stats Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <StatCard
                          icon={User}
                          label="Role"
                          value={playerInfo.role || 'N/A'}
                          color="blue"
                        />
                        <StatCard
                          icon={Target}
                          label="Country"
                          value={playerInfo.intlTeam || 'N/A'}
                          color="green"
                        />
                        <StatCard
                          icon={Activity}
                          label="Batting"
                          value={playerInfo.bat || 'N/A'}
                          color="purple"
                        />
                        <StatCard
                          icon={TrendingUp}
                          label="Bowling"
                          value={playerInfo.bowl || 'N/A'}
                          color="indigo"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {playerInfo.DoBFormat || playerInfo.DoB || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-green-600 dark:text-green-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Birth Place</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {playerInfo.birthPlace || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Height</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {playerInfo.height || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {playerInfo.teams && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-start space-x-3">
                        <Users className="text-indigo-600 dark:text-indigo-400 mt-1" size={20} />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Teams</p>
                          <p className="text-gray-900 dark:text-white leading-relaxed">
                            {playerInfo.teams}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Biography */}
                  {playerInfo.bio && (
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <User className="mr-2 text-blue-600" size={24} />
                        Biography
                      </h3>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                        <div 
                          className="text-gray-700 dark:text-gray-300 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: showFullBio
                              ? playerInfo.bio
                              : `${playerInfo.bio.slice(0, 400)}${playerInfo.bio.length > 400 ? '...' : ''}`,
                          }} 
                        />
                        {playerInfo.bio.length > 400 && (
                          <button
                            className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors group"
                            onClick={() => setShowFullBio(!showFullBio)}
                          >
                            <span>{showFullBio ? 'Read Less' : 'Read More'}</span>
                            {showFullBio ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Tables */}
              {battingStats && battingStats.values.length > 0 && (
                <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Target className="mr-3" size={28} />
                      Batting Statistics
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                            {battingStats.headers.map((header, index) => (
                              <th key={index} className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {battingStats.values.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                              {row.values.map((value, colIndex) => (
                                <td key={colIndex} className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">
                                  {value || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {bowlingStats && bowlingStats.values.length > 0 && (
                <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <Activity className="mr-3" size={28} />
                      Bowling Statistics
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                            {bowlingStats.headers.map((header, index) => (
                              <th key={index} className="text-left py-4 px-4 font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bowlingStats.values.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b border-gray-100 dark:border-gray-700 hover:bg-green-50/50 dark:hover:bg-green-900/20 transition-colors">
                              {row.values.map((value, colIndex) => (
                                <td key={colIndex} className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">
                                  {value || 'N/A'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* No Stats Messages */}
              {!battingStats?.values?.length && !bowlingStats?.values?.length && !loading && selectedPlayer && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Statistics Available</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Statistics for {selectedPlayer.name} are not currently available.
                  </p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PlayerStats;