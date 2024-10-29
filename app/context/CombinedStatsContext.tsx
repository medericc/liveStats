// app/context/CombinedStatsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Définition des types pour les statistiques des joueurs, les joueurs, et les données des équipes
export type PlayerStats = {
  points: number;
  rebounds: number;
  assists: number;
  minutes: string;
  "2P%": number;
  "3P%": number;
  "FT%": number;
};

export type Player = {
  id: number;
  name: string;
  position?: string;
  stats: PlayerStats;
};

type TeamsData = {
  [key: string]: Player[];
};

// Interface du contexte, combinant toutes les fonctions et données requises
interface CombinedStatsContextType {
  teamsData: TeamsData | null;
  updateTeamsData: () => void;
  resetStats: () => void;
  updatePlayerStat: (
    teamName: string,
    playerId: number,
    stat: keyof PlayerStats,
    value: number
  ) => void;
  setTeamsData: React.Dispatch<React.SetStateAction<TeamsData | null>>;
}

// Création du contexte avec une valeur par défaut undefined
const CombinedStatsContext = createContext<CombinedStatsContextType | undefined>(undefined);

// Composant Provider combiné
export const CombinedStatsProvider = ({ children }: { children: ReactNode }) => {
  const [teamsData, setTeamsData] = useState<TeamsData | null>(null);

  // Fonction pour récupérer les statistiques initiales depuis une API ou un fichier
  const fetchStats = async () => {
    try {
      const response = await fetch("/stats.json");
      const data = await response.json();
      setTeamsData(data.teams);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques :", error);
    }
  };

  // Appel initial pour charger les données
  useEffect(() => {
    fetchStats();
  }, []);

  // Fonction pour mettre à jour les données d’équipe
  const updateTeamsData = async () => {
    await fetchStats();
  };

  // Fonction pour réinitialiser les statistiques de chaque joueur
  const resetStats = () => {
    if (!teamsData) return;

    const resetData = Object.fromEntries(
      Object.entries(teamsData).map(([teamName, players]) => [
        teamName,
        players.map((player) => ({
          ...player,
          stats: {
            points: 0,
            rebounds: 0,
            assists: 0,
            minutes: "0",
            "2P%": 0,
            "3P%": 0,
            "FT%": 0,
          },
        })),
      ])
    );

    setTeamsData(resetData);
  };

  // Fonction pour mettre à jour une statistique spécifique d'un joueur
  const updatePlayerStat = (
    teamName: string,
    playerId: number,
    stat: keyof PlayerStats,
    value: number
  ) => {
    if (!teamsData) return;

    const updatedTeams = { ...teamsData };
    const player = updatedTeams[teamName]?.find((p) => p.id === playerId);

    if (player) {
      if (stat === "minutes") {
        player.stats[stat] = String(parseInt(player.stats[stat]) + value); // Ajoute des minutes sous forme de chaîne
      } else {
        player.stats[stat] += value; // Incrémente les statistiques numériques
      }
      setTeamsData(updatedTeams);
    }
  };

  return (
    <CombinedStatsContext.Provider
      value={{
        teamsData,
        updateTeamsData,
        resetStats,
        updatePlayerStat,
        setTeamsData,
      }}
    >
      {children}
    </CombinedStatsContext.Provider>
  );
};

// Hook pour accéder au contexte
export const useCombinedStats = () => {
  const context = useContext(CombinedStatsContext);
  if (!context) {
    throw new Error("useCombinedStats must be used within a CombinedStatsProvider");
  }
  return context;
};
