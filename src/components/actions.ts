"use server"

import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei, squadre, giocatori } from "@/server/db/schema"; // Import the schema

export async function getTornei() {
  const result = await db.select().from(tornei);
  return result;
}

import { createId } from '@paralleldrive/cuid2';

type TeamData = {
  nome: string;
  colore: string;
  cellulare: string;
};

type PlayerData = {
  cf: string;
  nome: string;
  cognome: string;
  dataNascita: string;
};

export async function submitTeamAndPlayers({ team, players }: { team: TeamData, players: PlayerData[] }) {
  try {
    const [insertedTeam] = await db.insert(squadre).values({
      idSquadra: createId(),
      nome: team.nome,
      colore: team.colore,
      cellulare: team.cellulare,
      statoAccettazione: false,
    }).returning();

    if (!insertedTeam) {
      throw new Error("Failed to insert team data");
    }

    await db.insert(giocatori).values(
      players.map(player => ({
        ...player,
        idSquadra: insertedTeam.idSquadra,
      }))
    );

    return { success: true };
  } catch (error) {
    console.error("Error in submitTeamAndPlayers:", error);
    return { success: false, error: "Failed to submit team and players" };
  }
}
