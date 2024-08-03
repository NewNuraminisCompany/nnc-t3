"use server";

import { Giocatore } from "@/app/(dash-lyt)/dashboard/iscrizioni/[idSquadra]/page";
import { Squadre } from "@/app/(dash-lyt)/dashboard/iscrizioni/columns";
import { db } from "@/server/db"; // Import your Drizzle ORM setup
import { tornei, squadre, giocatori, gironi } from "@/server/db/schema"; // Import the schema

export async function getTornei() {
  const result = await db.select().from(tornei);
  return result;
}

import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

type TeamData = {
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

export async function addGiocatori({
  idSquadra,
  giocatori: players,
}: {
  idSquadra: string;
  giocatori: PlayerData[];
}) {
  try {
    const newGiocatori = await db.insert(giocatori).values(
      players.map((player) => ({
        idGiocatore: createId(),
        idSquadra,
        cf: player.cf,
        nome: player.nome,
        cognome: player.cognome,
        dataNascita: player.dataNascita,
      }))
    ).returning();

    return { success: true, giocatori: newGiocatori };
  } catch (error) {
    console.error("Error in addGiocatori:", error);
    return { success: false, error: "Failed to add giocatori" };
  }
}

export async function updateGiocatore(giocatore: Giocatore) {
  try {
    await db
      .update(giocatori)
      .set({
        nome: giocatore.nome,
        cf: giocatore.cf,
        cognome: giocatore.cognome,
        dataNascita: giocatore.dataNascita,
      })
      .where(eq(squadre.idSquadra, giocatore.idSquadra));
    return { success: true };
  } catch (error) {
    console.error("Error in updateSquadra:", error);
    return { success: false, error: "Failed to update squadra" };
  }
}

export async function updateSquadra(squadra: Squadre) {
  try {
    await db
      .update(squadre)
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

export async function fetchPlayers(squadraId: string) {
  try {
    const players = await db.query.giocatori.findMany({
      where: eq(giocatori.idSquadra, squadraId),
      with: {
        squadra: true,
      },
    });
    return players;
  } catch (error) {
    console.error("Error fetching players:", error);
    throw new Error("Failed to fetch players");
  }
}

export async function submitTeamAndPlayers({
  team,
  players,
}: {
  team: TeamData;
  players: PlayerData[];
  idTorneo: string;
}) {
  try {
    const [insertedTeam] = await db
      .insert(squadre)
      .values({
        idSquadra: createId(),
        nome: team.nome,
        colore: team.colore,
        cellulare: team.cellulare,
        idTorneo: team.idTorneo,
        statoAccettazione: false,
      })
      .returning();

    if (!insertedTeam) {
      throw new Error("Failed to insert team data");
    }

    await db.insert(giocatori).values(
      players.map((player) => ({
        ...player,
        idSquadra: insertedTeam.idSquadra,
      })),
    );

    return { success: true };
  } catch (error) {
    console.error("Error in submitTeamAndPlayers:", error);
    return { success: false, error: "Failed to submit team and players" };
  }
}

export async function submitTorneo({
  nome,
  descrizione,
  dataInizio,
  dataFine,
}: {
  nome: string;
  descrizione: string;
  dataInizio: string;
  dataFine: string;
}) {
  try {
    await db.insert(tornei).values({
      idTorneo: createId(),
      nome,
      descrizione,
      dataInizio,
      dataFine,
      stato: "programmato", // Initial state
    });
    return { success: true };
  } catch (error) {
    console.error("Error in submitTorneo:", error);
    return { success: false, error: "Failed to submit tournament" };
  }
}


export async function fetchSquadre() {
  try {
    console.log("Fetching data from squadre, tornei, and gironi tables...");
    const result = await db
      .select({
        idSquadra: squadre.idSquadra,
        nome: squadre.nome,
        colore: squadre.colore,
        cellulare: squadre.cellulare,
        statoAccettazione: squadre.statoAccettazione,
        idTorneo: squadre.idTorneo,
        nomeTorneo: tornei.nome,
        nomeGirone: gironi.nome,
      })
      .from(squadre)
      .leftJoin(tornei, eq(squadre.idTorneo, tornei.idTorneo))
      .leftJoin(gironi, eq(squadre.idSquadra, gironi.idSquadra));
    console.log(`Fetched ${result.length} records from squadre table.`);

    if (result.length === 0) {
      console.log("No records found in the squadre table.");
      return [];
    }

    return result.map((record) => ({
      idSquadra: record.idSquadra,
      nome: record.nome,
      colore: record.colore,
      cellulare: record.cellulare,
      statoAccettazione: record.statoAccettazione ?? false,
      idTorneo: record.idTorneo,
      nomeTorneo: record.nomeTorneo ?? "Torneo sconosciuto",
      nomeGirone: record.nomeGirone ?? "Girone non assegnato",
    }));
  } catch (error) {
    console.error("Error fetching squadre:", error);
    throw new Error(
      `Failed to fetch squadre: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}