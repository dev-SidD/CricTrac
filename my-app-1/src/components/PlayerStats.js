import React, { useState } from 'react';
import axios from 'axios';

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
  const [searchError, setSearchError] = useState(null); // New state for search-specific errors
  const [detailsError, setDetailsError] = useState(null); // New state for details-specific errors

  const handleSearch = async () => {
    setBattingStats(null);
    setBowlingStats(null);
    setPlayerInfo(null);
    setSelectedPlayer(null);
    setPlayerList([]); // Clear previous list on new search
    setSearchError(null); // Clear previous errors
    setDetailsError(null);
    setLoading(true);

    try {
      const res = await axios.get(
        'https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/search',
        {
          params: { plrN: query },
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );

      const players = res.data.player || [];
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
    setPlayerList([]); // Clear player list after selection
    setPlayerImage('');
    setShowFullBio(false); // Reset bio state for new player
    setSearchError(null); // Clear search errors once details are being fetched
    setDetailsError(null); // Clear previous errors

    try {
      // Fetch Player Info
      const infoRes = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );
      const data = infoRes.data;
      setPlayerInfo(data);

      const faceImageId = data.faceImageId;
      const formattedName = player.name.toLowerCase().replace(/\s+/g, '-');
      const imageUrl = faceImageId
        ? `https://static.cricbuzz.com/a/img/v1/152x152/i1/c${faceImageId}/${formattedName}.jpg`
        : `https://api.dicebear.com/7.x/initials/svg?seed=${player.name.split(' ').map(n => n[0]).join('')}&radius=50&size=152`; // Fallback to initials if no image

      setPlayerImage(imageUrl);

      // Fetch Batting Stats
      const batRes = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/batting`,
        { headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com' } }
      );
      setBattingStats(batRes.data);

      // Fetch Bowling Stats
      const bowlRes = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/bowling`,
        { headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com' } }
      );
      setBowlingStats(bowlRes.data);
    } catch (err) {
      console.error("Error fetching player details:", err);
      setDetailsError('Failed to fetch player details or stats. This might be due to API limits or data not available.');
      setPlayerInfo(null); // Clear partial data
      setBattingStats(null);
      setBowlingStats(null);
      setPlayerImage('');
      setSelectedPlayer(null); // Reset selected player to show search again
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-poppins transition-colors duration-300 py-8 ">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg  md:p-8">

        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-blue-600 dark:text-blue-400 mb-8 tracking-wide">
          Cricketer Stats
        </h2>

        {/* Search Input and Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search player name"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full sm:w-96 px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Search'
            )}
          </button>
        </div>

        {/* Loading and Error Messages */}
        {loading && !selectedPlayer && (
            <p className="text-center text-blue-500 dark:text-blue-300 text-lg mb-4 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Fetching player list...
            </p>
        )}
        {searchError && (
          <p className="text-center text-red-600 dark:text-red-400 text-lg mb-4">{searchError}</p>
        )}
        {detailsError && (
          <p className="text-center text-red-600 dark:text-red-400 text-lg my-8">{detailsError}</p>
        )}

        {/* Player List */}
        {!loading && playerList.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 mb-8 shadow-inner border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Select a Player:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {playerList.map((player) => (
                <li
                  key={player.id}
                  className="bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-600 transition-colors duration-200 rounded-lg px-5 py-3 cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700"
                  onClick={() => fetchPlayerDetails(player)}
                >
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{player.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{player.teamName}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Selected Player Details */}
        {selectedPlayer && (
          loading ? (
            <p className="text-center text-blue-500 dark:text-blue-300 text-lg my-8 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading {selectedPlayer.name}'s details...
            </p>
          ) : (
            <div className="space-y-8">
              {playerInfo && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start mb-6">
                    <img
                      src={playerImage}
                      alt={playerInfo.name}
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-md flex-shrink-0"
                      onError={(e) => {
                         // Fallback to initials if image fails to load
                         const initials = selectedPlayer.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                         e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&radius=50&size=152`;
                         e.target.style.background = '#e0f2f1'; // Light background for the initial avatar
                      }}
                    />
                    <div className="text-center md:text-left">
                      <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{playerInfo.name}</h3>
                      {playerInfo.nickName && <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">"{playerInfo.nickName}"</p>}
                      <p className="text-md text-gray-700 dark:text-gray-300 font-medium">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Role:</span> {playerInfo.role || 'N/A'}
                      </p>
                      <p className="text-md text-gray-700 dark:text-gray-300 font-medium">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">Country:</span> {playerInfo.intlTeam || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-base md:text-lg border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                      <p><strong className="text-gray-900 dark:text-gray-100">Batting Style:</strong> {playerInfo.bat || 'N/A'}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Bowling Style:</strong> {playerInfo.bowl || 'N/A'}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">DOB:</strong> {playerInfo.DoBFormat || playerInfo.DoB || 'N/A'}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Birth Place:</strong> {playerInfo.birthPlace || 'N/A'}</p>
                      <p><strong className="text-gray-900 dark:text-gray-100">Height:</strong> {playerInfo.height || 'N/A'}</p>
                      <p className="sm:col-span-2"><strong className="text-gray-900 dark:text-gray-100">Teams:</strong> {playerInfo.teams || 'N/A'}</p>
                  </div>

                  {playerInfo.bio && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Biography:</h4>
                      <div dangerouslySetInnerHTML={{
                        __html: showFullBio
                          ? playerInfo.bio
                          : `${playerInfo.bio.slice(0, 400)}${playerInfo.bio.length > 400 ? '...' : ''}`,
                      }} />
                      {playerInfo.bio.length > 400 && (
                        <button
                          className="mt-3 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold underline"
                          onClick={() => setShowFullBio(!showFullBio)}
                        >
                          {showFullBio ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {battingStats && battingStats.values.length > 0 ? (
                <div className="dark:bg-gray-800 rounded-xl  ">
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Batting Stats</h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {battingStats.headers.map((h, i) => (
                            <th
                              key={i}
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {battingStats.values.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            {row.values.map((val, j) => (
                              <td key={j} className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-gray-200">
                                {val || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                !loading && <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-4">No batting stats available for {selectedPlayer.name}.</p>
              )}

              {bowlingStats && bowlingStats.values.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 ">
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Bowling Stats</h3>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          {bowlingStats.headers.map((h, i) => (
                            <th
                              key={i}
                              scope="col"
                              className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {bowlingStats.values.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            {row.values.map((val, j) => (
                              <td key={j} className="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-gray-200">
                                {val || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                !loading && <p className="text-center text-gray-500 dark:text-gray-400 text-lg mt-4">No bowling stats available for {selectedPlayer.name}.</p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default PlayerStats;