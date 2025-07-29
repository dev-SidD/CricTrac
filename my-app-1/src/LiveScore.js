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

  const matchTypeMap = {
    international: 'International',
    domestic: 'Domestic',
    league: 'League',
    women: 'Women'
  };

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

  const getTeamScore = (match, teamId) => {
    if (!match.matchScore) return null;
    const teamKey = teamId === match.matchInfo.team1.teamId ? 'team1Score' : 'team2Score';
    const innings = match.matchScore[teamKey];
    return innings ? Object.values(innings)[0] : null;
  };

  useEffect(() => {
    const fetchMatchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const options = {
          method: 'GET',
          url: `https://cricbuzz-cricket.p.rapidapi.com/mcenter/v1/${matchId}/scard`,
          headers: {
            'x-rapidapi-key': '41b9c77e66msh6ca543119d2459ap137ef6jsne7f855b357c6',
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
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-xl font-semibold">Loading match details...</p>
      </div>
    );

  if (error)
    return <div className="text-center text-red-600 dark:text-red-400 font-semibold py-20 bg-gray-100 dark:bg-gray-900 min-h-screen">{error}</div>;

  if (!matchData)
    return <div className="text-center text-red-600 dark:text-red-400 font-semibold py-20 bg-gray-100 dark:bg-gray-900 min-h-screen">No match data available</div>;

  const header = matchData.matchHeader;
  const scoreCards = matchData.scoreCard || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100  font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-8 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Matches
        </button>

        {/* Match Header Section */}
        <div className="bg-white dark:bg-gray-800 p-6  shadow-lg border border-gray-200 dark:border-gray-700 mb-10 text-center">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-2 leading-tight">
            {header.seriesDesc}
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-1 font-medium">{header.matchDescription}</p>
          <p className={`text-md lg:text-lg font-semibold mb-4
            ${header.status.includes('Live') ? 'text-green-600 dark:text-green-400 animate-pulse' :
              header.status.includes('Complete') || header.status.includes('Result') ? 'text-blue-600 dark:text-blue-400' :
              'text-yellow-600 dark:text-yellow-400'
            }`}>
            {header.status}
          </p>

          <div className="flex justify-center items-center gap-4 text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
            <span>{matchData.cb11?.team1Sname}</span>
            <span className="text-gray-400 px-2 text-base">vs</span>
            <span>{matchData.cb11?.team2Sname}</span>
          </div>

          {/* Player of the Match / Series */}
          {(header?.playersOfTheMatch?.length > 0 || header?.playersOfTheSeries?.length > 0) && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
              {header?.playersOfTheMatch?.length > 0 && (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner text-left">
                  <h3 className="text-blue-600 dark:text-blue-400 font-bold mb-1 flex items-center lg:text-lg">
                    <FaCrown className="mr-2 text-yellow-500 text-lg lg:text-xl" /> Player of the Match
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 text-base lg:text-lg">
                    {header.playersOfTheMatch[0].fullName} <span className="text-gray-500 dark:text-gray-400 text-sm lg:text-base">({header.playersOfTheMatch[0].teamName})</span>
                  </p>
                </div>
              )}

              {header?.playersOfTheSeries?.length > 0 && (
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

        {/* Scorecards */}
        {scoreCards.map((innings, index) => {
          const batsmen = Object.values(innings?.batTeamDetails?.batsmenData || {});
          const bowlers = Object.values(innings?.bowlTeamDetails?.bowlersData || {});
          const extras = innings?.extrasData || {};
          const wickets = Object.values(innings?.wicketsData || {});
          const partnerships = Object.values(innings?.partnershipsData || {});
          const score = innings?.scoreDetails || {};

          return (
            <div key={index} className="bg-white dark:bg-gray-800   shadow-lg mb-10v p-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-blue-700 dark:text-blue-400 mb-3 flex flex-wrap items-baseline">
                {innings?.batTeamDetails?.batTeamName} Innings
                <span className="text-gray-600 dark:text-gray-300 ml-2 text-base lg:text-xl font-semibold">
                  {score.runs}/{score.wickets} <span className="font-normal text-sm lg:text-base">({score.overs} ov)</span>
                </span>
              </h2>

              {/* Batting Table */}
              <div className="overflow-x-auto mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Batting</h3>
                <table className="w-full text-left text-sm lg:text-base border-collapse rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium uppercase text-xs lg:text-sm">
                    <tr>
                      <th className="p-2">Batter</th> {/* This column will now contain name + dismissal */}
                      <th className="p-2 text-center">R</th>
                      <th className="p-2 text-center">B</th>
                      <th className="p-2 text-center">4s</th>
                      <th className="p-2 text-center">6s</th>
                      <th className="p-2 text-center">SR</th>
                      {/* Removed Dismissal column header */}
                    </tr>
                  </thead>
                  <tbody>
                    {batsmen.length > 0 ? (
                      batsmen.map((b, i) => (
                        <tr key={i} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">
                            <div className="flex items-center">
                                <span>{b.batName}</span>
                                {b.isCaptain && <FaCrown className="inline ml-1 text-yellow-500 text-base lg:text-lg" title="Captain" />}
                                {b.isKeeper && <GiGloves className="inline ml-1 text-blue-500 text-base lg:text-lg" title="Wicket Keeper" />}
                                {b.isOverseas && <FaPlane className="inline ml-1 text-gray-500 text-base lg:text-lg" title="Overseas Player" />}
                            </div>
                            {b.outDesc && ( // Only show if dismissal exists
                                <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm mt-0.5">{b.outDesc}</p>
                            )}
                          </td>
                          <td className="p-2 text-center font-bold">{b.runs}</td>
                          <td className="p-2 text-center">{b.balls}</td>
                          <td className="p-2 text-center">{b.fours}</td>
                          <td className="p-2 text-center">{b.sixes}</td>
                          <td className="p-2 text-center">{b.strikeRate || '-'}</td>
                          {/* Removed Dismissal column data */}
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="p-3 text-center text-gray-500">No batting data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bowling Table */}
              <div className="overflow-x-auto mb-6">
                <h3 className="text-xl lg:text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Bowling</h3>
                <table className="w-full text-left text-sm lg:text-base border-collapse rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium uppercase text-xs lg:text-sm">
                    <tr>
                      <th className="p-3">Bowler</th>
                      <th className="p-3 text-center">O</th>
                      <th className="p-3 text-center">M</th>
                      <th className="p-3 text-center">R</th>
                      <th className="p-3 text-center">W</th>
                      <th className="p-3 text-center">ECO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bowlers.length > 0 ? (
                      bowlers.map((bowler, i) => (
                        <tr key={i} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-3 font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{bowler.bowlName}</td>
                          <td className="p-3 text-center">{bowler.overs}</td>
                          <td className="p-3 text-center">{bowler.maidens}</td>
                          <td className="p-3 text-center">{bowler.runs}</td>
                          <td className="p-3 text-center font-bold text-red-600 dark:text-red-400">{bowler.wickets}</td>
                          <td className="p-3 text-center">{bowler.economy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="6" className="p-3 text-center text-gray-500">No bowling data available.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Extras, Fall of Wickets, Partnerships */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm lg:text-base text-gray-700 dark:text-gray-300">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:text-lg">Extras</h4>
                  <p>
                    <span className="font-medium">Total:</span> {extras.total || 0} (
                    b <span className="font-semibold">{extras.byes || 0}</span>,
                    lb <span className="font-semibold">{extras.legByes || 0}</span>,
                    w <span className="font-semibold">{extras.wides || 0}</span>,
                    nb <span className="font-semibold">{extras.noBalls || 0}</span>
                    )
                  </p>
                </div>

                {wickets.length > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:text-lg">Fall of Wickets</h4>
                    <ul className="space-y-1">
                      {wickets.map((w, i) => (
                        <li key={i}>
                          <strong>{w.batName}</strong> – <span className="font-semibold text-blue-500">{w.wktRuns}/{w.wktNbr}</span> <span className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm">({w.wktOver} ov)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {partnerships.length > 0 && (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner md:col-span-2">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 lg:text-lg">Key Partnerships</h4>
                    <ul className="space-y-1">
                      {partnerships.map((p, i) => (
                        <li key={i} className="flex flex-wrap items-center">
                          <span className="font-medium">{p.bat1Name} ({p.bat1Runs}) & {p.bat2Name} ({p.bat2Runs})</span>
                          <span className="mx-2 text-gray-500">-</span>
                          <span className="font-bold text-blue-500">{p.totalRuns} runs</span>
                          <span className="ml-2 text-gray-500 dark:text-gray-400 text-xs lg:text-sm">({p.totalBalls} balls)</span>
                        </li>
                      ))}
                    </ul>
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