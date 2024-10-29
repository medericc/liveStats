// app/components/LiveStats.tsx
"use client";
import { useEffect } from 'react';
import { useCombinedStats } from '../context/CombinedStatsContext';

export default function LiveStats() {
  const { teamsData, updateTeamsData } = useCombinedStats();

  useEffect(() => {
    const intervalId = setInterval(() => {
      updateTeamsData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [updateTeamsData]);

  if (!teamsData) return <div>Chargement des données...</div>;

  return (
    <div>
      <h1>Stats en Temps Réel</h1>
      {Object.entries(teamsData).map(([teamName, players]) => (
        <div key={teamName}>
          <h2>{teamName}</h2>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Points</th>
                <th>Rebonds</th>
                <th>Passes</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.stats.points}</td>
                  <td>{player.stats.rebounds}</td>
                  <td>{player.stats.assists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
