"use server"

import { db } from "@/server/db";
import { tornei, squadre, giocatori } from "@/server/db/schema";
import { createId } from '@paralleldrive/cuid2';

export async function getTornei() {
  const result = await db.select().from(tornei);
  return result;
}

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

export async function submitTeamAndPlayers({ team, players, idTorneo }: { team: TeamData, players: PlayerData[], idTorneo: string }) {
  try {
    const [insertedTeam] = await db.insert(squadre).values({
      idSquadra: createId(),
      nome: team.nome,
      colore: team.colore,
      cellulare: team.cellulare,
      statoAccettazione: false,
      idTorneo: idTorneo, // Add this line to include the idTorneo
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

export async function submitTorneo({ nome, descrizione, dataInizio, dataFine }: { nome: string, descrizione: string, dataInizio: string, dataFine: string }) {
  try {
    await db.insert(tornei).values({
      idTorneo: createId(),
      nome,
      descrizione,
      dataInizio,
      dataFine,
      stato: 'programmato', // Initial state
    });
    return { success: true };
  } catch (error) {
    console.error("Error in submitTorneo:", error);
    return { success: false, error: "Failed to submit tournament" };
  }
}