"use server"

import { Squadre } from "@/app/(dash-lyt)/dashboard/iscrizioni/columns";
import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei, squadre, giocatori } from "@/server/db/schema"; // Import the schema

export async function getTornei() {
  const result = await db.select().from(tornei);
  return result;
}

import { createId } from '@paralleldrive/cuid2';
import { eq } from "drizzle-orm";

type TeamData = {
  idSquadra: string;
  nome: string;
  colore: string;
  cellulare: string;
  statoAccettazione: boolean;
  idTorneo: string;
};

type PlayerData = {
  cf: string;
  nome: string;
  cognome: string;
  dataNascita: string;
};

export async function updateSquadra(squadra: Squadre) {
  try {
    await db.update(squadre)
      .set({
        nome: squadra.nome,
        colore: squadra.colore,
        cellulare: squadra.cellulare,
        statoAccettazione: squadra.statoAccettazione,
      })
      .where(eq(squadre.idSquadra, squadra.idSquadra));
    return { success: true };
  } catch (error) {
    console.error("Error in updateSquadra:", error);
    return { success: false, error: "Failed to update squadra" };
  }
}

export async function deleteSquadra(squadra: Squadre) {
  try {
    await db.delete(squadre).where(eq(squadre.idSquadra, squadra.idSquadra));
    return { success: true };
  } catch (error) {
    console.error("Error in deleteSquadra:", error);
    return { success: false, error: "Failed to delete squadra" };
  }
}


export async function submitTeamAndPlayers({ team, players }: { team: TeamData, players: PlayerData[] }) {
  try {
    const [insertedTeam] = await db.insert(squadre).values({
      idSquadra: createId(),
      nome: team.nome,
      colore: team.colore,
      cellulare: team.cellulare,
      idTorneo: team.idTorneo, // Ensure to include this field
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
