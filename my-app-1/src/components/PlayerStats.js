import React, { useState } from 'react';
import axios from 'axios';
import '../PlayerStats.css';

const RAPIDAPI_KEY = '781952eb6fmshdc067305c66003dp170907jsn612eebfd4411'; // Replace with your key

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
    setPlayerImage(''); // clear previous image while loading

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

      const playerData = infoResponse.data;
      setPlayerInfo(playerData);

      // Construct image URL from faceImageId
      // Generate image URL with faceImageId and formatted player name
      const faceImageId = playerData.faceImageId;
      const formattedName = player.name.toLowerCase().replace(/\s+/g, '-'); // convert to lowercase and replace spaces with hyphens
      const imageUrl = faceImageId
        ? `https://static.cricbuzz.com/a/img/v1/152x152/i1/c${faceImageId}/${formattedName}.jpg`
        : 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c616514/rohit-sharma.jpg'; // fallback

      setPlayerImage(imageUrl);

      console.log(imageUrl)

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
        <div className="details-container">

          {/* Player Info Section */}
          {playerInfo && (
            <section className="section player-section">
              <h2 className="section-title">Player Information</h2>
              <div className="player-info">
                <img src={playerImage} alt={playerInfo.name} className="player-image" />
                <h3>{playerInfo.name} {playerInfo.nickName && `(${playerInfo.nickName})`}</h3>
                <p><strong>Country:</strong> {playerInfo.intlTeam}</p>
                <p><strong>Role:</strong> {playerInfo.role}</p>
                <p><strong>Batting Style:</strong> {playerInfo.bat}</p>
                <p><strong>Bowling Style:</strong> {playerInfo.bowl}</p>
                <p><strong>Date of Birth:</strong> {playerInfo.DoBFormat || playerInfo.DoB}</p>
                <p><strong>Birth Place:</strong> {playerInfo.birthPlace}</p>
                <p><strong>Height:</strong> {playerInfo.height}</p>
                <p><strong>Teams:</strong> {playerInfo.teams}</p>
                <div className="player-bio">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: showFullBio
                        ? playerInfo.bio
                        : `${playerInfo.bio?.slice(0, 400)}...`,
                    }}
                  />
                  {playerInfo.bio && playerInfo.bio.length > 400 && (
                    <button className="toggle-bio" onClick={() => setShowFullBio(!showFullBio)}>
                      {showFullBio ? 'Read less' : 'Read more'}
                    </button>
                  )}
                </div>

              </div>
            </section>
          )}

          {/* Batting Stats Section */}
          {battingStats && (
            <section className="section stats-section">
              <h2 className="section-title">Batting Stats - {selectedPlayer?.name}</h2>
              <div className="table-wrapper">
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
            </section>
          )}

          {/* Bowling Stats Section */}
          {bowlingStats && (
            <section className="section stats-section">
              <h2 className="section-title">Bowling Stats - {selectedPlayer?.name}</h2>
              <div className="table-wrapper">
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
            </section>
          )}

        </div>
      )}

    </div>
  );
};

export default PlayerStats;
