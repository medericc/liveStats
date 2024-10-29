// app/components/Match.tsx
"use client";
import { useEffect, useState } from 'react';
import { useCombinedStats } from '../context/CombinedStatsContext';

export default function Match() {
  const { teamsData, updatePlayerStat, resetStats } = useCombinedStats();
  const [quarterTime, setQuarterTime] = useState(600); // 600 seconds for 10 minutes

  useEffect(() => {
    // Reset stats to zero at the beginning
    resetStats();
    
    // Countdown timer for the quarter
    const timer = setInterval(() => {
      setQuarterTime(prevTime => {
        if (prevTime > 0) return prevTime - 1;
        clearInterval(timer);
        return 0;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [resetStats]);

  if (!teamsData) return <div>Loading...</div>;

  // Helper function to format time in MM:SS format
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div>
      <h1>Match en direct</h1>
      <h2>Temps restant dans le 1er quart-temps: {formatTime(quarterTime)}</h2>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map(player => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.stats.points}</td>
                  <td>{player.stats.rebounds}</td>
                  <td>{player.stats.assists}</td>
                  <td>
                    <button onClick={() => updatePlayerStat(teamName, player.id, 'points', 2)}>+2 Pts</button>
                    <button onClick={() => updatePlayerStat(teamName, player.id, 'rebounds', 1)}>+1 Reb</button>
                    <button onClick={() => updatePlayerStat(teamName, player.id, 'assists', 1)}>+1 Pass</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
