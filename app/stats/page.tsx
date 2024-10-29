// app/stats/page.tsx
"use client";
import { useEffect } from 'react';
import { useCombinedStats } from '../context/CombinedStatsContext';

export default function Stats() {
  const { teamsData, setTeamsData } = useCombinedStats();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/data/stats.json');
      const data = await response.json();
      setTeamsData(data.teams);
    };
    fetchData();
  }, [setTeamsData]);

  if (!teamsData) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Livestats</h1>
      {Object.entries(teamsData).map(([teamName, players]) => (
        <div key={teamName}>
          <h2>{teamName}</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Position</th>
                <th>Points</th>
                <th>Rebonds</th>
                <th>Passes</th>
                <th>Minutes</th>
                <th>2P%</th>
                <th>3P%</th>
                <th>FT%</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.position}</td>
                  <td>{player.stats.points}</td>
                  <td>{player.stats.rebounds}</td>
                  <td>{player.stats.assists}</td>
                  <td>{player.stats.minutes}</td>
                  <td>{player.stats["2P%"]}</td>
                  <td>{player.stats["3P%"]}</td>
                  <td>{player.stats["FT%"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
