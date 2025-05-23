import React, { useState } from 'react';
import axios from 'axios';
import '../PlayerStats.css';

const RAPIDAPI_KEY = '41b9c77e66msh6ca543119d2459ap137ef6jsne7f855b357c6'; // Replace with your key

const PlayerStats = () => {
  const [query, setQuery] = useState('');
  const [playerList, setPlayerList] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [battingStats, setBattingStats] = useState(null);
  const [bowlingStats, setBowlingStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Search players by name
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
      if (players.length === 0) {
        alert('No players found.');
      }
      setPlayerList(players);
    } catch (err) {
      console.error('Error during search:', err);
      alert('Error while searching for players.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch detailed player info, batting, and bowling stats by player id
  const fetchPlayerDetails = async (player) => {
    setLoading(true);
    setBattingStats(null);
    setBowlingStats(null);
    setPlayerInfo(null);
    setSelectedPlayer(player);
    setPlayerList([]);

    try {
      // Fetch player info
      const infoResponse = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );
      setPlayerInfo(infoResponse.data);

      // Fetch batting stats
      const battingResponse = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/batting`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );
      setBattingStats(battingResponse.data);

      // Fetch bowling stats
      const bowlingResponse = await axios.get(
        `https://cricbuzz-cricket.p.rapidapi.com/stats/v1/player/${player.id}/bowling`,
        {
          headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
          },
        }
      );
      setBowlingStats(bowlingResponse.data);

    } catch (err) {
      console.error('Error fetching player details or stats:', err);
      alert('Error while fetching player details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Search Cricketer Stats</h2>

      <div className="search-section">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter player name"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={loading}>
          Search
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      {playerList.length > 0 && (
        <div className="player-list">
          <h3>Select a Player:</h3>
          <ul>
            {playerList.map((player) => (
              <li
                key={player.id}
                className="player-item"
                onClick={() => fetchPlayerDetails(player)}
              >
                {player.name} - <span>{player.teamName}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(playerInfo || battingStats || bowlingStats) && (
        <div
          className="details-container"
          style={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}
        >
          {/* Player Info */}
          {playerInfo && (
            <div className="player-info" style={{ flex: '1', maxWidth: '300px' }}>
              <img
                src={playerInfo.image}
                alt={playerInfo.name}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }}
              />
              <h3>
                {playerInfo.name} {playerInfo.nickName ? `(${playerInfo.nickName})` : ''}
              </h3>
              <p><strong>Country:</strong> {playerInfo.intlTeam}</p>
              <p><strong>Role:</strong> {playerInfo.role}</p>
              <p><strong>Batting Style:</strong> {playerInfo.bat}</p>
              <p><strong>Bowling Style:</strong> {playerInfo.bowl}</p>
              <p><strong>Date of Birth:</strong> {playerInfo.DoBFormat || playerInfo.DoB}</p>
              <p><strong>Birth Place:</strong> {playerInfo.birthPlace}</p>
              <p><strong>Height:</strong> {playerInfo.height}</p>
              <p><strong>Teams:</strong> {playerInfo.teams}</p>

              <div
                className="player-bio"
                style={{ marginTop: '10px', fontSize: '0.9rem', color: '#333', maxHeight: '300px', overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: playerInfo.bio }}
              />

              <a
                href={playerInfo.appIndex?.webURL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'block', marginTop: '10px', color: '#007bff' }}
              >
                View Full Profile on Cricbuzz
              </a>
            </div>
          )}

          {/* Batting & Bowling Stats */}
          <div style={{ flex: '2 1 600px', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Batting Stats */}
            {battingStats && (
              <div className="table-wrapper" style={{ flex: '1 1 280px', overflowX: 'auto' }}>
                <h3>Batting Stats - {selectedPlayer?.name}</h3>
                <table>
                  <thead>
                    <tr>
                      {battingStats.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {battingStats.values.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.values.map((val, cIdx) => (
                          <td key={cIdx}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bowling Stats */}
            {bowlingStats && (
              <div className="table-wrapper" style={{ flex: '1 1 280px', overflowX: 'auto' }}>
                <h3>Bowling Stats - {selectedPlayer?.name}</h3>
                <table>
                  <thead>
                    <tr>
                      {bowlingStats.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bowlingStats.values.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.values.map((val, cIdx) => (
                          <td key={cIdx}>{val}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
