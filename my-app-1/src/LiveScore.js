import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCrown, FaPlane } from 'react-icons/fa';
import { GiGloves } from 'react-icons/gi';

const Livescore = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`,
          headers: {
            'x-rapidapi-key': '781952eb6fmshdc067305c66003dp170907jsn612eebfd4411',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };
        const response = await axios.request(options);
        setMatchData(response.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.status === 429
            ? 'API rate limit exceeded. Please try again later.'
            : 'Failed to fetch match details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white animate-pulse">
        <p>Loading match details...</p>
      </div>
    );

  if (error)
    return <div className="text-center text-red-400 font-semibold py-20">{error}</div>;

  if (!matchData)
    return <div className="text-center text-red-400 font-semibold py-20">No match data available</div>;

  const header = matchData.matchHeader;
  const scoreCards = matchData.scoreCard || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-6 px-4 py-2 bg-gradient-to-r from-teal-600 to-green-500 hover:from-teal-700 hover:to-green-600 transition-all duration-300 rounded-lg text-sm font-semibold shadow-lg"
          onClick={() => navigate('/')}
        >
          ⬅ Back to Home
        </button>

        <div className="glass p-6 rounded-xl shadow-2xl border border-teal-500 mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-300 mb-2">{header.seriesDesc}</h1>
          <p className="text-teal-400 mb-1 text-sm sm:text-base font-semibold">{header.matchDescription}</p>
          <p className="italic text-yellow-300 mb-4">{header.status}</p>

          <div className="flex gap-6 text-teal-100 text-sm sm:text-base font-semibold">
            <span>{matchData.cb11?.team1Sname}</span>
            <span className="text-gray-400">vs</span>
            <span>{matchData.cb11?.team2Sname}</span>
          </div>

          {/* Player of the Match */}
          {header?.playersOfTheMatch?.length > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-gray-800 shadow-inner">
              <h3 className="text-yellow-300 font-semibold">Player of the Match</h3>
              <p className="text-teal-100 mt-1 text-sm">
                {header.playersOfTheMatch[0].fullName} ({header.playersOfTheMatch[0].teamName})
              </p>
            </div>
          )}

          {/* Player of the Series */}
          {header?.playersOfTheSeries?.length > 0 && (
            <div className="mt-4 p-4 rounded-lg bg-gray-800 shadow-inner">
              <h3 className="text-yellow-300 font-semibold">Player of the Series</h3>
              <p className="text-teal-100 mt-1 text-sm">
                {header.playersOfTheSeries[0].fullName} ({header.playersOfTheSeries[0].teamName})
              </p>
            </div>
          )}
        </div>

        {/* Scorecards */}
        {scoreCards.map((innings, index) => {
          const batsmen = Object.values(innings?.batTeamDetails?.batsmenData || {});
          const bowlers = Object.values(innings?.bowlTeamDetails?.bowlersData || {});
          const extras = innings?.extrasData || {};
          const wickets = Object.values(innings?.wicketsData || {});
          const partnerships = Object.values(innings?.partnershipsData || {});
          const score = innings?.scoreDetails || {};

          return (
            <div key={index} className="glass mb-10 p-6 rounded-xl border border-gray-700 shadow-lg transition hover:shadow-2xl">
              <h2 className="text-xl text-teal-200 font-semibold mb-3">
                {innings?.batTeamDetails?.batTeamName} Innings
                <span className="text-teal-400 ml-2 text-sm">
                  {score.runs}/{score.wickets} ({score.overs} ov)
                </span>
              </h2>

              {/* Batting */}
              <div className="overflow-x-auto mb-6">
                <h3 className="text-teal-300 font-semibold mb-2">Batting</h3>
                <table className="w-full table-auto text-sm border-collapse">
                  <thead className="bg-gray-800 text-teal-200">
                    <tr>
                      <th className="text-left px-2 py-1">Batter</th>
                      <th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th><th>Dismissal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batsmen.map((b, i) => (
                      <tr key={i} className="border-t border-gray-700 hover:bg-gray-800 transition">
                        <td className="px-2 py-1 font-medium">
                          {b.batName}
                          {b.isCaptain && <FaCrown className="inline ml-1 text-yellow-400" title="Captain" />}
                          {b.isKeeper && <GiGloves className="inline ml-1 text-blue-400" title="Wicket Keeper" />}
                          {b.isOverseas && <FaPlane className="inline ml-1 text-gray-400" title="Overseas Player" />}
                        </td>
                        <td className="text-center">{b.runs}</td>
                        <td className="text-center">{b.balls}</td>
                        <td className="text-center">{b.fours}</td>
                        <td className="text-center">{b.sixes}</td>
                        <td className="text-center">{b.strikeRate || '-'}</td>
                        <td className="text-center text-gray-400">{b.outDesc || 'Not out'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bowling */}
              <div className="overflow-x-auto mb-6">
                <h3 className="text-teal-300 font-semibold mb-2">Bowling</h3>
                <table className="w-full table-auto text-sm border-collapse">
                  <thead className="bg-gray-800 text-teal-200">
                    <tr>
                      <th className="text-left px-2 py-1">Bowler</th>
                      <th>O</th><th>M</th><th>R</th><th>W</th><th>ECO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlers.map((bowler, i) => (
                      <tr key={i} className="border-t border-gray-700 hover:bg-gray-800 transition">
                        <td className="px-2 py-1">{bowler.bowlName}</td>
                        <td className="text-center">{bowler.overs}</td>
                        <td className="text-center">{bowler.maidens}</td>
                        <td className="text-center">{bowler.runs}</td>
                        <td className="text-center">{bowler.wickets}</td>
                        <td className="text-center">{bowler.economy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Extras & Wickets */}
              <div className="text-sm text-gray-300 space-y-4">
                <div>
                  <span className="text-teal-300 font-semibold">Extras:</span>{' '}
                  {extras.total || 0} (b {extras.byes || 0}, lb {extras.legByes || 0}, w {extras.wides || 0}, nb {extras.noBalls || 0})
                </div>

                {wickets.length > 0 && (
                  <div>
                    <h4 className="text-teal-300 font-semibold">Fall of Wickets</h4>
                    <div className="space-y-1">
                      {wickets.map((w, i) => (
                        <div key={i}>
                          <strong>{w.batName}</strong> – {w.wktRuns}/{w.wktNbr} <span className="text-gray-400">({w.wktOver} ov)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {partnerships.length > 0 && (
                  <div>
                    <h4 className="text-teal-300 font-semibold">Key Partnerships</h4>
                    <div className="space-y-1">
                      {partnerships.map((p, i) => (
                        <div key={i}>
                          {p.bat1Name} ({p.bat1Runs}) & {p.bat2Name} ({p.bat2Runs}) –{' '}
                          <span className="text-teal-200">{p.totalRuns} runs</span>{' '}
                          <span className="text-gray-400">({p.totalBalls} balls)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Livescore;
