import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCrown, FaPlane } from 'react-icons/fa';
import { GiGloves } from 'react-icons/gi';

// WARNING: It's highly recommended to store API keys in environment variables
// and use a backend proxy to protect them, rather than exposing them in frontend code.
const API_KEY = '03bf74d969msh9ec9586f18b25c7p1105e7jsnbf3da790dc00';

const Livescore = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchData) {
        setLoading(true);
      }
      setError(null);

      try {
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`,
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
          }
        };
        const response = await axios.request(options);
        setMatchData(response.data);
      } catch (err) {
        setError(
          err.response?.status === 429
            ? 'API rate limit exceeded. Please try again later.'
            : 'Failed to fetch match details. Please try again.'
        );
      } finally {
        if (loading) {
            setLoading(false);
        }
      }
    };

    fetchMatchData(); // Initial fetch
    const intervalId = setInterval(fetchMatchData, 10000); // Poll every 10 seconds
    return () => clearInterval(intervalId); // Cleanup on unmount

  }, [matchId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-xl font-semibold">Loading match details...</p>
      </div>
    );

  if (error && !matchData)
    return <div className="text-center text-red-600 dark:text-red-400 font-semibold py-20 bg-gray-100 dark:bg-gray-900 min-h-screen">{error}</div>;

  if (!matchData)
    return <div className="text-center text-gray-500 dark:text-gray-400 font-semibold py-20 bg-gray-100 dark:bg-gray-900 min-h-screen">No match data available</div>;

  // Using optional chaining for safer access
  const header = matchData?.matchHeader;
  const scoreCards = matchData?.scorecard ?? [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4">
        <button
          className="mb-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Matches
        </button>

        {header && (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-10 text-center">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
              {header.seriesDesc}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-1 font-medium">{header.matchDescription}</p>
            <p className={`text-md lg:text-lg font-semibold mb-4
              ${header.status?.includes('Live') ? 'text-green-600 dark:text-green-400 animate-pulse' :
                matchData.status?.includes('won') || header.status?.includes('Complete') ? 'text-blue-600 dark:text-blue-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
              {matchData.status}
            </p>
            <div className="flex justify-center items-center gap-4 text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
              <span>{header.team1?.shortName}</span>
              <span className="text-gray-400 px-2 text-base">vs</span>
              <span>{header.team2?.shortName}</span>
            </div>
            {(header?.playersOfTheMatch?.length > 0 || header?.playersOfTheSeries?.length > 0) && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                {header?.playersOfTheMatch?.[0] && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner text-left">
                     <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-1 flex items-center lg:text-lg">
                       <FaCrown className="mr-2 text-yellow-500 text-lg lg:text-xl" /> Player of the Match
                     </h3>
                     <p className="text-gray-800 dark:text-gray-200 text-base lg:text-lg">
                       {header.playersOfTheMatch[0].fullName} <span className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">({header.playersOfTheMatch[0].teamName})</span>
                     </p>
                   </div>
                )}
                 {header?.playersOfTheSeries?.[0] && (
                   <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner text-left">
                     <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-1 flex items-center lg:text-lg">
                       <FaCrown className="mr-2 text-yellow-500 text-lg lg:text-xl" /> Player of the Series
                     </h3>
                     <p className="text-gray-800 dark:text-gray-200 text-base lg:text-lg">
                       {header.playersOfTheSeries[0].fullName} <span className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">({header.playersOfTheSeries[0].teamName})</span>
                     </p>
                   </div>
                 )}
              </div>
            )}
          </div>
        )}

        {scoreCards.map((innings, index) => {
          // Safer data extraction with default empty arrays
          const batsmen = innings?.batsman ?? [];
          const bowlers = innings?.bowler ?? [];
          const extras = innings?.extras ?? {};
          const wickets = innings?.fow?.fow ?? [];
          const partnerships = innings?.partnership?.partnership ?? [];

          return (
            <div key={innings?.inningsid ?? index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-10 p-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4 flex flex-wrap items-baseline">
                {innings?.batteamname ?? 'N/A'} Innings
                <span className="text-gray-600 dark:text-gray-300 ml-3 text-xl lg:text-2xl font-semibold">
                  {innings?.score ?? '0'}/{innings?.wickets ?? '0'} <span className="font-normal text-lg lg:text-xl">({innings?.overs ?? '0'} ov)</span>
                </span>
              </h2>

              {/* Batting Table */}
              <div className="overflow-x-auto mb-8">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Batting</h3>
                <table className="w-full text-left text-sm lg:text-base border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium uppercase text-xs lg:text-sm">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Batter</th>
                      <th className="p-3 text-center">R</th>
                      <th className="p-3 text-center">B</th>
                      <th className="p-3 text-center">4s</th>
                      <th className="p-3 text-center">6s</th>
                      <th className="p-3 text-center rounded-tr-lg">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batsmen.map((b) => (
                      <tr key={b.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="p-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="font-semibold">{b.name}</span>
                            {b.iscaptain && <FaCrown className="inline ml-2 text-yellow-500" title="Captain" />}
                            {b.iskeeper && <GiGloves className="inline ml-2 text-blue-500" title="Wicket Keeper" />}
                            {b.isoverseas && <FaPlane className="inline ml-2 text-gray-500" title="Overseas Player" />}
                          </div>
                          {b.outdec && (
                              <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm mt-0.5">{b.outdec}</p>
                          )}
                        </td>
                        <td className="p-3 text-center font-bold">{b.runs ?? '0'}</td>
                        <td className="p-3 text-center">{b.balls ?? '0'}</td>
                        <td className="p-3 text-center">{b.fours ?? '0'}</td>
                        <td className="p-3 text-center">{b.sixes ?? '0'}</td>
                        <td className="p-3 text-center">{b.strkrate ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bowling Table */}
              <div className="overflow-x-auto mb-8">
                 <h3 className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Bowling</h3>
                <table className="w-full text-left text-sm lg:text-base border-collapse">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium uppercase text-xs lg:text-sm">
                    <tr>
                      <th className="p-3 rounded-tl-lg">Bowler</th>
                      <th className="p-3 text-center">O</th>
                      <th className="p-3 text-center">M</th>
                      <th className="p-3 text-center">R</th>
                      <th className="p-3 text-center">W</th>
                      <th className="p-3 text-center rounded-tr-lg">ECO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlers.map((bowler) => (
                        <tr key={bowler.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{bowler.name}</td>
                          <td className="p-3 text-center">{bowler.overs ?? '0'}</td>
                          <td className="p-3 text-center">{bowler.maidens ?? '0'}</td>
                          <td className="p-3 text-center">{bowler.runs ?? '0'}</td>
                          <td className="p-3 text-center font-bold text-red-600 dark:text-red-400">{bowler.wickets ?? '0'}</td>
                          <td className="p-3 text-center">{bowler.economy ?? '-'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                   <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:text-lg">Extras</h4>
                  <p>
                    <span className="font-medium">Total:</span> {extras.total ?? 0} (
                    b <span className="font-semibold">{extras.byes ?? 0}</span>,
                    lb <span className="font-semibold">{extras.legbyes ?? 0}</span>,
                    w <span className="font-semibold">{extras.wides ?? 0}</span>,
                    nb <span className="font-semibold">{extras.noballs ?? 0}</span>
                    )
                  </p>
                </div>
                {wickets.length > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:text-lg">Fall of Wickets</h4>
                    <ul className="space-y-1">
                      {wickets.map((w, i) => (
                        <li key={i}>
                          <strong>{w.batsmanname}</strong> – <span className="font-semibold text-blue-500">{w.runs}/{i + 1}</span> <span className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">({w.overnbr} ov)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {partnerships.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner mt-6 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:text-lg">Partnerships</h4>
                  <ul className="space-y-2">
                    {partnerships.map((p, i) => (
                      <li key={i} className="flex flex-wrap items-baseline">
                        <span className="font-medium mr-2">
                          {p.bat1name} ({p.bat1runs}) & {p.bat2name} ({p.bat2runs})
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {p.totalruns} <span className="font-normal text-gray-600 dark:text-gray-400">({p.totalballs} balls)</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Livescore;