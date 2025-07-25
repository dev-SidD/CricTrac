import React, { useState } from 'react';
import axios from 'axios';

const RAPIDAPI_KEY = '781952eb6fmshdc067305c66003dp170907jsn612eebfd4411';

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

  const handleSearch = async () => {
    setBattingStats(null);
    setBowlingStats(null);
    setPlayerInfo(null);
    setSelectedPlayer(null);
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
      if (players.length === 0) alert('No players found.');
      setPlayerList(players);
    } catch {
      alert('Error while searching for players.');
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

    try {
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
        : 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c616514/rohit-sharma.jpg';
      setPlayerImage(imageUrl);

      const batRes = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/batting`,
        { headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com' } }
      );
      setBattingStats(batRes.data);

      const bowlRes = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/bowling`,
        { headers: { 'x-rapidapi-key': RAPIDAPI_KEY, 'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com' } }
      );
      setBowlingStats(bowlRes.data);
    } catch {
      alert('Error while fetching player details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white font-poppins">
      <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text mb-8">
        Cricketer Stats Search
      </h2>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter player name"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full sm:w-80 px-4 py-2 rounded-md border border-gray-600 text-black shadow-md"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:opacity-90 rounded-lg font-semibold text-white shadow-md"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-center text-sm text-gray-400 mb-4">Loading...</p>}

      {playerList.length > 0 && (
        <div className="bg-gray-900 rounded-xl p-5 mb-6 shadow-md">
          <h3 className="text-lg font-semibold text-teal-300 mb-3">Select a Player:</h3>
          <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
            {playerList.map((player) => (
              <li
                key={player.id}
                className="bg-gray-800 hover:bg-gray-700 transition rounded-lg px-4 py-2 cursor-pointer"
                onClick={() => fetchPlayerDetails(player)}
              >
                <span className="font-medium">{player.name}</span>
                <span className="block text-sm text-gray-400">{player.teamName}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(playerInfo || battingStats || bowlingStats) && (
        <div className="space-y-8">
          {playerInfo && (
            <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img
                  src={playerImage}
                  alt={playerInfo.name}
                  className="w-36 h-36 rounded-full object-cover border-2 border-teal-400 shadow"
                />
                <div className="space-y-2 text-sm sm:text-base">
                  <p><strong>Name:</strong> {playerInfo.name} {playerInfo.nickName && `(${playerInfo.nickName})`}</p>
                  <p><strong>Country:</strong> {playerInfo.intlTeam}</p>
                  <p><strong>Role:</strong> {playerInfo.role}</p>
                  <p><strong>Batting Style:</strong> {playerInfo.bat}</p>
                  <p><strong>Bowling Style:</strong> {playerInfo.bowl}</p>
                  <p><strong>DOB:</strong> {playerInfo.DoBFormat || playerInfo.DoB}</p>
                  <p><strong>Birth Place:</strong> {playerInfo.birthPlace}</p>
                  <p><strong>Height:</strong> {playerInfo.height}</p>
                  <p><strong>Teams:</strong> {playerInfo.teams}</p>
                </div>
              </div>

              {playerInfo.bio && (
                <div className="mt-4 text-sm text-gray-300 leading-relaxed">
                  <div dangerouslySetInnerHTML={{
                    __html: showFullBio
                      ? playerInfo.bio
                      : `${playerInfo.bio.slice(0, 400)}...`,
                  }} />
                  {playerInfo.bio.length > 400 && (
                    <button
                      className="mt-2 text-teal-400 hover:underline"
                      onClick={() => setShowFullBio(!showFullBio)}
                    >
                      {showFullBio ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {battingStats && (
            <div className="bg-gray-800 p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-teal-300 mb-3">Batting Stats - {selectedPlayer?.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-teal-600 text-white">
                    <tr>{battingStats.headers.map((h, i) => <th key={i} className="p-2">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {battingStats.values.map((row, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        {row.values.map((val, j) => <td key={j} className="p-2">{val}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {bowlingStats && (
            <div className="bg-gray-800 p-5 rounded-xl shadow">
              <h3 className="text-lg font-semibold text-teal-300 mb-3">Bowling Stats - {selectedPlayer?.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-teal-600 text-white">
                    <tr>{bowlingStats.headers.map((h, i) => <th key={i} className="p-2">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {bowlingStats.values.map((row, i) => (
                      <tr key={i} className="border-b border-gray-700">
                        {row.values.map((val, j) => <td key={j} className="p-2">{val}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
